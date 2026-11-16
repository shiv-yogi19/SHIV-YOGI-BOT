/**
 * SHIV YOGI AI BOT - Sliding Window Rate Limiting
 * Protects KV and external APIs from abuse with per-user limits.
 */

import { kvGet, kvPut } from '../storage/kv.js';
import { KEYS } from '../storage/keys.js';
import { RATE_LIMITS } from '../config/constants.js';
import { isAdmin } from '../config/owner.js';

export async function checkRateLimit(env, userId, customMax = null) {
  if (!userId) return { allowed: true, remaining: 99 };

  // Admins get elevated rate limits
  const isAdm = isAdmin(userId, env);
  const maxAllowed = customMax || (isAdm ? RATE_LIMITS.ADMIN_MAX : RATE_LIMITS.DEFAULT_USER_MAX);
  const windowMs = RATE_LIMITS.WINDOW_SECONDS * 1000;
  const now = Date.now();

  const key = KEYS.rateLimit(userId);
  const record = (await kvGet(env, key, null)) || { count: 0, resetAt: now + windowMs };

  if (now > record.resetAt) {
    // Window expired, start new window
    record.count = 1;
    record.resetAt = now + windowMs;
  } else {
    record.count = (record.count || 0) + 1;
  }

  const remaining = Math.max(0, maxAllowed - record.count);
  const resetInSeconds = Math.ceil((record.resetAt - now) / 1000);

  if (record.count > maxAllowed) {
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds
    };
  }

  // Update KV with TTL
  await kvPut(env, key, record, { expirationTtl: RATE_LIMITS.WINDOW_SECONDS + 30 });

  return {
    allowed: true,
    remaining,
    resetInSeconds
  };
}
