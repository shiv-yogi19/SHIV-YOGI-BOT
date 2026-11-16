/**
 * SHIV YOGI AI BOT - KV Storage and User Data Isolation Tests
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  kvGet,
  kvPut,
  kvDelete,
  getUserProfile,
  touchUserProfile,
  getUserSettings,
  saveUserSettings,
  getUserHistory,
  saveUserHistory,
  appendUserHistory,
  getUserMemory,
  addMemoryFact
} from '../src/storage/kv.js';
import { runKvAutoCleanup } from '../src/storage/cleanup.js';

test('KV Basic Operations & Malformed JSON Resilience', async () => {
  const env = {};
  await kvPut(env, 'test:key', { message: 'hello' });
  const val = await kvGet(env, 'test:key');
  assert.equal(val.message, 'hello');

  // Test malformed JSON does not crash
  await kvPut(env, 'test:malformed', '{invalid_json');
  const malformedVal = await kvGet(env, 'test:malformed');
  assert.equal(malformedVal, '{invalid_json');

  await kvDelete(env, 'test:key');
  const deleted = await kvGet(env, 'test:key');
  assert.equal(deleted, null);
});

test('User Profile and Touch Tracking', async () => {
  const env = {};
  const userId = '111222333';
  const profile = await touchUserProfile(env, userId, { username: 'testuser', first_name: 'Test' });

  assert.equal(profile.userId, userId);
  assert.equal(profile.username, 'testuser');
  assert.equal(profile.totalRequests, 1);
  assert.equal(profile.dailyRequests, 1);

  // Subsequent touch increments
  const touchedAgain = await touchUserProfile(env, userId, {});
  assert.equal(touchedAgain.totalRequests, 2);
});

test('User Memory Isolation (User A vs User B)', async () => {
  const env = {};
  const userA = 'user_alpha_1';
  const userB = 'user_beta_2';

  await addMemoryFact(env, userA, 'User A loves Python');
  await addMemoryFact(env, userB, 'User B loves Rust');

  const memA = await getUserMemory(env, userA);
  const memB = await getUserMemory(env, userB);

  assert.equal(memA.length, 1);
  assert.equal(memA[0].fact, 'User A loves Python');

  assert.equal(memB.length, 1);
  assert.equal(memB[0].fact, 'User B loves Rust');

  // Verify User A cannot see User B's memory
  assert.equal(memA.some(m => m.fact.includes('Rust')), false);
  assert.equal(memB.some(m => m.fact.includes('Python')), false);
});

test('User History Isolation (User A vs User B)', async () => {
  const env = {};
  const userA = 'history_user_a';
  const userB = 'history_user_b';

  await appendUserHistory(env, userA, 'Hello from A', 'AI reply to A');
  await appendUserHistory(env, userB, 'Hello from B', 'AI reply to B');

  const histA = await getUserHistory(env, userA);
  const histB = await getUserHistory(env, userB);

  assert.equal(histA[0].parts[0].text, 'Hello from A');
  assert.equal(histB[0].parts[0].text, 'Hello from B');

  // Verify complete isolation
  assert.equal(histA.some(h => h.parts[0].text.includes('Hello from B')), false);
});

test('Safe KV Auto Cleanup Preserves Permanent User Data', async () => {
  const env = {};
  const userA = 'permanent_user_test';

  // Seed permanent data
  await touchUserProfile(env, userA, { first_name: 'Permanent' });
  await addMemoryFact(env, userA, 'Important user preference');

  // Seed temporary expired data
  await kvPut(env, 'task:temp_expired_task', { createdAt: Date.now() - 100000000 });
  await kvPut(env, 'dedup:old_update_123', { timestamp: Date.now() - 1000000 });

  // Run cleanup
  const stats = await runKvAutoCleanup(env);
  assert.equal(stats.status, 'COMPLETED');
  assert.ok(stats.deletedKeys >= 2);

  // Verify permanent data is completely untouched
  const profileAfter = await getUserProfile(env, userA);
  assert.equal(profileAfter.firstName, 'Permanent');

  const memoryAfter = await getUserMemory(env, userA);
  assert.equal(memoryAfter.length, 1);
  assert.equal(memoryAfter[0].fact, 'Important user preference');
});
