/**
 * SHIV YOGI AI BOT - Image & Vision Commands (7 Commands)
 * /image, /imagine, /analyzeimage, /describeimage, /ocr, /imageprompt, /imagehelp
 */

import { ImageGenerationEngine } from '../../ai/image-generation.js';
import { GeminiClient } from '../../ai/gemini.js';
import { downloadTelegramFileAsBase64 } from '../../telegram/files.js';
import { withNoticeBanner } from '../../telegram/messages.js';
import { MESSAGES } from '../../config/constants.js';

export async function handleImage(ctx) {
  const { client, chatId, env, args, activeNotice } = ctx;
  if (!args || args.trim() === '') {
    await client.sendMessage(
      chatId,
      '🎨 <b>Image Generation:</b> कृपया इमेज के लिए प्रॉम्प्ट लिखें।\nउदाहरण: <code>/image A majestic lion wearing a golden crown in a lush jungle</code>'
    );
    return;
  }

  await client.sendChatAction(chatId, 'upload_photo');
  const imageEngine = new ImageGenerationEngine(env);
  const result = await imageEngine.generate(args.trim());

  if (!result.success) {
    const errorMsg = result.message || MESSAGES.IMAGE_UNAVAILABLE;
    await client.sendMessage(chatId, withNoticeBanner(errorMsg, activeNotice));
    return;
  }

  // If base64 returned, deliver via Telegram
  try {
    // Convert base64 to binary buffer / form data or send
    const binary = atob(result.base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: result.mimeType || 'image/jpeg' });
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('photo', blob, 'generated.jpg');
    formData.append('caption', withNoticeBanner(`🎨 <i>Prompt: ${args.trim()}</i>`, activeNotice));
    formData.append('parse_mode', 'HTML');

    await client.request('sendPhoto', formData);
  } catch (err) {
    console.error('Photo dispatch error:', err.message);
    await client.sendMessage(chatId, withNoticeBanner(MESSAGES.IMAGE_UNAVAILABLE, activeNotice));
  }
}

