/**
 * SHIV YOGI AI BOT - Admin User Moderation Module
 * Ban, unban, mute, unmute, and user profile inspection.
 */

import { getUserProfile, saveUserProfile, kvList, kvGet } from '../storage/kv.js';
import { KEY_PREFIXES } from '../storage/keys.js';
import { formatDateIST } from '../utilities/dates.js';

export async function banUser(env, userId, reason = 'Violation of bot policy') {
  const profile = await getUserProfile(env, userId);
  profile.isBanned = true;
  profile.banReason = reason;
  profile.bannedAt = Date.now();
  await saveUserProfile(env, userId, profile);
  return profile;
}

export async function unbanUser(env, userId) {
  const profile = await getUserProfile(env, userId);
  profile.isBanned = false;
  profile.banReason = '';
  await saveUserProfile(env, userId, profile);
  return profile;
}

export async function muteUser(env, userId, durationMinutes = 60) {
  const profile = await getUserProfile(env, userId);
  profile.isMuted = true;
  profile.muteUntil = Date.now() + durationMinutes * 60 * 1000;
  await saveUserProfile(env, userId, profile);
  return profile;
}

export async function unmuteUser(env, userId) {
  const profile = await getUserProfile(env, userId);
  profile.isMuted = false;
  profile.muteUntil = 0;
  await saveUserProfile(env, userId, profile);
  return profile;
}

export async function getUserDetail(env, userId) {
  const profile = await getUserProfile(env, userId);
  return (
    `👤 <b>Admin User Inspector:</b>\n\n` +
    `• <b>User ID:</b> <code>${profile.userId}</code>\n` +
    `• <b>Name:</b> ${profile.firstName || 'N/A'}\n` +
    `• <b>Username:</b> ${profile.username ? '@' + profile.username : 'None'}\n` +
    `• <b>Status:</b> ${profile.isBanned ? '🚫 BANNED (' + profile.banReason + ')' : profile.isMuted ? '🔇 MUTED until ' + formatDateIST(profile.muteUntil) : '🟢 ACTIVE'}\n` +
    `• <b>Role:</b> <code>${profile.role || 'user'}</code>\n` +
    `• <b>Total Requests:</b> ${profile.totalRequests || 0}\n` +
    `• <b>Today Requests:</b> ${profile.dailyRequests || 0}\n` +
    `• <b>Joined:</b> ${formatDateIST(profile.registeredAt)}\n` +
    `• <b>Last Active:</b> ${formatDateIST(profile.lastActiveAt)}`
  );
}

export async function listRecentUsers(env, limit = 15) {
  const list = await kvList(env, { prefix: KEY_PREFIXES.PROFILE, limit });
  if (!list.keys || list.keys.length === 0) {
    return '👥 No registered users found in KV storage.';
  }

  let text = `👥 <b>Recent Users (${list.keys.length}):</b>\n\n`;
  for (const k of list.keys) {
    const p = await kvGet(env, k.name, null);
    if (p) {
      const statusIcon = p.isBanned ? '🚫' : p.isMuted ? '🔇' : '🟢';
      text += `${statusIcon} <code>${p.userId}</code> | ${p.firstName || 'User'} | Req: ${p.totalRequests || 0}\n`;
    }
  }
  return text;
}
