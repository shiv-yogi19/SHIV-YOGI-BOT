/**
 * SHIV YOGI AI BOT - System Monitoring & Diagnostics
 * Health probes, storage breakdown metrics, and audit log analysis.
 */

import { kvList, kvGet, kvPut } from '../storage/kv.js';
import { KEY_PREFIXES, KEYS } from '../storage/keys.js';
import { BOT_IDENTITY } from '../config/constants.js';

export async function performHealthCheck(env) {
  const start = Date.now();
  const checks = {
    timestamp: start,
    worker: { status: 'HEALTHY', url: BOT_IDENTITY.WORKER_URL },
    kv: { status: 'UNKNOWN', latencyMs: 0 },
    secrets: {
      telegramToken: Boolean(env.TELEGRAM_BOT_TOKEN),
      geminiKey: Boolean(env.GEMINI_API_KEY),
      webhookSecret: Boolean(env.WEBHOOK_SECRET)
    }
  };

  // Check KV write & read
  try {
    const kvStart = Date.now();
    const testKey = 'task:health_probe';
    await kvPut(env, testKey, { probeTime: kvStart }, { expirationTtl: 60 });
    const readVal = await kvGet(env, testKey, null);
    checks.kv.latencyMs = Date.now() - kvStart;
    checks.kv.status = readVal ? 'HEALTHY' : 'DEGRADED';
  } catch (err) {
    checks.kv.status = 'ERROR';
    checks.kv.error = err.message;
  }

  return checks;
}

export async function inspectStorageMetrics(env) {
  const list = await kvList(env, { limit: 1000 });
  const keys = list.keys || [];

  const breakdown = {
    totalKeys: keys.length,
    profiles: 0,
    history: 0,
    memory: 0,
    settings: 0,
    rateLimits: 0,
    tasks: 0,
    backups: 0,
    others: 0
  };

  for (const k of keys) {
    const name = k.name;
    if (name.startsWith(KEY_PREFIXES.PROFILE)) breakdown.profiles++;
    else if (name.startsWith(KEY_PREFIXES.HISTORY)) breakdown.history++;
    else if (name.startsWith(KEY_PREFIXES.MEMORY)) breakdown.memory++;
    else if (name.startsWith(KEY_PREFIXES.SETTINGS)) breakdown.settings++;
    else if (name.startsWith(KEY_PREFIXES.RATELIMIT)) breakdown.rateLimits++;
    else if (name.startsWith(KEY_PREFIXES.TASK)) breakdown.tasks++;
    else if (name.startsWith(KEY_PREFIXES.BACKUP)) breakdown.backups++;
    else breakdown.others++;
  }

  return breakdown;
}

export async function logAdminAction(env, adminId, action, details = {}) {
  try {
    const logs = (await kvGet(env, KEYS.adminActions(), [])) || [];
    logs.unshift({
      adminId,
      action,
      details,
      timestamp: Date.now()
    });
    await kvPut(env, KEYS.adminActions(), logs.slice(0, 100));
  } catch (err) {
    console.error('Failed to log admin action:', err.message);
  }
}