export async function handleImagine(ctx) {
  const { client, chatId, env, args, activeNotice } = ctx;
  if (!args || args.trim() === '') {
    await client.sendMessage(
      chatId,
      '✨ <b>Imagine:</b> कृपया कोई विचार या प्रॉम्प्ट दें। AI इसे समृद्ध करके कलात्मक इमेज बनाएगा।\nउदाहरण: <code>/imagine future city with flying cars and neon lights</code>'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  const gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  const imageEngine = new ImageGenerationEngine(env);

  // 1. Enhance the prompt
  const enhancedPrompt = await imageEngine.enhancePrompt(args.trim(), gemini);

  // 2. Generate with enhanced prompt
  await client.sendChatAction(chatId, 'upload_photo');
  const result = await imageEngine.generate(enhancedPrompt);

  if (!result.success) {
    const fallbackMsg =
      `✨ <b>Enhanced Prompt:</b>\n<i>${enhancedPrompt}</i>\n\n` +
      `⚠️ ${result.message || MESSAGES.IMAGE_UNAVAILABLE}`;
    await client.sendMessage(chatId, withNoticeBanner(fallbackMsg, activeNotice));
    return;
  }

  try {
    const binary = atob(result.base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('photo', blob, 'imagine.jpg');
    formData.append('caption', withNoticeBanner(`✨ <b>Enhanced Prompt:</b>\n<i>${enhancedPrompt}</i>`, activeNotice));
    formData.append('parse_mode', 'HTML');

    await client.request('sendPhoto', formData);
  } catch {
    await client.sendMessage(chatId, withNoticeBanner(MESSAGES.IMAGE_UNAVAILABLE, activeNotice));
  }
}

function extractPhotoFileId(message) {
  if (message.photo && message.photo.length > 0) {
    return message.photo[message.photo.length - 1].file_id;
  }
  if (message.reply_to_message?.photo && message.reply_to_message.photo.length > 0) {
    const arr = message.reply_to_message.photo;
    return arr[arr.length - 1].file_id;
  }
  return null;
}

export async function handleAnalyzeImage(ctx) {
  const { client, chatId, env, message, args, activeNotice } = ctx;
  const fileId = extractPhotoFileId(message);

  if (!fileId) {
    await client.sendMessage(
      chatId,
      '🖼️ <b>Analyze Image:</b> कृपया इस कमांड के साथ फोटो भेजें, या किसी फोटो संदेश का उत्तर (Reply) देते हुए <code>/analyzeimage</code> लिखें।'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  try {
    const { base64 } = await downloadTelegramFileAsBase64(client, fileId);
    const gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
    const userQuery = args ? args.trim() : 'Provide a comprehensive analysis of this image, including subject matter, visual details, setting, and notable elements.';
    const analysis = await gemini.analyzeMultimodal(userQuery, base64, 'image/jpeg');

    await client.sendMessage(chatId, withNoticeBanner(`🔍 <b>Image Analysis:</b>\n\n${analysis}`, activeNotice));
  } catch (err) {
    await client.sendMessage(chatId, `❌ चित्र विश्लेषण में त्रुटि हुई: ${err.message}`);
  }
}

export async function handleDescribeImage(ctx) {
  const { client, chatId, env, message, activeNotice } = ctx;
  const fileId = extractPhotoFileId(message);

  if (!fileId) {
    await client.sendMessage(
      chatId,
      '🖼️ <b>Describe Image:</b> कृपया किसी फोटो पर उत्तर (Reply) देते हुए <code>/describeimage</code> लिखें।'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  try {
    const { base64 } = await downloadTelegramFileAsBase64(client, fileId);
    const gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
    const prompt = 'Describe this image visually in vivid, atmospheric detail. Break down the foreground, background, color palette, lighting, mood, and style.';
    const description = await gemini.analyzeMultimodal(prompt, base64, 'image/jpeg');

    await client.sendMessage(chatId, withNoticeBanner(`🎨 <b>Visual Description:</b>\n\n${description}`, activeNotice));
  } catch (err) {
    await client.sendMessage(chatId, `❌ छवि विवरण में त्रुटि: ${err.message}`);
  }
}

export async function handleOcr(ctx) {
  const { client, chatId, env, message, activeNotice } = ctx;
  const fileId = extractPhotoFileId(message);

  if (!fileId) {
    await client.sendMessage(
      chatId,
      '📄 <b>OCR (Text Extraction):</b> कृपया किसी फोटो या डॉक्यूमेंट छवि पर रिप्लाई करते हुए <code>/ocr</code> लिखें।'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  try {
    const { base64 } = await downloadTelegramFileAsBase64(client, fileId);
    const gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
    const prompt = 'Extract all visible text from this image verbatim. Transcribe accurately preserving layout and line breaks. If handwriting or multiple languages are present, capture all of them. Do not add conversational commentary.';
    const extractedText = await gemini.analyzeMultimodal(prompt, base64, 'image/jpeg');

    await client.sendMessage(chatId, withNoticeBanner(`📝 <b>Extracted Text (OCR):</b>\n\n${extractedText}`, activeNotice));
  } catch (err) {
    await client.sendMessage(chatId, `❌ OCR निकालने में त्रुटि: ${err.message}`);
  }
}

export async function handleImagePrompt(ctx) {
  const { client, chatId, env, args, activeNotice } = ctx;
  if (!args || args.trim() === '') {
    await client.sendMessage(
      chatId,
      '💡 <b>Image Prompt Enhancer:</b> कृपया कोई साधारण विचार लिखें जिसे आप एक पेशेवर इमेज प्रॉम्प्ट में बदलना चाहते हैं।\nउदाहरण: <code>/imageprompt samurai in cyber city</code>'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  const gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  const imageEngine = new ImageGenerationEngine(env);
  const enhanced = await imageEngine.enhancePrompt(args.trim(), gemini);

  const text = (
    `🎨 <b>Enhanced Image Prompt:</b>\n\n` +
    `<code>${enhanced}</code>\n\n` +
    `<i>You can copy this prompt directly into /image or Midjourney/Stable Diffusion.</i>`
  );

  await client.sendMessage(chatId, withNoticeBanner(text, activeNotice));
}

export async function handleImageHelp(ctx) {
  const { client, chatId, env, activeNotice } = ctx;
  const imageEngine = new ImageGenerationEngine(env);
  await client.sendMessage(chatId, withNoticeBanner(imageEngine.getImageHelp(), activeNotice));
}
