/**
 * SHIV YOGI AI BOT - Writing Assistant Commands (8 Commands)
 * /write, /email, /caption, /bio, /story, /ideas, /hashtags, /quiz
 * Supports Hindi and English with natural stylistic tone.
 */

import { GeminiClient } from '../../ai/gemini.js';
import { withNoticeBanner } from '../../telegram/messages.js';

export async function handleWrite(ctx) {
  const { client, chatId, env, args, activeNotice } = ctx;
  if (!args || args.trim() === '') {
    await client.sendMessage(
      chatId,
      '✍️ <b>Article / Essay Writer:</b> कृपया विषय लिखें।\nउदाहरण: <code>/write The Impact of Artificial Intelligence on Modern Healthcare</code>'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  const gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  const prompt = `Write an engaging, thoroughly researched, well-structured article/essay on the following topic with compelling subheadings:\n\n${args.trim()}`;
  const response = await gemini.generateText(prompt, 'You are an acclaimed essayist and content strategist. Preserve the user language naturally.');

  await client.sendMessage(chatId, withNoticeBanner(response, activeNotice));
}

export async function handleEmail(ctx) {
  const { client, chatId, env, args, activeNotice } = ctx;
  if (!args || args.trim() === '') {
    await client.sendMessage(
      chatId,
      '✉️ <b>Email Drafter:</b> कृपया ईमेल का उद्देश्य या मुख्य बिंदु लिखें।\nउदाहरण: <code>/email Requesting sick leave for two days to my manager</code>'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  const gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  const prompt = `Draft a well-crafted email for the following purpose. Include Subject line, professional salutation, clear body, and appropriate sign-off:\n\n${args.trim()}`;
  const emailDraft = await gemini.generateText(prompt, 'You are an executive communications specialist.');

  await client.sendMessage(chatId, withNoticeBanner(`✉️ <b>Drafted Email:</b>\n\n${emailDraft}`, activeNotice));
}

export async function handleCaption(ctx) {
  const { client, chatId, env, args, activeNotice } = ctx;
  if (!args || args.trim() === '') {
    await client.sendMessage(
      chatId,
      '📱 <b>Social Caption Generator:</b> कृपया फोटो या पोस्ट का विषय लिखें।\nउदाहरण: <code>/caption Sunset over the mountains after a long hike</code>'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  const gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  const prompt = `Create 3 catchy, high-engagement social media captions for Instagram/LinkedIn/Twitter for this context, complete with relevant emojis and hashtags:\n\n${args.trim()}`;
  const captions = await gemini.generateText(prompt, 'You are a viral social media strategist.');

  await client.sendMessage(chatId, withNoticeBanner(`📱 <b>Social Captions:</b>\n\n${captions}`, activeNotice));
}

export async function handleBio(ctx) {
  const { client, chatId, env, args, activeNotice } = ctx;
  if (!args || args.trim() === '') {
    await client.sendMessage(
      chatId,
      '👤 <b>Profile Bio Generator:</b> अपने पेशे, रुचियों या ब्रांड के बारे में लिखें।\nउदाहरण: <code>/bio Full-stack developer, open source enthusiast, coffee lover</code>'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  const gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  const prompt = `Craft 3 compelling profile bios (Professional/LinkedIn, Punchy/Twitter, Creative/Instagram) based on these details:\n\n${args.trim()}`;
  const bios = await gemini.generateText(prompt, 'You are a personal branding expert.');

  await client.sendMessage(chatId, withNoticeBanner(`👤 <b>Profile Bios:</b>\n\n${bios}`, activeNotice));
}

export async function handleStory(ctx) {
  const { client, chatId, env, args, activeNotice } = ctx;
  if (!args || args.trim() === '') {
    await client.sendMessage(
      chatId,
      '📖 <b>Story Generator:</b> कृपया कहानी का आधार (Premise) या विचार लिखें।\nउदाहरण: <code>/story An ancient time traveler who accidentally lands in 2026 Mumbai</code>'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  const gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  const prompt = `Write an immersive, evocative short story with strong character development, vivid sensory descriptions, tension, and a satisfying climax based on this premise:\n\n${args.trim()}`;
  const story = await gemini.generateText(prompt, 'You are a master storyteller and fiction author.');

  await client.sendMessage(chatId, withNoticeBanner(story, activeNotice));
}

export async function handleIdeas(ctx) {
  const { client, chatId, env, args, activeNotice } = ctx;
  if (!args || args.trim() === '') {
    await client.sendMessage(
      chatId,
      '💡 <b>Idea Generator:</b> विषय या समस्या का उल्लेख करें।\nउदाहरण: <code>/ideas YouTube video concepts for tech tutorials</code>'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  const gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  const prompt = `Brainstorm 10 creative, actionable, high-impact ideas for the following topic. Include brief execution tips for each:\n\n${args.trim()}`;
  const ideas = await gemini.generateText(prompt, 'You are an innovation consultant and creative strategist.');

  await client.sendMessage(chatId, withNoticeBanner(`💡 <b>Creative Ideas:</b>\n\n${ideas}`, activeNotice));
}

export async function handleHashtags(ctx) {
  const { client, chatId, env, args, activeNotice } = ctx;
  if (!args || args.trim() === '') {
    await client.sendMessage(
      chatId,
      '#️⃣ <b>Hashtag Generator:</b> पोस्ट का विषय या कीवर्ड दें।\nउदाहरण: <code>/hashtags Travel photography in Himachal</code>'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  const gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  const prompt = `Generate a targeted set of 25-30 relevant hashtags for this topic, categorizing them into: 1) High Volume/Viral, 2) Niche Community, 3) Location/Specific:\n\n${args.trim()}`;
  const hashtags = await gemini.generateText(prompt, 'You are an Instagram algorithm and hashtag SEO expert.');

  await client.sendMessage(chatId, withNoticeBanner(`#️⃣ <b>Hashtags:</b>\n\n${hashtags}`, activeNotice));
}

export async function handleQuiz(ctx) {
  const { client, chatId, env, args, activeNotice } = ctx;
  const topic = (args || 'General Knowledge and Science').trim();

  await client.sendChatAction(chatId, 'typing');
  const gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  const prompt = `Create an engaging 5-question multiple-choice quiz on: "${topic}". For each question provide: Questions with Options A, B, C, D, followed by an Answers & Explanations section at the end (hidden inside a spoiler format if possible):\n\n`;
  const quiz = await gemini.generateText(prompt, 'You are an interactive educational quiz master.');

  await client.sendMessage(chatId, withNoticeBanner(`🎯 <b>Quiz on ${topic}:</b>\n\n${quiz}`, activeNotice));
}
