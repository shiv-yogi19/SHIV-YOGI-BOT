/**
 * SHIV YOGI AI BOT - Interactive Admin Dashboard Builder
 */

import { getAdminDashboardKeyboard } from '../telegram/keyboards.js';
import { getAdminConfig, kvList, getActiveNotice } from '../storage/kv.js';
import { KEY_PREFIXES } from '../storage/keys.js';
import { formatDateIST } from '../utilities/dates.js';

export async function renderAdminDashboard(env) {
  const config = await getAdminConfig(env);
  const activeNotice = await getActiveNotice(env);
  const userList = await kvList(env, { prefix: KEY_PREFIXES.PROFILE, limit: 1000 });
  const totalUsers = userList.keys ? userList.keys.length : 0;

  let text = (
    `🛡️ <b>Shiv Yogi Bot - Admin Command Dashboard</b>\n\n` +
    `• <b>System State:</b> ${config.maintenanceMode ? '🔴 Maintenance Mode (Active)' : '🟢 Operational'}\n` +
    `• <b>Total Registered Users:</b> <code>${totalUsers}</code>\n` +
    `• <b>Active System Notice:</b> ${activeNotice ? `"${activeNotice.text}"` : '<i>None</i>'}\n` +
    `• <b>Updated:</b> ${formatDateIST(config.updatedAt || Date.now())}\n\n` +
    `<i>Tap a module below to inspect or configure:</i>`
  );

  return {
    text,
    reply_markup: getAdminDashboardKeyboard(config.maintenanceMode)
  };
}
