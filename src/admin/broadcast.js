/**
 * SHIV YOGI AI BOT - Safe Batch Broadcast System
 * Complies with Telegram rate limits using pacing and non-blocking batch loops.
 */

import { kvList } from '../storage/kv.js';
import { KEY_PREFIXES } from '../storage/keys.js';
import { delay } from '../utilities/helpers.js';

export async function executeBroadcast(client, env, broadcastText, options = {}) {
  const userList = await kvList(env, { prefix: KEY_PREFIXES.PROFILE, limit: 1000 });
  const keys = userList.keys || [];

  const results = {
    total: keys.length,
    sent: 0,
    failed: 0,
    blocked: 0
  };

  const message = `📢 <b>Official Broadcast:</b>\n\n${broadcastText}`;
  const batchSize = 25;

  for (let i = 0; i < keys.length; i += batchSize) {
    const batch = keys.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (keyItem) => {
        const userId = keyItem.name.replace(KEY_PREFIXES.PROFILE, '');
        try {
          await client.sendMessage(userId, message);
          results.sent++;
        } catch (err) {
          if (err.message && err.message.includes('blocked')) {
            results.blocked++;
          } else {
            results.failed++;
          }
        }
      })
    );

    // Rate-limiting delay between batches
    if (i + batchSize < keys.length) {
      await delay(1000);
    }
  }

  return results;
}
