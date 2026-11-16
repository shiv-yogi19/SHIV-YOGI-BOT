/**
 * SHIV YOGI AI BOT - Centralized KV Key Namespace Definition
 * 
 * Organizes all keys with predictable prefixes to prevent collision
 * and facilitate safe cleanup and backups.
 */

export const KEY_PREFIXES = {
  USER: 'user:',
  PROFILE: 'profile:',
  HISTORY: 'history:',
  MEMORY: 'memory:',
  SETTINGS: 'settings:',
  ADMIN_CONFIG: 'admin:config',
  ADMIN_ACTIONS: 'admin:actions',
  NOTICE_ACTIVE: 'notice:active',
  USAGE_USER: 'usage:user:',
  USAGE_GLOBAL: 'usage:global',
  TASK: 'task:',
  RATELIMIT: 'ratelimit:',
  CLEANUP_LAST: 'cleanup:last',
  BACKUP: 'backup:',
  BACKUP_INDEX: 'backup:index',
  TODO: 'todo:',
  REMIND: 'remind:',
  FEEDBACK: 'feedback:list',
  REPORTS: 'reports:list',
  DEDUP: 'dedup:'
};

export const KEYS = {
  user: (userId) => `${KEY_PREFIXES.USER}${userId}`,
  profile: (userId) => `${KEY_PREFIXES.PROFILE}${userId}`,
  history: (userId) => `${KEY_PREFIXES.HISTORY}${userId}`,
  memory: (userId) => `${KEY_PREFIXES.MEMORY}${userId}`,
  settings: (userId) => `${KEY_PREFIXES.SETTINGS}${userId}`,
  adminConfig: () => KEY_PREFIXES.ADMIN_CONFIG,
  adminActions: () => KEY_PREFIXES.ADMIN_ACTIONS,
  noticeActive: () => KEY_PREFIXES.NOTICE_ACTIVE,
  usageUser: (userId) => `${KEY_PREFIXES.USAGE_USER}${userId}`,
  usageGlobal: () => KEY_PREFIXES.USAGE_GLOBAL,
  task: (taskId) => `${KEY_PREFIXES.TASK}${taskId}`,
  rateLimit: (userId) => `${KEY_PREFIXES.RATELIMIT}${userId}`,
  cleanupLast: () => KEY_PREFIXES.CLEANUP_LAST,
  backup: (backupId) => `${KEY_PREFIXES.BACKUP}${backupId}`,
  backupIndex: () => KEY_PREFIXES.BACKUP_INDEX,
  todo: (userId) => `${KEY_PREFIXES.TODO}${userId}`,
  remind: (userId) => `${KEY_PREFIXES.REMIND}${userId}`,
  feedbackList: () => KEY_PREFIXES.FEEDBACK,
  reportsList: () => KEY_PREFIXES.REPORTS,
  dedup: (updateId) => `${KEY_PREFIXES.DEDUP}${updateId}`
};
