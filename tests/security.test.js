/**
 * SHIV YOGI AI BOT - Security and Input Validation Tests
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyWebhookSecret } from '../src/security/webhook-auth.js';
import { checkRateLimit } from '../src/security/rate-limit.js';
import { isDuplicateUpdate } from '../src/security/deduplication.js';
import { escapeHtml, sanitizeLogMessage } from '../src/security/sanitization.js';
import { parseCommandArgs, validateUserId, isAllowedMimeType } from '../src/security/validation.js';

test('Webhook Secret Authentication', () => {
  const env = { WEBHOOK_SECRET: 'super_secret_webhook_token_123' };

  // Valid secret
  const validReq = new Request('https://worker.dev', {
    headers: { 'X-Telegram-Bot-Api-Secret-Token': 'super_secret_webhook_token_123' }
  });
  assert.equal(verifyWebhookSecret(validReq, env), true);

  // Invalid secret
  const invalidReq = new Request('https://worker.dev', {
    headers: { 'X-Telegram-Bot-Api-Secret-Token': 'wrong_secret_token' }
  });
  assert.equal(verifyWebhookSecret(invalidReq, env), false);

  // Missing header
  const emptyReq = new Request('https://worker.dev', { headers: {} });
  assert.equal(verifyWebhookSecret(emptyReq, env), false);

  // Missing env secret
  assert.equal(verifyWebhookSecret(validReq, {}), false);
});

test('Update Deduplication', async () => {
  const env = {}; // Uses in-memory fallback
  const updateId = 998877;

  // First occurrence -> allowed
  const first = await isDuplicateUpdate(env, updateId);
  assert.equal(first, false);

  // Second occurrence -> detected duplicate
  const second = await isDuplicateUpdate(env, updateId);
  assert.equal(second, true);
});

test('Rate Limiting', async () => {
  const env = {};
  const testUser = 'user_test_rl_' + Date.now();

  // First requests under limit
  const r1 = await checkRateLimit(env, testUser, 2);
  assert.equal(r1.allowed, true);
  assert.equal(r1.remaining, 1);

  const r2 = await checkRateLimit(env, testUser, 2);
  assert.equal(r2.allowed, true);
  assert.equal(r2.remaining, 0);

  // Third request exceeds limit
  const r3 = await checkRateLimit(env, testUser, 2);
  assert.equal(r3.allowed, false);
});

test('Sanitization and Secret Masking', () => {
  // HTML escaping
  const rawHtml = '<script>alert("hack")</script>&"\'';
  const escaped = escapeHtml(rawHtml);
  assert.equal(escaped.includes('<script>'), false);
  assert.equal(escaped.includes('&lt;script&gt;'), true);

  // Secret Masking
  const rawLog = 'Error connecting with bot123456789:ABCdefGHIjklMNOpqrSTUvwxYZ_1234567890 and AIzaSyD9876543210ABCDEFGHIJKLMNO key=secrettokenvalue123';
  const sanitized = sanitizeLogMessage(rawLog);
  assert.equal(sanitized.includes('bot123456789'), false);
  assert.equal(sanitized.includes('[REDACTED_TELEGRAM_TOKEN]'), true);
  assert.equal(sanitized.includes('AIzaSyD9876543210'), false);
  assert.equal(sanitized.includes('[REDACTED_GEMINI_KEY]'), true);
});

test('Command Argument Parsing and Validation', () => {
  const parsed = parseCommandArgs('/ask what is artificial intelligence?');
  assert.equal(parsed.command, '/ask');
  assert.equal(parsed.args, 'what is artificial intelligence?');
  assert.equal(parsed.argList.length, 4);

  assert.equal(validateUserId('8226363418'), true);
  assert.equal(validateUserId('invalid_id'), false);

  assert.equal(isAllowedMimeType('application/pdf'), true);
  assert.equal(isAllowedMimeType('image/png'), true);
  assert.equal(isAllowedMimeType('application/x-msdownload'), false);
});
