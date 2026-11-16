/**
 * SHIV YOGI AI BOT - General User Commands (10 Commands)
 * /start, /help, /about, /status, /ping, /settings, /language, /profile, /feedback, /report
 */

import { formatWelcomeMessage, withNoticeBanner } from '../../telegram/messages.js';
import { getMainMenuKeyboard, getSettingsKeyboard } from '../../telegram/keyboards.js';
import { bold, code, italic } from '../../telegram/formatting.js';
import { BOT_IDENTITY, LANGUAGES } from '../../config/constants.js';
import { getUserProfile, getUserSettings, saveUserSettings, kvGet, kvPut, getAdminConfig } from '../../storage/kv.js';
import { KEYS } from '../../storage/keys.js';
import { formatDateIST } from '../../utilities/dates.js';

export async function handleStart(ctx) {
  const { client, chatId, message, activeNotice, env, userId } = ctx;
  const profile = await getUserProfile(env, userId, message.from);
  const text = withNoticeBanner(formatWelcomeMessage(profile), activeNotice);
  await client.sendMessage(chatId, text, {
    reply_markup: getMainMenuKeyboard()
  });
}

export async function handleHelp(ctx) {
  const { client, chatId, activeNotice } = ctx;
  const helpText = withNoticeBanner(
    `📖 ${bold('Shiv Yogi AI Assistant - Command Directory')}\n\n` +
    `Explore 60 powerful commands organized across 7 categories:\n\n` +
    `• 🤖 ${bold('AI Assistant')} (12 commands) - /ask, /chat, /summarize, /translate...\n` +
    `• 🎨 ${bold('Image Tools')} (7 commands) - /image, /imagine, /ocr, /analyzeimage...\n` +
    `• 💻 ${bold('Coding Tools')} (8 commands) - /code, /debug, /fixcode, /reviewcode...\n` +
    `• ✍️ ${bold('Writing Tools')} (8 commands) - /write, /email, /caption, /story...\n` +
    `• 📁 ${bold('File Tools')} (7 commands) - /file, /pdf, /readfile, /extract...\n` +
    `• ⚡ ${bold('Utilities')} (8 commands) - /calculate, /weather, /search, /todo...\n` +
    `• ⚙️ ${bold('General')} (10 commands) - /start, /settings, /profile, /status...\n\n` +
    `👇 ${italic('Tap a category below for in-depth command syntax:')}`,
    activeNotice
  );

  await client.sendMessage(chatId, helpText, {
    reply_markup: getMainMenuKeyboard()
  });
}

export async function handleAbout(ctx) {
  const { client, chatId, activeNotice } = ctx;
  const text = withNoticeBanner(
    `ℹ️ ${bold('About ' + BOT_IDENTITY.NAME)}\n\n` +
    `• ${bold('Telegram Bot:')} @${BOT_IDENTITY.USERNAME}\n` +
    `• ${bold('Version:')} ${BOT_IDENTITY.VERSION}\n` +
    `• ${bold('Developer:')} Shiv Yogi\n` +
    `• ${bold('Architecture:')} Cloudflare Workers Serverless (Edge Network)\n` +
    `• ${bold('AI Engine:')} Google Gemini Generative Language API\n` +
    `• ${bold('Storage:')} Cloudflare Workers KV (${BOT_IDENTITY.KV_NAMESPACE})\n` +
    `• ${bold('Environment:')} Production\n\n` +
    `⚡ Built for high-speed, secure, and intelligent multi-turn assistance.`,
    activeNotice
  );
  await client.sendMessage(chatId, text);
}

export async function handleStatus(ctx) {
  const { client, chatId, env, activeNotice } = ctx;
  const config = await getAdminConfig(env);
  const now = Date.now();

  const text = withNoticeBanner(
    `📊 ${bold('System Status & Diagnostics')}\n\n` +
    `• ${bold('Operational State:')} ${config.maintenanceMode ? '🔴 Maintenance Mode' : '🟢 Operational & Active'}\n` +
    `• ${bold('Edge Network:')} Cloudflare Workers Global Edge\n` +
    `• ${bold('KV Storage:')} ${env.BOT_DATA ? '🟢 Connected' : '🟡 Simulated'}\n` +
    `• ${bold('Gemini AI Engine:')} ${env.GEMINI_API_KEY ? '🟢 Ready' : '🔴 Unset'}\n` +
    `• ${bold('Current Time (IST):')} ${formatDateIST(now)}\n\n` +
    `Everything is running smoothly!`,
    activeNotice
  );
  await client.sendMessage(chatId, text);
}

