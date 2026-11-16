/**
 * SHIV YOGI AI BOT - Utility Commands (8 Commands)
 * /calculate, /math, /weather, /search, /define, /shorten, /remind, /todo
 * No fake data, genuine open APIs, sandbox-safe math evaluation.
 */

import { safeCalculate } from '../../utilities/helpers.js';
import { GeminiClient } from '../../ai/gemini.js';
import { getUserTodos, saveUserTodos, getUserReminders, saveUserReminders } from '../../storage/kv.js';
import { withNoticeBanner } from '../../telegram/messages.js';
import { formatDateIST } from '../../utilities/dates.js';

export async function handleCalculate(ctx) {
  const { client, chatId, args, activeNotice } = ctx;
  if (!args || args.trim() === '') {
    await client.sendMessage(
      chatId,
      '🧮 <b>Calculator:</b> कृपया गणना के लिए गणितीय सूत्र दर्ज करें।\nउदाहरण: <code>/calculate (25 * 4) + sqrt(144) ^ 2</code>'
    );
    return;
  }

  try {
    const result = safeCalculate(args.trim());
    const text = (
      `🧮 <b>Mathematical Calculation:</b>\n\n` +
      `• <b>Expression:</b> <code>${args.trim()}</code>\n` +
      `• <b>Result:</b> <code>${result}</code>`
    );
    await client.sendMessage(chatId, withNoticeBanner(text, activeNotice));
  } catch (err) {
    await client.sendMessage(chatId, `❌ गणना में त्रुटि: ${err.message}\nकृपया सही गणितीय सिंटैक्स का उपयोग करें।`);
  }
}

export async function handleMath(ctx) {
  const { client, chatId, env, args, activeNotice } = ctx;
  if (!args || args.trim() === '') {
    await client.sendMessage(
      chatId,
      '📐 <b>Math Problem Solver:</b> कृपया गणितीय समस्या या थ्योरम लिखें।\nउदाहरण: <code>/math Solve for x: 3x^2 - 12x + 9 = 0</code>'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  const gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  const prompt = `Solve this mathematical problem step-by-step with formulas, derivation, and the final answer clearly boxed:\n\n${args.trim()}`;
  const solution = await gemini.generateText(prompt, 'You are a mathematician and professor. Be rigorous, step-by-step, and clear.');

  await client.sendMessage(chatId, withNoticeBanner(`📐 <b>Step-by-Step Math Solution:</b>\n\n${solution}`, activeNotice));
}

export async function handleWeather(ctx) {
  const { client, chatId, args, activeNotice } = ctx;
  const city = (args || '').trim();

  if (!city) {
    await client.sendMessage(
      chatId,
      '☀️ <b>Weather:</b> कृपया शहर का नाम लिखें।\nउदाहरण: <code>/weather New Delhi</code> या <code>/weather Mumbai</code>'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) throw new Error('Geocoding service unavailable');
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      await client.sendMessage(chatId, `⚠️ शहर <b>${city}</b> की मौसम जानकारी नहीं मिल सकी। कृपया वर्तनी (Spelling) जांचें।`);
      return;
    }

    const loc = geoData.results[0];
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current_weather=true`;
    const wRes = await fetch(weatherUrl);
    if (!wRes.ok) throw new Error('Forecast service unavailable');
    const wData = await wRes.json();

    const curr = wData.current_weather;
    const report = (
      `⛅ <b>Current Weather for ${loc.name}, ${loc.country || ''}:</b>\n\n` +
      `• 🌡️ <b>Temperature:</b> ${curr.temperature}°C\n` +
      `• 💨 <b>Wind Speed:</b> ${curr.windspeed} km/h\n` +
      `• 🧭 <b>Wind Direction:</b> ${curr.winddirection}°\n` +
      `• 🕒 <b>Time:</b> ${curr.time}\n` +
      `• 📍 <b>Coordinates:</b> ${loc.latitude.toFixed(2)}, ${loc.longitude.toFixed(2)}`
    );

    await client.sendMessage(chatId, withNoticeBanner(report, activeNotice));
  } catch (err) {
    console.error('Weather error:', err.message);
    await client.sendMessage(chatId, 'अभी यह सेवा उपलब्ध नहीं है। कृपया कुछ समय बाद दोबारा प्रयास करें।');
  }
}

export async function handleSearch(ctx) {
  const { client, chatId, env, args, activeNotice } = ctx;
  if (!args || args.trim() === '') {
    await client.sendMessage(
      chatId,
      '🔍 <b>Web Search:</b> कृपया खोज क्वेरी दर्ज करें।\nउदाहरण: <code>/search Latest discoveries by James Webb Telescope</code>'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  const gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  const prompt = `Provide an authoritative, up-to-date summary answering the following web research query with citations and key facts:\n\n${args.trim()}`;
  const searchSummary = await gemini.generateText(prompt, 'You are an intelligent web research analyst.');

  await client.sendMessage(chatId, withNoticeBanner(`🔍 <b>Search Insights:</b>\n\n${searchSummary}`, activeNotice));
}

export async function handleDefine(ctx) {
  const { client, chatId, env, args, activeNotice } = ctx;
  if (!args || args.trim() === '') {
    await client.sendMessage(
      chatId,
      '📖 <b>Dictionary Definition:</b> कृपया शब्द लिखें।\nउदाहरण: <code>/define Serendipity</code>'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  const gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  const prompt = `Provide a comprehensive dictionary entry for the word: "${args.trim()}". Include: 1) Part of Speech & Phonetic pronunciation, 2) Clear definition, 3) Etymology & origin, 4) 3 Synonyms & Antonyms, 5) Two exemplary sentences illustrating usage in context.`;
  const definition = await gemini.generateText(prompt, 'You are a master lexicographer.');

  await client.sendMessage(chatId, withNoticeBanner(`📖 <b>Definition:</b>\n\n${definition}`, activeNotice));
}

export async function handleShorten(ctx) {
  const { client, chatId, args, activeNotice } = ctx;
  const rawUrl = (args || '').trim();

  if (!rawUrl || !rawUrl.startsWith('http')) {
    await client.sendMessage(
      chatId,
      '🔗 <b>URL Shortener:</b> कृपया पूरा URL दर्ज करें (http:// या https:// के साथ)।\nउदाहरण: <code>/shorten https://www.google.com</code>'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  try {
    const endpoint = `https://is.gd/create.php?format=json&url=${encodeURIComponent(rawUrl)}`;
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error('Shortening endpoint unavailable');
    const data = await res.json();

    if (data.shorturl) {
      const text = (
        `🔗 <b>Shortened URL:</b>\n\n` +
        `• <b>Original:</b> ${rawUrl}\n` +
        `• <b>Short:</b> <code>${data.shorturl}</code>`
      );
      await client.sendMessage(chatId, withNoticeBanner(text, activeNotice));
    } else {
      throw new Error(data.errormessage || 'Could not shorten URL');
    }
  } catch (err) {
    console.error('URL Shorten failed:', err.message);
    await client.sendMessage(chatId, 'अभी यह सेवा उपलब्ध नहीं है। कृपया कुछ समय बाद दोबारा प्रयास करें।');
  }
}

