/**
 * SHIV YOGI AI BOT - Production Worker Entry Point
 * 
 * Telegram Bot: @ShivYogi19_bot
 * Worker URL: https://shiv-yogi-qa-bott.shivyogi-x19.workers.dev
 * Environment: Production
 * 
 * Exports canonical fetch and scheduled handlers.
 */

import { verifyWebhookSecret } from './security/webhook-auth.js';
import { processUpdate } from './core/update-handler.js';
import { handleScheduledEvent } from './scheduled/handler.js';
import { BOT_IDENTITY } from './config/constants.js';

export async function fetch(request, env, ctx) {
  const url = new URL(request.url);

  // Health and root GET probe
  if (request.method === 'GET') {
    return new Response(
      JSON.stringify(
        {
          status: 'online',
          bot: `@${BOT_IDENTITY.USERNAME}`,
          name: BOT_IDENTITY.NAME,
          version: BOT_IDENTITY.VERSION,
          environment: 'production',
          timestamp: new Date().toISOString()
        },
        null,
        2
      ),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // Telegram Webhook Updates (POST)
  if (request.method === 'POST') {
    // 1. Timing-safe Webhook Secret Authentication
    if (!verifyWebhookSecret(request, env)) {
      console.warn('Unauthorized webhook request attempt rejected.');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Safe JSON Body Parsing
    let update;
    try {
      update = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. Process Update
    try {
      const result = await processUpdate(update, env);
      return new Response(JSON.stringify(result || { ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      console.error('Unhandled update processing error:', err.message);
      return new Response(JSON.stringify({ ok: true, error: 'Internal processing handled' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
}

export async function scheduled(event, env, ctx) {
  return await handleScheduledEvent(event, env, ctx);
}

export default {
  fetch,
  scheduled
};
