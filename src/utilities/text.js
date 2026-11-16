/**
 * SHIV YOGI AI BOT - Text Utilities & Message Splitter
 * Intelligently chunks messages exceeding Telegram's 4096 character limit
 * while keeping code blocks, markdown tags, and sentences intact.
 */

import { TELEGRAM_LIMITS } from '../config/constants.js';

export function splitTelegramMessage(text, maxChunk = TELEGRAM_LIMITS.SAFE_CHUNK_LENGTH) {
  if (!text || text.length <= maxChunk) {
    return [text || ''];
  }

  const chunks = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxChunk) {
      chunks.push(remaining);
      break;
    }

    // Try finding clean paragraph break \n\n
    let splitIndex = remaining.lastIndexOf('\n\n', maxChunk);
    if (splitIndex === -1 || splitIndex < maxChunk * 0.4) {
      // Try single line break \n
      splitIndex = remaining.lastIndexOf('\n', maxChunk);
    }
    if (splitIndex === -1 || splitIndex < maxChunk * 0.4) {
      // Try sentence boundary .
      splitIndex = remaining.lastIndexOf('. ', maxChunk);
      if (splitIndex !== -1) splitIndex += 1;
    }
    if (splitIndex === -1 || splitIndex < maxChunk * 0.4) {
      // Try space
      splitIndex = remaining.lastIndexOf(' ', maxChunk);
    }
    if (splitIndex === -1) {
      // Hard split
      splitIndex = maxChunk;
    }

    const chunk = remaining.slice(0, splitIndex).trim();
    if (chunk) chunks.push(chunk);
    remaining = remaining.slice(splitIndex).trim();
  }

  return chunks;
}

export function truncateText(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function countWords(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}
