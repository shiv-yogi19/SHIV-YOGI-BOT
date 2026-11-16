/**
 * SHIV YOGI AI BOT - Coding Assistant Commands (8 Commands)
 * /code, /debug, /fixcode, /reviewcode, /explaincode, /formatcode, /convertcode, /regex
 * NEVER executes arbitrary user code inside the Worker.
 */

import { GeminiClient } from '../../ai/gemini.js';
import { withNoticeBanner } from '../../telegram/messages.js';

export async function handleCode(ctx) {
  const { client, chatId, env, args, activeNotice } = ctx;
  if (!args || args.trim() === '') {
    await client.sendMessage(
      chatId,
      '💻 <b>Code Generator:</b> कृपया विवरण या समस्या लिखें।\nउदाहरण: <code>/code Python function to calculate Fibonacci series with memoization</code>'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  const gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  const prompt = `Write clean, robust, production-ready code with concise inline comments for the following requirement:\n\n${args.trim()}`;
  const response = await gemini.generateText(prompt, 'You are a Senior Principal Software Engineer. Provide idiomatic, clean code with brief usage examples.');

  await client.sendMessage(chatId, withNoticeBanner(response, activeNotice));
}

export async function handleDebug(ctx) {
  const { client, chatId, env, message, args, activeNotice } = ctx;
  let targetCode = (args || '').trim();
  if (!targetCode && message.reply_to_message?.text) {
    targetCode = message.reply_to_message.text;
  }

  if (!targetCode) {
    await client.sendMessage(
      chatId,
      '🐞 <b>Code Debugger:</b> कृपया डिबग करने के लिए कोड स्निपेट प्रदान करें या किसी कोड संदेश का उत्तर दें।\nउदाहरण: <code>/debug def add(a, b): return a - b</code>'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  const gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  const prompt = `Carefully inspect and debug the following code. Identify syntax bugs, logical errors, edge cases, potential exceptions, and security pitfalls:\n\n${targetCode}`;
  const analysis = await gemini.generateText(prompt, 'You are an elite code auditor and debugger. Pinpoint exact flaws clearly.');

  await client.sendMessage(chatId, withNoticeBanner(`🐞 <b>Debug Analysis:</b>\n\n${analysis}`, activeNotice));
}

export async function handleFixCode(ctx) {
  const { client, chatId, env, message, args, activeNotice } = ctx;
  let targetCode = (args || '').trim();
  if (!targetCode && message.reply_to_message?.text) {
    targetCode = message.reply_to_message.text;
  }

  if (!targetCode) {
    await client.sendMessage(
      chatId,
      '🔧 <b>Fix Code:</b> कृपया सही करने के लिए कोड स्निपेट भेजें या रिप्लाई करें।'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  const gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  const prompt = `Fix and refactor the following code completely. Provide the corrected working code followed by a bulleted summary of fixes applied:\n\n${targetCode}`;
  const fixed = await gemini.generateText(prompt, 'You are an expert software developer. Return working, clean, corrected code.');

  await client.sendMessage(chatId, withNoticeBanner(`🔧 <b>Corrected Code:</b>\n\n${fixed}`, activeNotice));
}

export async function handleReviewCode(ctx) {
  const { client, chatId, env, message, args, activeNotice } = ctx;
  let targetCode = (args || '').trim();
  if (!targetCode && message.reply_to_message?.text) {
    targetCode = message.reply_to_message.text;
  }

  if (!targetCode) {
    await client.sendMessage(
      chatId,
      '🔍 <b>Code Review:</b> कृपया कोड रिव्यू के लिए कोड स्निपेट भेजें या रिप्लाई करें।'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  const gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  const prompt = `Conduct a rigorous peer code review of the following code across: 1) Architecture & Design, 2) Performance & Complexity, 3) Security & Sanitization, 4) Code Style & Maintainability:\n\n${targetCode}`;
  const review = await gemini.generateText(prompt, 'You are a Tech Lead conducting an architectural code review.');

  await client.sendMessage(chatId, withNoticeBanner(`🔍 <b>Code Review:</b>\n\n${review}`, activeNotice));
}

export async function handleExplainCode(ctx) {
  const { client, chatId, env, message, args, activeNotice } = ctx;
  let targetCode = (args || '').trim();
  if (!targetCode && message.reply_to_message?.text) {
    targetCode = message.reply_to_message.text;
  }

  if (!targetCode) {
    await client.sendMessage(
      chatId,
      '💡 <b>Explain Code:</b> कृपया कोड स्निपेट भेजें जिसे आप समझना चाहते हैं।'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  const gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  const prompt = `Explain the following code step-by-step for a developer, clarifying the purpose of key functions, algorithms, parameters, and return values:\n\n${targetCode}`;
  const explanation = await gemini.generateText(prompt, 'You are a patient programming instructor.');

  await client.sendMessage(chatId, withNoticeBanner(`💡 <b>Code Walkthrough:</b>\n\n${explanation}`, activeNotice));
}

export async function handleFormatCode(ctx) {
  const { client, chatId, env, message, args, activeNotice } = ctx;
  let targetCode = (args || '').trim();
  if (!targetCode && message.reply_to_message?.text) {
    targetCode = message.reply_to_message.text;
  }

  if (!targetCode) {
    await client.sendMessage(
      chatId,
      '✨ <b>Format Code:</b> कृपया फॉर्मेट करने के लिए कोड स्निपेट भेजें।'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  const gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  const prompt = `Reformat, beautify, and properly indent the following code according to modern standard style guides (PEP8, Prettier, etc.):\n\n${targetCode}`;
  const formatted = await gemini.generateText(prompt, 'You are an automated code formatter.');

  await client.sendMessage(chatId, withNoticeBanner(`✨ <b>Formatted Code:</b>\n\n${formatted}`, activeNotice));
}

export async function handleConvertCode(ctx) {
  const { client, chatId, env, message, args, activeNotice } = ctx;
  let text = (args || '').trim();
  if (!text && message.reply_to_message?.text) {
    text = message.reply_to_message.text;
  }

  if (!text) {
    await client.sendMessage(
      chatId,
      '🔄 <b>Convert Code:</b> स्रोत भाषा, लक्ष्य भाषा और कोड प्रदान करें।\nउदाहरण: <code>/convertcode Python to JavaScript def add(a, b): return a + b</code>'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  const gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  const prompt = `Translate and convert the following code snippet to the requested target language, adopting idiomatic conventions and standard libraries:\n\n${text}`;
  const converted = await gemini.generateText(prompt, 'You are an expert polyglot programmer.');

  await client.sendMessage(chatId, withNoticeBanner(`🔄 <b>Converted Code:</b>\n\n${converted}`, activeNotice));
}

export async function handleRegex(ctx) {
  const { client, chatId, env, args, activeNotice } = ctx;
  if (!args || args.trim() === '') {
    await client.sendMessage(
      chatId,
      '🔤 <b>Regex Generator:</b> क्या मैच करना है उसका विवरण लिखें या पैटर्न समझाएँ।\nउदाहरण: <code>/regex Match valid international phone numbers with country code</code>'
    );
    return;
  }

  await client.sendChatAction(chatId, 'typing');
  const gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  const prompt = `Generate a robust Regular Expression for the following pattern description. Include: 1) The Regex pattern in code block, 2) Detailed token-by-token explanation, 3) 3 positive matching examples, 4) 3 negative non-matching examples:\n\n${args.trim()}`;
  const regexGuide = await gemini.generateText(prompt, 'You are a regex specialist.');

  await client.sendMessage(chatId, withNoticeBanner(`🔤 <b>Regex Solution:</b>\n\n${regexGuide}`, activeNotice));
}