export async function handlePing(ctx) {
  const { client, chatId, message } = ctx;
  const start = Date.now();
  const msgTime = message.date ? message.date * 1000 : start;
  const latency = Math.max(1, start - msgTime);

  await client.sendMessage(chatId, `🏓 <b>Pong!</b>\n⏱️ Message Latency: <code>${latency}ms</code>\n🌐 Edge: Cloudflare Workers`);
}

export async function handleSettings(ctx) {
  const { client, chatId, env, userId } = ctx;
  const settings = await getUserSettings(env, userId);
  await client.sendMessage(
    chatId,
    `⚙️ <b>Your Personal Settings</b>\nCustomize language, conversation style, and AI memory:`,
    { reply_markup: getSettingsKeyboard(settings) }
  );
}

export async function handleLanguage(ctx) {
  const { client, chatId, env, userId, args } = ctx;
  const langArg = (args || '').trim().toLowerCase();
  const settings = await getUserSettings(env, userId);

  if (langArg === 'hi' || langArg === 'hindi') {
    settings.language = LANGUAGES.HI;
    await saveUserSettings(env, userId, settings);
    await client.sendMessage(chatId, '✅ भाषा बदलकर <b>हिंदी</b> कर दी गई है।');
    return;
  } else if (langArg === 'en' || langArg === 'english') {
    settings.language = LANGUAGES.EN;
    await saveUserSettings(env, userId, settings);
    await client.sendMessage(chatId, '✅ Language updated to <b>English</b>.');
    return;
  }

  // Toggle if no arg
  settings.language = settings.language === LANGUAGES.HI ? LANGUAGES.EN : LANGUAGES.HI;
  await saveUserSettings(env, userId, settings);
  const langName = settings.language === LANGUAGES.HI ? 'हिंदी' : 'English';
  await client.sendMessage(chatId, `🌐 Language toggled to: <b>${langName}</b>`);
}

export async function handleProfile(ctx) {
  const { client, chatId, env, userId, message } = ctx;
  const profile = await getUserProfile(env, userId, message.from);
  const settings = await getUserSettings(env, userId);

  const text = (
    `👤 <b>Your User Profile</b>\n\n` +
    `• <b>User ID:</b> <code>${profile.userId}</code>\n` +
    `• <b>Name:</b> ${profile.firstName || 'N/A'}\n` +
    `• <b>Username:</b> ${profile.username ? '@' + profile.username : 'None'}\n` +
    `• <b>Language:</b> ${settings.language === 'hi' ? 'हिंदी' : 'English'}\n` +
    `• <b>AI Style:</b> <code>${settings.style}</code>\n` +
    `• <b>Memory:</b> ${settings.memoryEnabled ? '🟢 Enabled' : '🔴 Disabled'}\n` +
    `• <b>Total Requests:</b> ${profile.totalRequests || 0}\n` +
    `• <b>Today Requests:</b> ${profile.dailyRequests || 0}\n` +
    `• <b>Registered:</b> ${formatDateIST(profile.registeredAt)}\n` +
    `• <b>Last Active:</b> ${formatDateIST(profile.lastActiveAt)}`
  );

  await client.sendMessage(chatId, text);
}

export async function handleFeedback(ctx) {
  const { client, chatId, env, userId, args } = ctx;
  if (!args || args.trim() === '') {
    await client.sendMessage(chatId, '📝 कृपया अपना फीडबैक प्रदान करें:\nउदाहरण: <code>/feedback यह बॉट बहुत मददगार है!</code>');
    return;
  }

  const feedbackList = (await kvGet(env, KEYS.feedbackList(), [])) || [];
  feedbackList.push({
    userId,
    feedback: args.trim(),
    createdAt: Date.now()
  });
  // Keep last 100 feedback entries
  await kvPut(env, KEYS.feedbackList(), feedbackList.slice(-100));

  await client.sendMessage(chatId, '🙏 <b>धन्यवाद!</b> आपकी प्रतिक्रिया सुरक्षित कर ली गई है और विकास टीम द्वारा समीक्षित की जाएगी।');
}

export async function handleReport(ctx) {
  const { client, chatId, env, userId, args } = ctx;
  if (!args || args.trim() === '') {
    await client.sendMessage(chatId, '⚠️ कृपया समस्या या बग का विवरण लिखें:\nउदाहरण: <code>/report यह कमांड काम नहीं कर रहा है...</code>');
    return;
  }

  const reportsList = (await kvGet(env, KEYS.reportsList(), [])) || [];
  reportsList.push({
    userId,
    report: args.trim(),
    createdAt: Date.now()
  });
  await kvPut(env, KEYS.reportsList(), reportsList.slice(-100));

  await client.sendMessage(chatId, '✅ आपकी रिपोर्ट दर्ज कर ली गई है। समस्या का निवारण जल्द किया जाएगा। धन्यवाद!');
}
