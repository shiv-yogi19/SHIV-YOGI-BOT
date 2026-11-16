/**
 * SHIV YOGI AI BOT - Centralized KV Storage Client
 * 
 * Provides safe JSON serialization, error boundaries, fallback in-memory cache
 * for testing, and specialized entity helpers for profiles, history, and notices.
 */

import { KEYS } from './keys.js';
import {
  createDefaultUserProfile,
  createDefaultUserSettings,
  createDefaultAdminConfig
} from './schemas.js';
import { AI_CONFIG } from '../config/constants.js';

// In-memory fallback map used strictly when env.BOT_DATA is absent (e.g. unit tests)
const memoryFallbackMap = new Map();

/**
 * Safely retrieves and parses a value from KV storage
 * @param {object} env - Cloudflare Worker environment
 * @param {string} key - Storage key
 * @param {any} [defaultValue=null] - Default fallback value
 * @returns {Promise<any>}
 */
export async function kvGet(env, key, defaultValue = null) {
  if (!key) return defaultValue;
  try {
    if (env?.BOT_DATA && typeof env.BOT_DATA.get === 'function') {
      const raw = await env.BOT_DATA.get(key);
      if (raw === null || raw === undefined) return defaultValue;
      try {
        return JSON.parse(raw);
      } catch {
        return raw; // If raw string
      }
    }
    // Fallback for tests or local execution
    if (memoryFallbackMap.has(key)) {
      const stored = memoryFallbackMap.get(key);
      try {
        return JSON.parse(stored);
      } catch {
        return stored;
      }
    }
    return defaultValue;
  } catch (err) {
    console.error(`KV GET ERROR [${key}]:`, err.message);
    return defaultValue;
  }
}

/**
 * Safely writes a JSON-serialized value into KV storage
 * @param {object} env - Cloudflare Worker environment
 * @param {string} key - Storage key
 * @param {any} value - Value to serialize and store
 * @param {object} [options={}] - KV put options (expirationTtl, etc.)
 * @returns {Promise<boolean>}
 */
export async function kvPut(env, key, value, options = {}) {
  if (!key) return false;
  try {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    if (env?.BOT_DATA && typeof env.BOT_DATA.put === 'function') {
      await env.BOT_DATA.put(key, serialized, options);
      return true;
    }
    // Fallback for tests
    memoryFallbackMap.set(key, serialized);
    return true;
  } catch (err) {
    console.error(`KV PUT ERROR [${key}]:`, err.message);
    return false;
  }
}

/**
 * Safely removes a key from KV storage
 * @param {object} env - Cloudflare Worker environment
 * @param {string} key - Storage key
 * @returns {Promise<boolean>}
 */
export async function kvDelete(env, key) {
  if (!key) return false;
  try {
    if (env?.BOT_DATA && typeof env.BOT_DATA.delete === 'function') {
      await env.BOT_DATA.delete(key);
      return true;
    }
    memoryFallbackMap.delete(key);
    return true;
  } catch (err) {
    console.error(`KV DELETE ERROR [${key}]:`, err.message);
    return false;
  }
}

/**
 * Lists keys by prefix
 * @param {object} env - Cloudflare Worker environment
 * @param {object} [options={}] - Prefix, limit, cursor
 * @returns {Promise<{ keys: Array<{ name: string }>, list_complete: boolean, cursor?: string }>}
 */
export async function kvList(env, options = {}) {
  try {
    if (env?.BOT_DATA && typeof env.BOT_DATA.list === 'function') {
      return await env.BOT_DATA.list(options);
    }
    // Fallback listing from memory map
    const prefix = options.prefix || '';
    const matching = [];
    for (const k of memoryFallbackMap.keys()) {
      if (k.startsWith(prefix)) {
        matching.push({ name: k });
      }
    }
    const limit = options.limit || 1000;
    return {
      keys: matching.slice(0, limit),
      list_complete: true
    };
  } catch (err) {
    console.error('KV LIST ERROR:', err.message);
    return { keys: [], list_complete: true };
  }
}

// -------------------------------------------------------------
// Specialized Entity Helpers
// -------------------------------------------------------------

export async function getUserProfile(env, userId, from = {}) {
  const key = KEYS.profile(userId);
  let profile = await kvGet(env, key, null);
  if (!profile) {
    profile = createDefaultUserProfile(userId, from);
    await kvPut(env, key, profile);
  }
  return profile;
}

