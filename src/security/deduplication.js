/**
 * SHIV YOGI AI BOT - Telegram Update Deduplication
 * Prevents double-processing of identical update IDs caused by Telegram retry deliveries.
 */

import { kvGet, kvPut } from '../storage/kv.js';
import { KEYS } from '../storage/keys.js';

export async function isDuplicateUpdate(env, updateId) {
  if (!updateId) return false;

  const key = KEYS.dedup(updateId);
  const existing = await kvGet(env, key, null);
  if (existing) {
    return true;
  }

  // Store for 3 minutes (180s)
  await kvPut(env, key, { timestamp: Date.now() }, { expirationTtl: 180 });
  return false;
}
