/**
 * SHIV YOGI AI BOT - Telegram HTML Formatting Helpers
 */

import { escapeHtml } from '../security/sanitization.js';

export function bold(text) {
  return `<b>${escapeHtml(String(text))}</b>`;
}

export function italic(text) {
  return `<i>${escapeHtml(String(text))}</i>`;
}

export function code(text) {
  return `<code>${escapeHtml(String(text))}</code>`;
}

export function pre(text, language = '') {
  const langAttr = language ? ` class="language-${escapeHtml(language)}"` : '';
  return `<pre${langAttr}>${escapeHtml(String(text))}</pre>`;
}

export function link(text, url) {
  return `<a href="${escapeHtml(url)}">${escapeHtml(String(text))}</a>`;
}

export function spoiler(text) {
  return `<tg-spoiler>${escapeHtml(String(text))}</tg-spoiler>`;
}
