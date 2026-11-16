/**
 * SHIV YOGI AI BOT - ID Generator Utilities
 */

export function generateId(prefix = 'id') {
  const uuid = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2, 10);
  return `${prefix}_${uuid}`;
}

export function sanitizeId(str) {
  if (!str) return '';
  return String(str).replace(/[^a-zA-Z0-9_-]/g, '');
}
