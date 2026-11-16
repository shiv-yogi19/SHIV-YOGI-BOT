/**
 * SHIV YOGI AI BOT - Output Sanitization & Secret Masking
 * Ensures HTML output for Telegram is safe and no credentials ever leak in logs.
 */

/**
 * Escapes characters for Telegram HTML mode
 * @param {string} text - Raw string
 * @returns {string} Escaped HTML
 */
export function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Strips tokens, keys, and authorization headers from error messages or logs
 * @param {string} str - Raw log or error string
 * @returns {string} Sanitized string
 */
export function sanitizeLogMessage(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/(bot[0-9]{8,12}:[a-zA-Z0-9_-]{25,50})/gi, '[REDACTED_TELEGRAM_TOKEN]')
    .replace(/(AIza[0-9A-Za-z-_]{20,45})/g, '[REDACTED_GEMINI_KEY]')
    .replace(/(Bearer\s+[a-zA-Z0-9._-]+)/gi, 'Bearer [REDACTED]')
    .replace(/key=([a-zA-Z0-9_-]{10,})/gi, 'key=[REDACTED]');
}
