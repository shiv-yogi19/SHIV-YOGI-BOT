/**
 * SHIV YOGI AI BOT - Command Registry & Router Verification Tests
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { COMMANDS, getUserCommandsCount, getAdminCommandsCount, getCommand } from '../src/core/command-registry.js';
import { safeCalculate } from '../src/utilities/helpers.js';

test('Verify 60 User Commands Count and Handlers', () => {
  const userCount = getUserCommandsCount();
  assert.equal(userCount, 60, `Expected exactly 60 User Commands, found: ${userCount}`);

  // Check specific essential commands
  const essentials = ['/start', '/help', '/ask', '/chat', '/code', '/image', '/pdf', '/calculate', '/status', '/ping'];
  for (const cmd of essentials) {
    const def = getCommand(cmd);
    assert.ok(def, `Command ${cmd} should be registered`);
    assert.equal(typeof def.handler, 'function', `Handler for ${cmd} must be a function`);
    assert.equal(def.adminOnly, false, `Command ${cmd} should be user accessible`);
  }
});

test('Verify 31 Admin Commands Count and Authorization Flags', () => {
  const adminCount = getAdminCommandsCount();
  assert.equal(adminCount, 31, `Expected exactly 31 Admin Commands, found: ${adminCount}`);

  // Check all admin commands are marked adminOnly: true
  const adminEssentials = [
    '/admin', '/adminhelp', '/stats', '/users', '/user', '/userinfo',
    '/ban', '/unban', '/mute', '/unmute', '/broadcast', '/notice',
    '/delnotice', '/maintenance', '/setmaintenance', '/features',
    '/enablefeature', '/disablefeature', '/setlimit', '/usage',
    '/topusers', '/logs', '/errors', '/health', '/storage',
    '/cleanup', '/backup', '/restore', '/settingsadmin', '/test', '/announce'
  ];

  for (const cmd of adminEssentials) {
    const def = getCommand(cmd);
    assert.ok(def, `Admin command ${cmd} must be registered`);
    assert.equal(typeof def.handler, 'function');
    assert.equal(def.adminOnly, true, `Admin command ${cmd} must have adminOnly: true`);
  }
});

test('Total Command Count is Exactly 91', () => {
  const total = Object.keys(COMMANDS).length;
  assert.equal(total, 91, `Expected exactly 91 total commands (60 user + 31 admin), found ${total}`);
});

test('Safe Math Calculator AST Evaluator (Zero eval)', () => {
  assert.equal(safeCalculate('2 + 2'), 4);
  assert.equal(safeCalculate('10 - 3 * 2'), 4);
  assert.equal(safeCalculate('(5 + 5) * 2'), 20);
  assert.equal(safeCalculate('sqrt(144) + 8'), 20);
  assert.equal(safeCalculate('2 ^ 3'), 8);
  assert.equal(safeCalculate('abs(-50) + 10'), 60);

  // Error handling
  assert.throws(() => safeCalculate('10 / 0'), /Division by zero/);
  assert.throws(() => safeCalculate('invalid_math()'), /Invalid/);
});
