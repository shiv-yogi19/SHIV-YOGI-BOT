/**
 * SHIV YOGI AI BOT - Safe KV Auto-Cleanup Engine
 * 
 * Cleans expired temporary data (rate-limits, deduplication tokens, temporary tasks)
 * without ever deleting permanent user profiles, memory, or admin configuration.
 */

import { kvList, kvGet, kvDelete, kvPut } from './kv.js';
import { KEY_PREFIXES, KEYS } from './keys.js';

const MAX_BATCH_KEYS = 50;

/**
 * Runs safe KV auto-cleanup
 * @param {object} env - Cloudflare Worker environment
 * @param {object} [options={}] - Options like dryRun, limit
 * @returns {Promise<object>} Cleanup statistics
 */
export async function runKvAutoCleanup(env, options = {}) {
  const startTime = Date.now();
  const limit = options.limit || MAX_BATCH_KEYS;
  const isDryRun = options.dryRun || false;

  const stats = {
    timestamp: startTime,
    scannedKeys: 0,
    deletedKeys: 0,
    preservedPermanentKeys: 0,
    categories: {
      tasks: 0,
      rateLimits: 0,
      dedup: 0,
      expiredHistory: 0
    },
    durationMs: 0,
    status: 'COMPLETED'
  };

  try {
    // 1. Clean expired deduplication records
    const dedupList = await kvList(env, { prefix: KEY_PREFIXES.DEDUP, limit });
    for (const keyItem of dedupList.keys) {
      stats.scannedKeys++;
      if (stats.deletedKeys >= limit) break;

      const record = await kvGet(env, keyItem.name, null);
      // Dedup records older than 10 minutes are deleted
      if (!record || (typeof record === 'object' && record.timestamp && startTime - record.timestamp > 600000)) {
        if (!isDryRun) await kvDelete(env, keyItem.name);
        stats.deletedKeys++;
        stats.categories.dedup++;
      }
    }

    // 2. Clean temporary tasks
    if (stats.deletedKeys < limit) {
      const taskList = await kvList(env, { prefix: KEY_PREFIXES.TASK, limit: limit - stats.deletedKeys });
      for (const keyItem of taskList.keys) {
        stats.scannedKeys++;
        if (stats.deletedKeys >= limit) break;

        const task = await kvGet(env, keyItem.name, null);
        // Tasks older than 24h or marked done
        if (!task || (task.createdAt && startTime - task.createdAt > 86400000) || task.completed) {
          if (!isDryRun) await kvDelete(env, keyItem.name);
          stats.deletedKeys++;
          stats.categories.tasks++;
        }
      }
    }

    // 3. Clean expired rate-limit records
    if (stats.deletedKeys < limit) {
      const rlList = await kvList(env, { prefix: KEY_PREFIXES.RATELIMIT, limit: limit - stats.deletedKeys });
      for (const keyItem of rlList.keys) {
        stats.scannedKeys++;
        if (stats.deletedKeys >= limit) break;

        const rl = await kvGet(env, keyItem.name, null);
        // Rate limit records older than 10 minutes are stale
        if (!rl || (rl.resetAt && startTime > rl.resetAt + 600000)) {
          if (!isDryRun) await kvDelete(env, keyItem.name);
          stats.deletedKeys++;
          stats.categories.rateLimits++;
        }
      }
    }

    stats.durationMs = Date.now() - startTime;

    // Save cleanup audit record
    if (!isDryRun) {
      await kvPut(env, KEYS.cleanupLast(), stats);
    }

    return stats;
  } catch (err) {
    console.error('KV CLEANUP ERROR:', err.message);
    stats.status = 'ERROR';
    stats.error = err.message;
    stats.durationMs = Date.now() - startTime;
    return stats;
  }
}
