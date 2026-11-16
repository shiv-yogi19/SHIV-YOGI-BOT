/**
 * SHIV YOGI AI BOT - Centralized Admin Authorization Layer
 * Strict default-deny access model. Never grants access unless verified.
 */

import { isAdmin, isOwner, getOwnerId } from '../config/owner.js';
import { getAdminConfig, kvGet, kvPut } from '../storage/kv.js';
import { KEYS } from '../storage/keys.js';
import { MESSAGES } from '../config/constants.js';

export async function checkAdminAccess(userId, env) {
  if (!userId) return false;
  const config = await getAdminConfig(env);
  return isAdmin(userId, env, config.dynamicAdmins || []);
}

export async function requireAdmin(ctx) {
  const { client, chatId, userId, env, command } = ctx;
  const authorized = await checkAdminAccess(userId, env);

  if (!authorized) {
    console.warn(`UNAUTHORIZED ACCESS ATTEMPT: User ${userId} attempted admin command ${command || 'unknown'}`);
    
    // Log unauthorized attempt to admin audit
    try {
      const logs = (await kvGet(env, KEYS.adminActions(), [])) || [];
      logs.unshift({
        action: 'UNAUTHORIZED_ATTEMPT',
        userId,
        command: command || '',
        timestamp: Date.now()
      });
      await kvPut(env, KEYS.adminActions(), logs.slice(0, 50));
    } catch {}

    await client.sendMessage(chatId, MESSAGES.UNAUTHORIZED_HI);
    return false;
  }

  return true;
}
