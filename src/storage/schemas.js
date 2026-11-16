/**
 * SHIV YOGI AI BOT - Data Models & Default Schemas
 * Standardizes stored data records and avoids null/undefined access bugs.
 */

import { LANGUAGES, AI_CONFIG } from '../config/constants.js';

export function createDefaultUserProfile(userId, from = {}) {
  const now = Date.now();
  return {
    userId: String(userId),
    username: from.username || '',
    firstName: from.first_name || '',
    lastName: from.last_name || '',
    language: from.language_code === 'hi' ? LANGUAGES.HI : LANGUAGES.EN,
    registeredAt: now,
    lastActiveAt: now,
    isBanned: false,
    banReason: '',
    isMuted: false,
    muteUntil: 0,
    totalRequests: 0,
    dailyRequests: 0,
    lastRequestDay: new Date(now).toISOString().split('T')[0],
    role: 'user'
  };
}

export function createDefaultUserSettings() {
  return {
    language: LANGUAGES.EN,
    model: AI_CONFIG.DEFAULT_MODEL,
    style: 'balanced', // balanced, creative, precise, coding
    memoryEnabled: true,
    notificationsEnabled: true,
    streamResponses: false,
    imagePreference: 'vivid'
  };
}

export function createDefaultAdminConfig() {
  return {
    maintenanceMode: false,
    maintenanceMessage: '',
    featureFlags: {}, // featureId: boolean
    rateLimits: {
      defaultUserMax: 30,
      imageMaxHourly: 10
    },
    dynamicAdmins: [],
    updatedAt: Date.now()
  };
}

export function createNoticeRecord(text, durationHours = 24) {
  const now = Date.now();
  const expiresAt = durationHours > 0 ? now + durationHours * 3600 * 1000 : 0;
  return {
    id: `notice_${now}`,
    text: String(text).trim(),
    enabled: true,
    createdAt: now,
    durationHours,
    expiresAt
  };
}

export function createBackupRecord(id, metadata = {}, data = {}) {
  return {
    backupId: id,
    createdAt: Date.now(),
    metadata,
    data
  };
}
