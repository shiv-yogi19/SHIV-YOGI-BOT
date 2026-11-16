/**
 * SHIV YOGI AI BOT - AI Assistant Commands (12 Commands)
 * /ask, /chat, /newchat, /reset, /memory, /history, /export,
 * /summarize, /translate, /explain, /rewrite, /continue
 */

import { ChatEngine } from '../../ai/chat.js';
import { GeminiClient } from '../../ai/gemini.js';
import { createNewSession, resetHistory, exportConversation, getLastHistoryTurns } from '../../ai/sessions.js';
import { getFormattedMemory } from '../../ai/memory.js';
import { getConfirmationKeyboard } from '../../telegram/keyboards.js';
import { withNoticeBanner } from '../../telegram/messages.js';
import { bold, code, italic } from '../../telegram/formatting.js';

export async function handleAsk(ctx) {
  const { client, chatId, env, userId, args, activeNotice } = ctx;
  if (!args || args.trim() === '') {
    await client.sendMessage(chatId, '❓ कृपया अपना प्रश्न दर्ज करें।\nउदाहरण: <code>/ask क्वांटम कंप्यूटिंग क्या है?</code>');
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  const chatEngine = new ChatEngine(env);
  const response = await chatEngine.ask(userId, args.trim());
  await client.sendMessage(chatId, withNoticeBanner(response, activeNotice));
}

export async function handleChat(ctx) {
  const { client, chatId, env, userId, args, activeNotice } = ctx;
  if (!args || args.trim() === '') {
    await client.sendMessage(chatId, '💬 कृपया चैट संदेश लिखें।\nउदाहरण: <code>/chat नमस्ते, मुझे एक नई भाषा सीखने में मदद करो</code>');
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  const chatEngine = new ChatEngine(env);
  const reply = await chatEngine.chat(userId, args.trim());
  await client.sendMessage(chatId, withNoticeBanner(reply, activeNotice));
}

export async function handleNewChat(ctx) {
  const { client, chatId, env, userId } = ctx;
  await createNewSession(env, userId);
  await client.sendMessage(
    chatId,
    '✨ <b>नया चैट सत्र (New Chat) प्रारंभ हो गया है!</b>\nपिछला संदर्भ रीसेट कर दिया गया है। आप नया विषय शुरू कर सकते हैं।'
  );
}

export async function handleReset(ctx) {
  const { client, chatId } = ctx;
  await client.sendMessage(
    chatId,
    '⚠️ <b>क्या आप वाकई अपना वर्तमान चैट इतिहास रीसेट करना चाहते हैं?</b>\n(आपके व्यक्तिगत प्रोफाइल या मेमोरी पर इसका असर नहीं पड़ेगा)',
    { reply_markup: getConfirmationKeyboard('reset_history', 'self') }
  );
}

export async function handleMemory(ctx) {
  const { client, chatId, env, userId } = ctx;
  const memoryText = await getFormattedMemory(env, userId);
  await client.sendMessage(chatId, memoryText);
}

export async function handleHistory(ctx) {
  const { client, chatId, env, userId } = ctx;
  const turns = await getLastHistoryTurns(env, userId, 4);

  if (!turns || turns.length === 0) {
    await client.sendMessage(chatId, '📜 आपके वर्तमान सत्र में कोई पिछला चैट इतिहास नहीं है।');
    return;
  }

  let text = '📜 <b>हाल का चैट इतिहास (Recent Turns):</b>\n\n';
  for (const t of turns) {
    const roleIcon = t.role === 'user' ? '👤 <b>You:</b>' : '🤖 <b>Shiv Yogi:</b>';
    const content = t.parts?.map(p => p.text).join('\n') || '';
    const snippet = content.length > 200 ? content.slice(0, 197) + '...' : content;
    text += `${roleIcon} ${snippet}\n\n`;
  }
  text += '<i>Use /export to download full conversation or /reset to clear.</i>';

  await client.sendMessage(chatId, text);
}

export async function handleExport(ctx) {
  const { client, chatId, env, userId } = ctx;
  await client.sendChatAction(chatId, 'upload_document');
  const markdownText = await exportConversation(env, userId);
  
  // If short, send in chat; if longer, send as formatted document message
  await client.sendMessage(
    chatId,
    `📥 <b>Conversation History Export</b>\n\n<pre>${markdownText.slice(0, 3500)}</pre>`
  );
}

export async function handleSummarize(ctx) {
  const { client, chatId, env, message, args, activeNotice } = ctx;
  let targetText = (args || '').trim();

  // If replied to a message, summarize the replied text
  if (!targetText && message.reply_to_message?.text) {
    targetText = message.reply_to_message.text;
  }

  if (!targetText) {
    await client.sendMessage(
      chatId,
      '📝 <b>Summarize:</b> कृपया सारांशित करने के लिए टेक्स्ट दें या किसी संदेश का उत्तर दें।\nउदाहरण: <code>/summarize &lt;लंबा लेख या पैराग्राफ&gt;</code>'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  const gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  const prompt = `Summarize the following text concisely, extracting key takeaways and core points:\n\n${targetText}`;
  const summary = await gemini.generateText(prompt, 'You are an executive summary assistant. Be clear, crisp, and structured with bullet points.');

  await client.sendMessage(chatId, withNoticeBanner(`📋 <b>Summary:</b>\n\n${summary}`, activeNotice));
}

export async function handleTranslate(ctx) {
  const { client, chatId, env, message, args, argList, activeNotice } = ctx;
  let targetLang = 'English';
  let textToTranslate = '';

  if (argList.length >= 2) {
    targetLang = argList[0];
    textToTranslate = args.slice(targetLang.length).trim();
  } else if (argList.length === 1 && message.reply_to_message?.text) {
    targetLang = argList[0];
    textToTranslate = message.reply_to_message.text;
  } else if (!args && message.reply_to_message?.text) {
    targetLang = 'English';
    textToTranslate = message.reply_to_message.text;
  }

  if (!textToTranslate) {
    await client.sendMessage(
      chatId,
      '🌐 <b>Translate:</b> कृपया लक्ष्य भाषा और टेक्स्ट प्रदान करें या किसी संदेश पर रिप्लाई करें।\nउदाहरण: <code>/translate Hindi Hello, how can I help you today?</code>'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  const gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  const prompt = `Translate the following text into ${targetLang} accurately, preserving nuances and tone:\n\n${textToTranslate}`;
  const translated = await gemini.generateText(prompt, 'You are an expert polyglot translator.');

  await client.sendMessage(chatId, withNoticeBanner(`🌐 <b>Translation (${targetLang}):</b>\n\n${translated}`, activeNotice));
}

export async function handleExplain(ctx) {
  const { client, chatId, env, args, activeNotice } = ctx;
  if (!args || args.trim() === '') {
    await client.sendMessage(chatId, '💡 <b>Explain:</b> कृपया कोई अवधारणा या विषय लिखें जिसे आप समझना चाहते हैं।\nउदाहरण: <code>/explain ब्लैक होल क्या है?</code>');
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  const gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  const prompt = `Explain the following topic simply and comprehensively, using analogies and step-by-step clarity:\n\n${args.trim()}`;
  const explanation = await gemini.generateText(prompt, 'You are a master educator. Explain complex ideas clearly and engagingly.');

  await client.sendMessage(chatId, withNoticeBanner(`💡 <b>Explanation:</b>\n\n${explanation}`, activeNotice));
}

export async function handleRewrite(ctx) {
  const { client, chatId, env, message, args, activeNotice } = ctx;
  let targetText = (args || '').trim();
  if (!targetText && message.reply_to_message?.text) {
    targetText = message.reply_to_message.text;
  }

  if (!targetText) {
    await client.sendMessage(
      chatId,
      '✍️ <b>Rewrite:</b> कृपया पुनर्लेखन के लिए टेक्स्ट दें या किसी संदेश का उत्तर दें।\nउदाहरण: <code>/rewrite Hey guys I am making a new bot check it out</code>'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  const gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  const prompt = `Rewrite and polish the following text in 3 distinct versions: 1) Professional & Polished, 2) Engaging & Friendly, 3) Concise & Punchy:\n\n${targetText}`;
  const rewritten = await gemini.generateText(prompt, 'You are an expert copywriter and editor.');

  await client.sendMessage(chatId, withNoticeBanner(`✍️ <b>Rewritten Variations:</b>\n\n${rewritten}`, activeNotice));
}

export async function handleContinue(ctx) {
  const { client, chatId, env, userId, activeNotice } = ctx;
  const turns = await getLastHistoryTurns(env, userId, 1);
  if (!turns || turns.length === 0) {
    await client.sendMessage(chatId, '⚠️ जारी रखने के लिए कोई पिछला उत्तर उपलब्ध नहीं है।');
    return;
  }

  const lastModelMsg = turns[turns.length - 1];
  if (lastModelMsg.role !== 'model') {
    await client.sendMessage(chatId, '⚠️ कोई पिछला AI उत्तर नहीं मिला।');
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  const chatEngine = new ChatEngine(env);
  const continuation = await chatEngine.chat(
    userId,
    'Please continue exactly from where your last response left off, completing any unfinished points or providing the next logical section.'
  );

  await client.sendMessage(chatId, withNoticeBanner(continuation, activeNotice));
}
