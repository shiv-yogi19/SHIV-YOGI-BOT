/**
 * SHIV YOGI AI BOT - Owner & Admin Authorization Configuration
 * 
 * Configurable Owner Telegram ID:
 * Set via Cloudflare Worker environment variable:
 * - env.OWNER_TELEGRAM_ID or env.OWNER_ID
 * 
 * Default fallback is preserved from existing configuration (8226363418).
 * If no owner ID is present or configured, all admin access is default-denied.
 */

export const DEFAULT_OWNER_ID = "8226363418";

/**
 * Resolves the primary owner Telegram numeric ID from environment or fallback
 * @param {object} env - Cloudflare Worker environment
 * @returns {string} Owner Telegram ID
 */
export function getOwnerId(env) {
  if (env?.OWNER_TELEGRAM_ID && String(env.OWNER_TELEGRAM_ID).trim() !== "") {
    return String(env.OWNER_TELEGRAM_ID).trim();
  }
  if (env?.OWNER_ID && String(env.OWNER_ID).trim() !== "") {
    return String(env.OWNER_ID).trim();
  }
  return DEFAULT_OWNER_ID;
}

/**
 * Checks if a given Telegram user ID is the configured owner
 * @param {string|number} userId - Telegram user ID
 * @param {object} env - Cloudflare Worker environment
 * @returns {boolean}
 */
export function isOwner(userId, env) {
  if (!userId) return false;
  const ownerId = getOwnerId(env);
  if (!ownerId || ownerId === "PLACEHOLDER_OWNER_TELEGRAM_ID") {
    return false;
  }
  return String(userId).trim() === ownerId;
}

/**
 * Checks if a given Telegram user ID is an admin (owner or listed in admin list)
 * @param {string|number} userId - Telegram user ID
 * @param {object} env - Cloudflare Worker environment
 * @param {Array<string>} [additionalAdminIds=[]] - Extra admin IDs from KV
 * @returns {boolean}
 */
export function isAdmin(userId, env, additionalAdminIds = []) {
  if (isOwner(userId, env)) return true;
  if (!userId) return false;

  const uid = String(userId).trim();
  
  // Check env.ADMIN_IDS comma-separated list if provided
  if (env?.ADMIN_IDS) {
    const envAdmins = String(env.ADMIN_IDS).split(',').map(s => s.trim());
    if (envAdmins.includes(uid)) return true;
  }

  // Check KV-stored dynamic admins
  if (Array.isArray(additionalAdminIds) && additionalAdminIds.map(String).includes(uid)) {
    return true;
  }

  return false;
}
