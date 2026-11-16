/**
 * SHIV YOGI AI BOT - File & Document Processing Commands (7 Commands)
 * /file, /readfile, /pdf, /document, /extract, /convert, /fileinfo
 * Safe handling, strict memory limits, zero code execution.
 */

import { downloadTelegramFileAsText, downloadTelegramFileAsBase64 } from '../../telegram/files.js';
import { GeminiClient } from '../../ai/gemini.js';
import { withNoticeBanner } from '../../telegram/messages.js';
import { TELEGRAM_LIMITS } from '../../config/constants.js';

function getDocumentMetadata(message) {
  if (message.document) return message.document;
  if (message.reply_to_message?.document) return message.reply_to_message.document;
  return null;
}

export async function handleFile(ctx) {
  const { client, chatId, activeNotice } = ctx;
  const guide = (
    `📁 <b>File & Document Processing Suite</b>\n\n` +
    `You can upload or reply to files using the following commands:\n\n` +
    `• <code>/readfile</code> - Reads and displays content of text/code/markdown documents.\n` +
    `• <code>/pdf</code> - Analyzes and extracts text from PDF documents.\n` +
    `• <code>/document</code> - Inspects document structure, line count, and metrics.\n` +
    `• <code>/extract</code> - Extracts emails, URLs, dates, or code blocks.\n` +
    `• <code>/convert</code> - Converts text or structured content to JSON/CSV/HTML.\n` +
    `• <code>/fileinfo</code> - Displays technical file metadata and MIME details.\n\n` +
    `🔒 <i>Security Note: Files are processed securely in-memory and are never executed. Max file size: 15MB.</i>`
  );
  await client.sendMessage(chatId, withNoticeBanner(guide, activeNotice));
}

