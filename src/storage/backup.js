/**
 * SHIV YOGI AI BOT - Configuration Backup and Restore Engine
 * Captures administrative settings, feature toggles, and notices into recoverable snapshots.
 */

import { kvGet, kvPut, getAdminConfig, saveAdminConfig, getActiveNotice, saveActiveNotice } from './kv.js';
import { KEYS } from './keys.js';
import { createBackupRecord } from './schemas.js';

export async function createBackup(env, note = '') {
  const backupId = `bkp_${Date.now()}`;
  const adminConfig = await getAdminConfig(env);
  const activeNotice = await getActiveNotice(env);

  const backupData = {
    adminConfig,
    activeNotice,
    createdAt: Date.now(),
    note: String(note).trim() || 'Manual Admin Backup'
  };

  const record = createBackupRecord(backupId, { note: backupData.note }, backupData);
  await kvPut(env, KEYS.backup(backupId), record);

  // Update backup index
  const index = (await kvGet(env, KEYS.backupIndex(), [])) || [];
  index.unshift({
    backupId,
    createdAt: record.createdAt,
    note: backupData.note
  });
  // Keep last 10 backups in index
  await kvPut(env, KEYS.backupIndex(), index.slice(0, 10));

  return record;
}

export async function listBackups(env) {
  return (await kvGet(env, KEYS.backupIndex(), [])) || [];
}

export async function restoreBackup(env, backupId) {
  const record = await kvGet(env, KEYS.backup(backupId), null);
  if (!record || !record.data) {
    throw new Error(`Backup not found: ${backupId}`);
  }

  const { adminConfig, activeNotice } = record.data;
  if (adminConfig) {
    await saveAdminConfig(env, adminConfig);
  }
  if (activeNotice) {
    await saveActiveNotice(env, activeNotice);
  }

  return {
    success: true,
    backupId,
    restoredAt: Date.now()
  };
}
