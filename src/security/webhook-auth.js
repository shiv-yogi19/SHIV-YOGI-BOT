/**
 * SHIV YOGI AI BOT - Telegram Webhook Authentication
 * 
 * Securely validates the incoming X-Telegram-Bot-Api-Secret-Token header
 * against env.WEBHOOK_SECRET using timing-safe comparison.
 */

/**
 * Constant-time string comparison to prevent timing attacks
 * @param {string} a 
 * @param {string} b 
 * @returns {boolean}
 */
function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Validates incoming Telegram webhook request header
 * @param {Request} request - Incoming HTTP request
 * @param {object} env - Cloudflare Worker environment
 * @returns {boolean} True if authorized, false otherwise
 */
export function verifyWebhookSecret(request, env) {
  if (!env || !env.WEBHOOK_SECRET) {
    console.error('WEBHOOK AUTH FAILED: env.WEBHOOK_SECRET is not configured');
    return false;
  }

  const incomingSecret = request.headers.get('X-Telegram-Bot-Api-Secret-Token') || '';
  if (!incomingSecret) {
    return false;
  }

  return timingSafeEqual(incomingSecret, env.WEBHOOK_SECRET);
}