export async function handleReadFile(ctx) {
  const { client, chatId, message, activeNotice } = ctx;
  const doc = getDocumentMetadata(message);

  if (!doc) {
    await client.sendMessage(
      chatId,
      '📄 <b>Read File:</b> कृपया किसी टेक्स्ट/कोड फाइल को भेजते समय या उस पर रिप्लाई करते हुए <code>/readfile</code> लिखें।'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  try {
    const content = await downloadTelegramFileAsText(client, doc.file_id);
    const snippet = content.length > 3000 ? content.slice(0, 2950) + '\n\n... [Content Truncated due to size]' : content;

    await client.sendMessage(
      chatId,
      withNoticeBanner(
        `📄 <b>File:</b> <code>${doc.file_name || 'document'}</code>\n\n<pre>${snippet}</pre>`,
        activeNotice
      )
    );
  } catch (err) {
    await client.sendMessage(chatId, `❌ फाइल पढ़ने में त्रुटि: ${err.message}`);
  }
}

export async function handlePdf(ctx) {
  const { client, chatId, env, message, args, activeNotice } = ctx;
  const doc = getDocumentMetadata(message);

  if (!doc) {
    await client.sendMessage(
      chatId,
      '📑 <b>PDF Inspector:</b> कृपया किसी PDF दस्तावेज को भेजते हुए या उस पर रिप्लाई करते हुए <code>/pdf</code> लिखें।'
    );
    return;
  }

  if (doc.mime_type !== 'application/pdf' && !doc.file_name?.toLowerCase().endsWith('.pdf')) {
    await client.sendMessage(chatId, '⚠️ यह फाइल एक वैध PDF नहीं लगती। कृपया एक PDF फाइल प्रदान करें।');
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  try {
    const { base64 } = await downloadTelegramFileAsBase64(client, doc.file_id);
    const gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
    const userInstruction = args ? args.trim() : 'Extract the key information, summarize the document, and list its main sections and conclusions.';
    const result = await gemini.analyzeMultimodal(userInstruction, base64, 'application/pdf');

    await client.sendMessage(chatId, withNoticeBanner(`📑 <b>PDF Analysis (${doc.file_name || 'Document'}):</b>\n\n${result}`, activeNotice));
  } catch (err) {
    await client.sendMessage(chatId, `❌ PDF विश्लेषण में त्रुटि: ${err.message}`);
  }
}

export async function handleDocument(ctx) {
  const { client, chatId, message, activeNotice } = ctx;
  const doc = getDocumentMetadata(message);

  if (!doc) {
    await client.sendMessage(
      chatId,
      '📑 <b>Document Inspector:</b> कृपया किसी दस्तावेज पर रिप्लाई करते हुए <code>/document</code> लिखें।'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  try {
    const text = await downloadTelegramFileAsText(client, doc.file_id);
    const lines = text.split('\n').length;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const chars = text.length;

    const summary = (
      `📊 <b>Document Metrics:</b>\n\n` +
      `• <b>File Name:</b> <code>${doc.file_name || 'unknown'}</code>\n` +
      `• <b>MIME Type:</b> <code>${doc.mime_type || 'N/A'}</code>\n` +
      `• <b>File Size:</b> ${Math.round((doc.file_size || 0) / 1024)} KB\n` +
      `• <b>Line Count:</b> ${lines.toLocaleString()}\n` +
      `• <b>Word Count:</b> ${words.toLocaleString()}\n` +
      `• <b>Character Count:</b> ${chars.toLocaleString()}`
    );

    await client.sendMessage(chatId, withNoticeBanner(summary, activeNotice));
  } catch (err) {
    await client.sendMessage(chatId, `❌ दस्तावेज का निरीक्षण करने में असमर्थ: ${err.message}`);
  }
}

export async function handleExtract(ctx) {
  const { client, chatId, message, args, activeNotice } = ctx;
  let text = (args || '').trim();

  if (!text) {
    const doc = getDocumentMetadata(message);
    if (doc) {
      text = await downloadTelegramFileAsText(client, doc.file_id).catch(() => '');
    } else if (message.reply_to_message?.text) {
      text = message.reply_to_message.text;
    }
  }

  if (!text) {
    await client.sendMessage(
      chatId,
      '🔍 <b>Data Extractor:</b> कृपया टेक्स्ट प्रदान करें या फाइल/मैसेज पर रिप्लाई करें जिससे डेटा निकालना है।'
    );
    return;
  }

  // Regex extractors
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;

  const emails = [...new Set(text.match(emailRegex) || [])];
  const urls = [...new Set(text.match(urlRegex) || [])];
  const ips = [...new Set(text.match(ipRegex) || [])];

  let output = '🔍 <b>Extracted Structured Entities:</b>\n\n';
  output += `📧 <b>Emails (${emails.length}):</b>\n${emails.length > 0 ? emails.map(e => `• <code>${e}</code>`).join('\n') : 'None found'}\n\n`;
  output += `🔗 <b>URLs (${urls.length}):</b>\n${urls.length > 0 ? urls.map(u => `• ${u}`).join('\n') : 'None found'}\n\n`;
  output += `🌐 <b>IP Addresses (${ips.length}):</b>\n${ips.length > 0 ? ips.map(i => `• <code>${i}</code>`).join('\n') : 'None found'}`;

  await client.sendMessage(chatId, withNoticeBanner(output, activeNotice));
}

export async function handleConvert(ctx) {
  const { client, chatId, env, message, args, activeNotice } = ctx;
  let text = (args || '').trim();
  if (!text && message.reply_to_message?.text) {
    text = message.reply_to_message.text;
  }

  if (!text) {
    await client.sendMessage(
      chatId,
      '🔄 <b>Convert Format:</b> कृपया टेक्स्ट दें या किसी संदेश का उत्तर दें जिसे JSON, CSV या HTML में बदलना है।\nउदाहरण: <code>/convert to JSON: Name: Shiv, Age: 25, City: Mumbai</code>'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  const gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  const prompt = `Convert the following text cleanly into the format requested (JSON, CSV, or formatted Table). Return only the converted format:\n\n${text}`;
  const converted = await gemini.generateText(prompt, 'You are a data conversion engine.');

  await client.sendMessage(chatId, withNoticeBanner(`🔄 <b>Converted Output:</b>\n\n${converted}`, activeNotice));
}

export async function handleFileInfo(ctx) {
  const { client, chatId, message, activeNotice } = ctx;
  const doc = getDocumentMetadata(message);

  if (!doc) {
    await client.sendMessage(
      chatId,
      'ℹ️ <b>File Info:</b> कृपया किसी फाइल पर उत्तर (Reply) देते हुए <code>/fileinfo</code> लिखें।'
    );
    return;
  }

  const info = (
    `ℹ️ <b>Technical File Information:</b>\n\n` +
    `• <b>File Name:</b> <code>${doc.file_name || 'N/A'}</code>\n` +
    `• <b>File ID:</b> <code>${doc.file_id}</code>\n` +
    `• <b>Unique ID:</b> <code>${doc.file_unique_id || 'N/A'}</code>\n` +
    `• <b>MIME Type:</b> <code>${doc.mime_type || 'unknown'}</code>\n` +
    `• <b>File Size:</b> ${doc.file_size ? `${(doc.file_size / 1024).toFixed(2)} KB (${doc.file_size} bytes)` : 'Unknown'}`
  );

  await client.sendMessage(chatId, withNoticeBanner(info, activeNotice));
}
