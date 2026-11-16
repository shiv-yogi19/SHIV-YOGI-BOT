/**
 * SHIV YOGI AI BOT - Global Notice Management
 * Create, edit, toggle, and set duration for system-wide banners.
 */

import { getActiveNotice, saveActiveNotice, deleteActiveNotice } from '../storage/kv.js';
import { createNoticeRecord } from '../storage/schemas.js';
import { formatDateIST } from '../utilities/dates.js';

export async function setGlobalNotice(env, text, durationHours = 24) {
  const notice = createNoticeRecord(text, durationHours);
  await saveActiveNotice(env, notice);
  return notice;
}

export async function removeGlobalNotice(env) {
  await deleteActiveNotice(env);
  return true;
}

export async function getNoticeStatus(env) {
  const notice = await getActiveNotice(env);
  if (!notice) {
    return '📌 Currently, there is <b>no active system notice</b>.';
  }

  const expiresStr = notice.expiresAt > 0 ? formatDateIST(notice.expiresAt) : 'Never (Permanent)';
  return (
    `📌 <b>Active System Notice:</b>\n\n` +
    `• <b>Message:</b> <i>"${notice.text}"</i>\n` +
    `• <b>Status:</b> ${notice.enabled ? '🟢 Enabled' : '🔴 Disabled'}\n` +
    `• <b>Created:</b> ${formatDateIST(notice.createdAt)}\n` +
    `• <b>Expires:</b> ${expiresStr}`
  );
}
