/**
 * SHIV YOGI AI BOT - Cloudflare Worker Entry Point Tests
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { fetch, scheduled } from '../src/index.js';
import { validateEnvironment } from '../src/config/config.js';

test('Worker Environment Validation', () => {
  // Incomplete environment
  const incompleteEnv = {};
  const resIncomplete = validateEnvironment(incompleteEnv);
  assert.equal(resIncomplete.valid, false);
  assert.equal(resIncomplete.errors.length, 4);

  // Complete environment
  const completeEnv = {
    TELEGRAM_BOT_TOKEN: 'token_123',
    GEMINI_API_KEY: 'key_123',
    WEBHOOK_SECRET: 'secret_123',
    BOT_DATA: { get: () => null, put: () => null, delete: () => null }
  };
  const resComplete = validateEnvironment(completeEnv);
  assert.equal(resComplete.valid, true);
  assert.equal(resComplete.errors.length, 0);
});

test('Worker GET Health Probe Endpoint', async () => {
  const req = new Request('https://shiv-yogi-qa-bott.shivyogi-x19.workers.dev', { method: 'GET' });
  const res = await fetch(req, {}, {});

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'online');
  assert.equal(data.bot, '@ShivYogi19_bot');
  assert.equal(data.environment, 'production');
});

test('Worker POST Webhook Secret Enforcement', async () => {
  const env = { WEBHOOK_SECRET: 'prod_webhook_secret_key' };

  // 1. Missing secret token header -> 401 Unauthorized
  const unauthReq = new Request('https://worker.dev', {
    method: 'POST',
    body: JSON.stringify({ update_id: 123 })
  });
  const unauthRes = await fetch(unauthReq, env, {});
  assert.equal(unauthRes.status, 401);

  // 2. Invalid secret token header -> 401 Unauthorized
  const wrongReq = new Request('https://worker.dev', {
    method: 'POST',
    headers: { 'X-Telegram-Bot-Api-Secret-Token': 'wrong_secret' },
    body: JSON.stringify({ update_id: 123 })
  });
  const wrongRes = await fetch(wrongReq, env, {});
  assert.equal(wrongRes.status, 401);

  // 3. Valid secret but malformed JSON body -> 400 Bad Request
  const badJsonReq = new Request('https://worker.dev', {
    method: 'POST',
    headers: { 'X-Telegram-Bot-Api-Secret-Token': 'prod_webhook_secret_key' },
    body: '{broken json'
  });
  const badJsonRes = await fetch(badJsonReq, env, {});
  assert.equal(badJsonRes.status, 400);
});

test('Worker Scheduled Event Handler', async () => {
  const env = {};
  const event = { cron: '0 */6 * * *' };
  let waitUntilInvoked = false;
  const ctx = {
    waitUntil: (promise) => {
      waitUntilInvoked = true;
    }
  };

  await scheduled(event, env, ctx);
  assert.equal(waitUntilInvoked, true);
});