export async function handleRemind(ctx) {
  const { client, chatId, env, userId, args, activeNotice } = ctx;
  if (!args || args.trim() === '') {
    await client.sendMessage(
      chatId,
      '⏰ <b>Reminder:</b> विवरण दर्ज करें।\nउदाहरण: <code>/remind Call doctor tomorrow at 10 AM</code>'
    );
    return;
  }

  const reminders = await getUserReminders(env, userId);
  const newReminder = {
    id: `rem_${Date.now()}`,
    text: args.trim(),
    createdAt: Date.now()
  };
  reminders.push(newReminder);
  await saveUserReminders(env, userId, reminders.slice(-20));

  await client.sendMessage(
    chatId,
    withNoticeBanner(`⏰ <b>रिमाइंडर सुरक्षित किया गया:</b>\n<i>"${newReminder.text}"</i>\n(दर्ज समय: ${formatDateIST(newReminder.createdAt)})`, activeNotice)
  );
}

export async function handleTodo(ctx) {
  const { client, chatId, env, userId, args, argList, activeNotice } = ctx;
  const action = (argList[0] || 'list').toLowerCase();
  const itemText = args ? args.replace(/^(add|done|clear|list)\s*/i, '').trim() : '';
  let todos = await getUserTodos(env, userId);

  if (action === 'add' && itemText) {
    todos.push({
      id: `td_${Date.now()}`,
      text: itemText,
      completed: false,
      createdAt: Date.now()
    });
    await saveUserTodos(env, userId, todos);
    await client.sendMessage(chatId, `✅ <b>To-Do जोड़ा गया:</b> <i>"${itemText}"</i>`);
    return;
  }

  if (action === 'done' && itemText) {
    const index = parseInt(itemText, 10) - 1;
    if (index >= 0 && index < todos.length) {
      todos[index].completed = true;
      await saveUserTodos(env, userId, todos);
      await client.sendMessage(chatId, `🎉 <b>टास्क #${index + 1} पूर्ण चिह्नित किया गया!</b>`);
      return;
    }
  }

  if (action === 'clear') {
    await saveUserTodos(env, userId, []);
    await client.sendMessage(chatId, '🗑️ आपकी सभी To-Do सूची साफ कर दी गई है।');
    return;
  }

  // Default: list
  if (todos.length === 0) {
    await client.sendMessage(
      chatId,
      '📝 <b>आपकी To-Do सूची खाली है।</b>\nनया टास्क जोड़ने के लिए: <code>/todo add प्रोजेक्ट रिपोर्ट तैयार करना</code>'
    );
    return;
  }

  let text = '📝 <b>आपकी To-Do सूची:</b>\n\n';
  todos.forEach((t, i) => {
    const mark = t.completed ? '✅ <s>' : '⬜ ';
    const endMark = t.completed ? '</s>' : '';
    text += `${i + 1}. ${mark}${t.text}${endMark}\n`;
  });
  text += '\n<i>कमांड्स: <code>/todo add &lt;text&gt;</code> | <code>/todo done &lt;number&gt;</code> | <code>/todo clear</code></i>';

  await client.sendMessage(chatId, withNoticeBanner(text, activeNotice));
}
