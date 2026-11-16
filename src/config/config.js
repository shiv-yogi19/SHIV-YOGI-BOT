/**
 * SHIV YOGI AI BOT - Centralized Configuration Loader
 * Handles environment variables, secrets, KV binding access, and defaults.
 * NEVER prints or exposes secret values.
 */

import { BOT_IDENTITY, AI_CONFIG, RATE_LIMITS } from './constants.js';
import { getOwnerId } from './owner.js';

/**
 * Builds normalized application configuration from Worker env
 * @param {object} env - Cloudflare Worker environment
 * @returns {object} Application configuration
 */
export function loadConfig(env = {}) {
  return {
    bot: {
      username: BOT_IDENTITY.USERNAME,
      name: BOT_IDENTITY.NAME,
      link: BOT_IDENTITY.LINK,
      workerName: BOT_IDENTITY.WORKER_NAME,
      workerUrl: BOT_IDENTITY.WORKER_URL,
      version: BOT_IDENTITY.VERSION,
      ownerId: getOwnerId(env)
    },
    secrets: {
      hasTelegramToken: Boolean(env?.TELEGRAM_BOT_TOKEN),
      hasGeminiKey: Boolean(env?.GEMINI_API_KEY),
      hasWebhookSecret: Boolean(env?.WEBHOOK_SECRET)
    },
    ai: {
      defaultModel: env?.GEMINI_MODEL || AI_CONFIG.DEFAULT_MODEL,
      fallbackModel: AI_CONFIG.FALLBACK_MODEL,
      imagenModel: env?.IMAGEN_MODEL || AI_CONFIG.IMAGEN_MODEL,
      maxTokens: AI_CONFIG.MAX_OUTPUT_TOKENS,
      temperature: AI_CONFIG.TEMPERATURE,
      timeoutMs: AI_CONFIG.TIMEOUT_MS,
      maxRetries: AI_CONFIG.MAX_RETRIES,
      maxHistoryTurns: AI_CONFIG.MAX_HISTORY_TURNS,
      maxMemoryFacts: AI_CONFIG.MAX_MEMORY_FACTS
    },
    rateLimits: {
      windowSeconds: RATE_LIMITS.WINDOW_SECONDS,
      defaultMaxRequests: RATE_LIMITS.DEFAULT_USER_MAX,
      imageMaxHourly: RATE_LIMITS.IMAGE_GEN_HOURLY_MAX,
      adminMax: RATE_LIMITS.ADMIN_MAX
    },
    kv: {
      bindingName: BOT_IDENTITY.KV_BINDING,
      isBound: Boolean(env?.BOT_DATA)
    }
  };
}

/**
 * Validates presence of critical environment variables and bindings
 * @param {object} env - Cloudflare Worker environment
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateEnvironment(env = {}) {
  const errors = [];

  if (!env?.TELEGRAM_BOT_TOKEN) {
    errors.push('Missing TELEGRAM_BOT_TOKEN in Cloudflare Worker secrets');
  }
  if (!env?.GEMINI_API_KEY) {
    errors.push('Missing GEMINI_API_KEY in Cloudflare Worker secrets');
  }
  if (!env?.WEBHOOK_SECRET) {
    errors.push('Missing WEBHOOK_SECRET in Cloudflare Worker secrets');
  }
  if (!env?.BOT_DATA) {
    errors.push('Missing BOT_DATA KV namespace binding');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
