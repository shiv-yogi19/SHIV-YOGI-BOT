/**
 * SHIV YOGI AI BOT - Cloudflare Worker Scheduled Event Handler
 * Executes scheduled automated KV cleanup cycles and background tasks.
 * Remains completely dormant until a Cron Trigger is configured in Cloudflare Dashboard.
 */

import { runKvAutoCleanup } from '../storage/cleanup.js';

export async function handleScheduledEvent(event, env, ctx) {
  console.log(`[SCHEDULED TASK STARTED]: Cron trigger: ${event?.cron || 'manual'}`);

  const cleanupPromise = (async () => {
    try {
      const stats = await runKvAutoCleanup(env);
      console.log(`[SCHEDULED CLEANUP FINISHED]: Scanned: ${stats.scannedKeys}, Deleted: ${stats.deletedKeys} in ${stats.durationMs}ms`);
      return stats;
    } catch (err) {
      console.error('[SCHEDULED TASK ERROR]:', err.message);
      return { status: 'ERROR', error: err.message };
    }
  })();

  if (ctx && typeof ctx.waitUntil === 'function') {
    ctx.waitUntil(cleanupPromise);
  } else {
    await cleanupPromise;
  }
}
