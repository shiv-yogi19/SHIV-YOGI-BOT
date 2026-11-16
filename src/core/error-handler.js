/**
 * SHIV YOGI AI BOT - Centralized Error Handler
 * Sanitizes stack traces, redacts secrets, and dispatches localized user feedback.
 */

import { sanitizeLogMessage } from '../security/sanitization.js';
import { MESSAGES } from '../config/constants.js';

export async function handleError(err, client = null, chatId = null, userLang = 'en') {
  const sanitizedMsg = sanitizeLogMessage(err.message || String(err));
  console.error('TOP-LEVEL BOT ERROR:', sanitizedMsg);

  if (client && chatId) {
    try {
      const errorResponse = userLang === 'hi' ? MESSAGES.ERROR_GENERIC_HI : MESSAGES.ERROR_GENERIC_EN;
      await client.sendMessage(chatId, `⚠️ ${errorResponse}\n<i>(${sanitizedMsg.slice(0, 150)})</i>`);
    } catch (sendErr) {
      console.error('Failed to dispatch error response to user:', sendErr.message);
    }
  }
}