export async function saveUserProfile(env, userId, profile) {
  return await kvPut(env, KEYS.profile(userId), profile);
}

export async function touchUserProfile(env, userId, from = {}) {
  const profile = await getUserProfile(env, userId, from);
  const now = Date.now();
  const today = new Date(now).toISOString().split('T')[0];

  profile.lastActiveAt = now;
  profile.totalRequests = (profile.totalRequests || 0) + 1;

  if (profile.lastRequestDay !== today) {
    profile.lastRequestDay = today;
    profile.dailyRequests = 1;
  } else {
    profile.dailyRequests = (profile.dailyRequests || 0) + 1;
  }

  if (from.username) profile.username = from.username;
  if (from.first_name) profile.firstName = from.first_name;

  await saveUserProfile(env, userId, profile);
  return profile;
}

export async function getUserSettings(env, userId) {
  const key = KEYS.settings(userId);
  let settings = await kvGet(env, key, null);
  if (!settings) {
    settings = createDefaultUserSettings();
    await kvPut(env, key, settings);
  }
  return settings;
}

export async function saveUserSettings(env, userId, settings) {
  return await kvPut(env, KEYS.settings(userId), settings);
}

export async function getUserHistory(env, userId) {
  return (await kvGet(env, KEYS.history(userId), [])) || [];
}

export async function saveUserHistory(env, userId, history) {
  const maxTurns = AI_CONFIG.MAX_HISTORY_TURNS;
  // Keep only the most recent N turns (each turn has user + model)
  const trimmed = Array.isArray(history) ? history.slice(-maxTurns * 2) : [];
  return await kvPut(env, KEYS.history(userId), trimmed, { expirationTtl: 86400 * 7 }); // 7 days TTL
}

export async function appendUserHistory(env, userId, userText, modelText) {
  const history = await getUserHistory(env, userId);
  history.push({
    role: 'user',
    parts: [{ text: userText }],
    timestamp: Date.now()
  });
  history.push({
    role: 'model',
    parts: [{ text: modelText }],
    timestamp: Date.now()
  });
  await saveUserHistory(env, userId, history);
}

export async function clearUserHistory(env, userId) {
  return await kvDelete(env, KEYS.history(userId));
}

export async function getUserMemory(env, userId) {
  return (await kvGet(env, KEYS.memory(userId), [])) || [];
}

export async function saveUserMemory(env, userId, facts) {
  return await kvPut(env, KEYS.memory(userId), facts);
}

export async function addMemoryFact(env, userId, factText) {
  const facts = await getUserMemory(env, userId);
  if (facts.length >= AI_CONFIG.MAX_MEMORY_FACTS) {
    facts.shift(); // Remove oldest
  }
  facts.push({
    id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    fact: factText.trim(),
    createdAt: Date.now()
  });
  await saveUserMemory(env, userId, facts);
  return facts;
}

export async function clearUserMemory(env, userId) {
  return await kvDelete(env, KEYS.memory(userId));
}

export async function getAdminConfig(env) {
  let config = await kvGet(env, KEYS.adminConfig(), null);
  if (!config) {
    config = createDefaultAdminConfig();
    await kvPut(env, KEYS.adminConfig(), config);
  }
  return config;
}

export async function saveAdminConfig(env, config) {
  config.updatedAt = Date.now();
  return await kvPut(env, KEYS.adminConfig(), config);
}

export async function getActiveNotice(env) {
  const notice = await kvGet(env, KEYS.noticeActive(), null);
  if (!notice || !notice.enabled) return null;
  if (notice.expiresAt && Date.now() > notice.expiresAt) {
    return null;
  }
  return notice;
}

export async function saveActiveNotice(env, noticeRecord) {
  return await kvPut(env, KEYS.noticeActive(), noticeRecord);
}

export async function deleteActiveNotice(env) {
  return await kvDelete(env, KEYS.noticeActive());
}

export async function getUserTodos(env, userId) {
  return (await kvGet(env, KEYS.todo(userId), [])) || [];
}

export async function saveUserTodos(env, userId, todos) {
  return await kvPut(env, KEYS.todo(userId), todos);
}

export async function getUserReminders(env, userId) {
  return (await kvGet(env, KEYS.remind(userId), [])) || [];
}

export async function saveUserReminders(env, userId, reminders) {
  return await kvPut(env, KEYS.remind(userId), reminders);
}
