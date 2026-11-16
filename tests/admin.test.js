/**
 * SHIV YOGI AI BOT - Admin Authorization and Management Tests
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { checkAdminAccess } from '../src/admin/authorization.js';
import { banUser, unbanUser, muteUser, unmuteUser } from '../src/admin/users.js';
import { setGlobalNotice, removeGlobalNotice, getNoticeStatus } from '../src/admin/notices.js';
import { createBackup, restoreBackup } from '../src/storage/backup.js';
import { DEFAULT_OWNER_ID } from '../src/config/owner.js';
import { getAdminConfig, saveAdminConfig } from '../src/storage/kv.js';

test('Admin Authorization Default-Deny Model', async () => {
  const env = { OWNER_TELEGRAM_ID: '8226363418' };

  // Owner is authorized
  const isOwnerAuth = await checkAdminAccess('8226363418', env);
  assert.equal(isOwnerAuth, true);

  // Random user is default-denied
  const isUserAuth = await checkAdminAccess('9999999999', env);
  assert.equal(isUserAuth, false);

  // Empty or null user is denied
  assert.equal(await checkAdminAccess(null, env), false);
  assert.equal(await checkAdminAccess('', env), false);
});

test('User Moderation (Ban and Mute)', async () => {
  const env = {};
  const targetId = 'bad_actor_99';

  // Ban user
  const bannedProfile = await banUser(env, targetId, 'Spamming bot');
  assert.equal(bannedProfile.isBanned, true);
  assert.equal(bannedProfile.banReason, 'Spamming bot');

  // Unban user
  const unbannedProfile = await unbanUser(env, targetId);
  assert.equal(unbannedProfile.isBanned, false);

  // Mute user for 30 minutes
  const mutedProfile = await muteUser(env, targetId, 30);
  assert.equal(mutedProfile.isMuted, true);
  assert.ok(mutedProfile.muteUntil > Date.now());

  // Unmute user
  const unmutedProfile = await unmuteUser(env, targetId);
  assert.equal(unmutedProfile.isMuted, false);
});

test('Notice Management Lifecycle', async () => {
  const env = {};
  const noticeText = 'Scheduled database upgrade tonight at 11 PM';

  await setGlobalNotice(env, noticeText, 5);
  const statusBefore = await getNoticeStatus(env);
  assert.ok(statusBefore.includes(noticeText));

  await removeGlobalNotice(env);
  const statusAfter = await getNoticeStatus(env);
  assert.ok(statusAfter.includes('no active system notice'));
});

test('Backup Snapshot and Restore Engine', async () => {
  const env = {};

  // Modify admin config
  const config = await getAdminConfig(env);
  config.maintenanceMode = true;
  await saveAdminConfig(env, config);

  // Take backup snapshot
  const backup = await createBackup(env, 'Pre-maintenance snapshot');
  assert.ok(backup.backupId);

  // Change config again
  config.maintenanceMode = false;
  await saveAdminConfig(env, config);

  // Restore from backup
  const restoreRes = await restoreBackup(env, backup.backupId);
  assert.equal(restoreRes.success, true);

  // Verify restored state
  const restoredConfig = await getAdminConfig(env);
  assert.equal(restoredConfig.maintenanceMode, true);
});
