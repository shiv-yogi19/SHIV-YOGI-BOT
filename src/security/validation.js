/**
 * SHIV YOGI AI BOT - Input Validation and Argument Parsing
 */

import { TELEGRAM_LIMITS } from '../config/constants.js';

export function validateUserId(userId) {
  if (!userId) return false;
  return /^\d{5,15}$/.test(String(userId).trim());
}

export function parseCommandArgs(fullText) {
  if (!fullText) return { command: '', args: '', argList: [] };
  const trimmed = fullText.trim();
  const firstSpace = trimmed.indexOf(' ');
  if (firstSpace === -1) {
    return {
      command: trimmed.toLowerCase(),
      args: '',
      argList: []
    };
  }

  const command = trimmed.slice(0, firstSpace).toLowerCase();
  const args = trimmed.slice(firstSpace + 1).trim();
  const argList = args.split(/\s+/).filter(Boolean);

  return { command, args, argList };
}

export function validateInputLength(text, maxLength = 3000) {
  if (!text) return true;
  return text.length <= maxLength;
}

export function validateFileLimit(bytes, maxBytes = TELEGRAM_LIMITS.MAX_FILE_DOWNLOAD_BYTES) {
  return typeof bytes === 'number' && bytes <= maxBytes && bytes > 0;
}

const ALLOWED_MIME_PREFIXES = [
  'text/',
  'image/',
  'application/pdf',
  'application/json',
  'application/javascript',
  'application/x-javascript'
];

export function isAllowedMimeType(mime) {
  if (!mime) return false;
  const m = mime.toLowerCase();
  return ALLOWED_MIME_PREFIXES.some(prefix => m.startsWith(prefix) || m === prefix);
}
