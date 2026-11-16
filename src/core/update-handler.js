/**
 * SHIV YOGI AI BOT - Telegram Update Processing Pipeline
 * Deduplication -> Rate-limiting -> User profile touch -> Maintenance guard -> Routing
 */

import { TelegramClient } from '../telegram/client.js';
import { isDuplicateUpdate } from '../security/deduplication.js';
import { checkRateLimit } from '../security/rate-limit.js';
import { touchUserProfile, getAdminConfig, getActiveNotice } from '../storage/kv.js';
import { isAdmin } from '../config/owner.js';
import { routeMessage } from './router.js';
import { handleCallbackQuery } from './callback-handler.js';
import { handleError } from './error-handler.js';
import { MESSAGES } from '../config/constants.js';

export async function processUpdate(update, env) {
  if (!update || typeof update !== 'object') {
    return { ok: false, reason: 'Invalid update payload' };
  }

  // 1. Deduplication Guard
  const updateId = update.update_id;
  if (updateId) {
    const isDup = await isDuplicateUpdate(env, updateId);
    if (isDup) {
      return { ok: true, skipped: 'duplicate_update' };
    }
  }

  const client = new TelegramClient(env.TELEGRAM_BOT_TOKEN);

  // 2. Handle Inline Keyboard Callback Queries
  if (update.callback_query) {
    try {
      await handleCallbackQuery(client, env, update.callback_query);
      return { ok: true, type: 'callback_query' };
    } catch (err) {
      await handleError(err, client, update.callback_query.message?.chat?.id);
      return { ok: true, error: err.message };
    }
  }

  // 3. Process Incoming Messages
  const message = update.message || update.edited_message;
  if (!message || !message.chat) {
    return { ok: true, skipped: 'unhandled_update_type' };
  }

  const chatId = message.chat.id;
  const userId = message.from ? message.from.id : null;

  try {
    // 4. User Profile & Status Touch
    const profile = await touchUserProfile(env, userId, message.from || {});

    // 5. Moderation Check: Ban Guard
    if (profile.isBanned) {
      await client.sendMessage(
        chatId,
        `🚫 <b>खाता प्रतिबंधित है:</b> आपका खाता बॉट नीतियों के उल्लंघन के कारण प्रतिबंधित कर दिया गया है।\nकारण: <i>${profile.banReason || 'Policy Violation'}</i>`
      );
      return { ok: true, status: 'banned' };
    }

    // 6. Moderation Check: Mute Guard
    if (profile.isMuted && Date.now() < profile.muteUntil) {
      const remainingMins = Math.ceil((profile.muteUntil - Date.now()) / 60000);
      await client.sendMessage(chatId, `🔇 <b>आप म्यूट हैं:</b> कृपया ${remainingMins} मिनट बाद प्रयास करें।`);
      return { ok: true, status: 'muted' };
    }

    // 7. Rate Limiting Guard
    const rateCheck = await checkRateLimit(env, userId);
    if (!rateCheck.allowed) {
      await client.sendMessage(
        chatId,
        `⏱️ <b>अनुरोध सीमा:</b> ${MESSAGES.RATE_LIMITED_HI}\nकृपया ${rateCheck.resetInSeconds} सेकंड बाद पुनः प्रयास करें।`
      );
      return { ok: true, status: 'rate_limited' };
    }

    // 8. Maintenance Mode Guard (Admins bypass maintenance)
    const adminConfig = await getAdminConfig(env);
    if (adminConfig.maintenanceMode && !isAdmin(userId, env, adminConfig.dynamicAdmins)) {
      const maintMsg = adminConfig.maintenanceMessage || MESSAGES.MAINTENANCE_HI;
      await client.sendMessage(chatId, `🛠️ <b>Maintenance Mode:</b>\n${maintMsg}`);
      return { ok: true, status: 'maintenance' };
    }

    // 9. Active Notice Resolution
    const activeNotice = await getActiveNotice(env);

    // 10. Route Message
    const ctx = {
      update,
      message,
      client,
      env,
      chatId,
      userId,
      profile,
      activeNotice
    };

    await routeMessage(ctx);
    return { ok: true, status: 'processed' };
  } catch (err) {
    await handleError(err, client, chatId, profile?.language || 'hi');
    return { ok: true, error: err.message };
  }
}
