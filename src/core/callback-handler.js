/**
 * SHIV YOGI AI BOT - Telegram Callback Query Router
 * Securely handles inline keyboard interactions, settings toggles, navigation,
 * and admin dashboard actions with strict user ownership checks.
 */

import { getMainMenuKeyboard, getCategoryBackKeyboard, getSettingsKeyboard, getAdminDashboardKeyboard } from '../telegram/keyboards.js';
import { formatCategoryMenu } from '../telegram/messages.js';
import { getUserSettings, saveUserSettings, clearUserHistory, getAdminConfig, saveAdminConfig } from '../storage/kv.js';
import { isAdmin } from '../config/owner.js';
import { runKvAutoCleanup } from '../storage/cleanup.js';
import { createBackup } from '../storage/backup.js';
import { inspectStorageMetrics, performHealthCheck } from '../admin/monitoring.js';
import { listRecentUsers } from '../admin/users.js';

export async function handleCallbackQuery(client, env, callbackQuery) {
  const queryId = callbackQuery.id;
  const data = callbackQuery.data || '';
  const message = callbackQuery.message;
  const chatId = message?.chat?.id;
  const messageId = message?.message_id;
  const userId = callbackQuery.from?.id;

  // Acknowledge query immediately
  await client.answerCallbackQuery(queryId);

  if (!chatId || !messageId) return;

  // 1. Home Navigation
  if (data === 'home') {
    const welcome = '🤖 <b>Main Navigation Menu</b>\nSelect an option below to proceed:';
    await client.editMessageText(chatId, messageId, welcome, {
      reply_markup: getMainMenuKeyboard()
    });
    return;
  }

  // 2. Category Menus
  if (data.startsWith('cat:')) {
    const category = data.replace('cat:', '');
    const menuContent = formatCategoryMenu(category);
    await client.editMessageText(chatId, messageId, menuContent, {
      reply_markup: getCategoryBackKeyboard(category)
    });
    return;
  }

  // 3. User Settings Toggles
  if (data.startsWith('set:')) {
    const settings = await getUserSettings(env, userId);

    if (data === 'set:lang:toggle') {
      settings.language = settings.language === 'hi' ? 'en' : 'hi';
      await saveUserSettings(env, userId, settings);
    } else if (data === 'set:mem:toggle') {
      settings.memoryEnabled = !settings.memoryEnabled;
      await saveUserSettings(env, userId, settings);
    } else if (data === 'set:style:cycle') {
      const styles = ['balanced', 'creative', 'precise', 'coding'];
      const nextIdx = (styles.indexOf(settings.style) + 1) % styles.length;
      settings.style = styles[nextIdx];
      await saveUserSettings(env, userId, settings);
    }

    await client.editMessageText(
      chatId,
      messageId,
      '⚙️ <b>Your Personal Settings:</b>\nCustomize your experience below:',
      { reply_markup: getSettingsKeyboard(settings) }
    );
    return;
  }

  // 4. Confirmation Dialogs
  if (data.startsWith('confirm:reset_history:')) {
    await clearUserHistory(env, userId);
    await client.editMessageText(
      chatId,
      messageId,
      '✅ <b>सफलता!</b> आपका चैट इतिहास रीसेट कर दिया गया है।',
      { reply_markup: getCategoryBackKeyboard('home') }
    );
    return;
  }

  // 5. Admin Dashboard Actions
  if (data.startsWith('admin:')) {
    if (!isAdmin(userId, env)) {
      await client.sendMessage(chatId, '⛔ <b>Unauthorized:</b> You do not have permission to perform admin actions.');
      return;
    }

    const action = data.replace('admin:', '');

    if (action === 'stats') {
      const metrics = await inspectStorageMetrics(env);
      const text = (
        `📊 <b>System Statistics:</b>\n\n` +
        `• Registered Users: ${metrics.profiles}\n` +
        `• Active Chat Histories: ${metrics.history}\n` +
        `• Total KV Keys: ${metrics.totalKeys}`
      );
      await client.sendMessage(chatId, text);
    } else if (action === 'users') {
      const userText = await listRecentUsers(env, 10);
      await client.sendMessage(chatId, userText);
    } else if (action === 'toggle_maint') {
      const config = await getAdminConfig(env);
      config.maintenanceMode = !config.maintenanceMode;
      await saveAdminConfig(env, config);
      await client.editMessageText(
        chatId,
        messageId,
        `🛠️ <b>Maintenance Mode:</b> ${config.maintenanceMode ? '🔴 ACTIVE' : '🟢 INACTIVE'}`,
        { reply_markup: getAdminDashboardKeyboard(config.maintenanceMode) }
      );
    } else if (action === 'cleanup') {
      await client.sendMessage(chatId, '🧹 Running safe background cleanup...');
      const stats = await runKvAutoCleanup(env);
      await client.sendMessage(chatId, `✅ Cleanup complete! Removed ${stats.deletedKeys} expired keys in ${stats.durationMs}ms.`);
    } else if (action === 'backup') {
      const bkp = await createBackup(env, 'Admin dashboard quick backup');
      await client.sendMessage(chatId, `💾 Snapshot created: <code>${bkp.backupId}</code>`);
    } else if (action === 'health') {
      const health = await performHealthCheck(env);
      await client.sendMessage(chatId, `🩺 Health: Worker ${health.worker.status}, KV ${health.kv.status} (${health.kv.latencyMs}ms)`);
    } else if (action === 'broadcast' || action === 'notices' || action === 'features') {
      await client.sendMessage(chatId, `ℹ️ Use commands: <code>/broadcast</code>, <code>/notice</code>, or <code>/features</code>.`);
    }
  }
}
