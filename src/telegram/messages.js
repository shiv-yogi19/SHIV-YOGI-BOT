/**
 * SHIV YOGI AI BOT - Standardized Message Templates & Banner Injector
 * Injects active system notices and formats responses according to language.
 */

import { bold, italic, code } from './formatting.js';
import { BOT_IDENTITY } from '../config/constants.js';

/**
 * Prepends active notice banner to a message if active
 * @param {string} messageText 
 * @param {object|null} activeNotice 
 * @returns {string}
 */
export function withNoticeBanner(messageText, activeNotice = null) {
  if (!activeNotice || !activeNotice.text) {
    return messageText;
  }

  const banner = `📢 ${bold('Notice:')} <i>${activeNotice.text}</i>\n━━━━━━━━━━━━━━━━━━━━\n\n`;
  return `${banner}${messageText}`;
}

export function formatWelcomeMessage(user) {
  const name = user.first_name || 'Friend';
  return (
    `🙏 ${bold(`नमस्ते, ${name}! Welcome to ${BOT_IDENTITY.NAME}`)}\n\n` +
    `🤖 I am your comprehensive, all-in-one AI assistant powered by Google Gemini and Cloudflare Workers.\n\n` +
    `✨ ${bold('Quick Capabilities:')}\n` +
    `• 💬 Multi-turn AI Chat & Personalized Memory\n` +
    `• 🎨 Text-to-Image & Multimodal Vision\n` +
    `• 💻 Code Generation, Debugging & Reviews\n` +
    `• ✍️ Articles, Emails, Social Captions & Stories\n` +
    `• 📁 PDF & Document Processing\n` +
    `• ⚡ Math Solver, Safe Calculator & Daily Tools\n\n` +
    `👇 ${italic('Select a category below or type /help to explore all 60 commands:')}`
  );
}

export function formatCategoryMenu(category) {
  switch (category) {
    case 'ai':
      return (
        `🤖 ${bold('AI Assistant Commands (12)')}\n\n` +
        `• ${code('/ask <prompt>')} - Ask anything directly\n` +
        `• ${code('/chat <msg>')} - Interactive context-aware chat\n` +
        `• ${code('/newchat')} - Start a clean chat session\n` +
        `• ${code('/reset')} - Reset your active chat history\n` +
        `• ${code('/memory')} - View your personalized memory\n` +
        `• ${code('/history')} - View recent conversation turns\n` +
        `• ${code('/export')} - Export chat history\n` +
        `• ${code('/summarize <text>')} - Summarize text/message\n` +
        `• ${code('/translate <lang> <text>')} - Translate text\n` +
        `• ${code('/explain <concept>')} - Step-by-step explanation\n` +
        `• ${code('/rewrite <text>')} - Rephrase in selected style\n` +
        `• ${code('/continue')} - Continue previous response`
      );

    case 'image':
      return (
        `🎨 ${bold('Image & Vision Commands (7)')}\n\n` +
        `• ${code('/image <prompt>')} - Generate image from text\n` +
        `• ${code('/imagine <prompt>')} - Creative generation with prompt enhancement\n` +
        `• ${code('/analyzeimage')} - Detailed vision analysis of photo\n` +
        `• ${code('/describeimage')} - Descriptive scene breakdown\n` +
        `• ${code('/ocr')} - Extract text from image\n` +
        `• ${code('/imageprompt <idea>')} - Expand idea into diffusion prompt\n` +
        `• ${code('/imagehelp')} - Tips and guidance for image tools`
      );

    case 'coding':
      return (
        `💻 ${bold('Coding Assistant Commands (8)')}\n\n` +
        `• ${code('/code <prompt>')} - Generate clean code\n` +
        `• ${code('/debug <code>')} - Locate and diagnose bugs\n` +
        `• ${code('/fixcode <code>')} - Provide working corrected code\n` +
        `• ${code('/reviewcode <code>')} - Code audit & best practices\n` +
        `• ${code('/explaincode <code>')} - Line-by-line code explanation\n` +
        `• ${code('/formatcode <code>')} - Beautify and structure code\n` +
        `• ${code('/convertcode <from> to <to> <code>')} - Translate language\n` +
        `• ${code('/regex <description>')} - Generate & test regex`
      );

    case 'writing':
      return (
        `✍️ ${bold('Writing Assistant Commands (8)')}\n\n` +
        `• ${code('/write <topic>')} - Comprehensive articles/blogs\n` +
        `• ${code('/email <purpose>')} - Professional & casual emails\n` +
        `• ${code('/caption <topic>')} - Engaging social captions\n` +
        `• ${code('/bio <details>')} - Compelling profile bios\n` +
        `• ${code('/story <premise>')} - Creative story generation\n` +
        `• ${code('/ideas <topic>')} - Brainstorming angles & solutions\n` +
        `• ${code('/hashtags <topic>')} - High-traffic viral hashtags\n` +
        `• ${code('/quiz <topic>')} - Multiple-choice quizzes`
      );

    case 'files':
      return (
        `📁 ${bold('File & Document Commands (7)')}\n\n` +
        `• ${code('/file')} - Overview of supported file actions\n` +
        `• ${code('/readfile')} - Read text/code documents\n` +
        `• ${code('/pdf')} - Extract text content from PDF\n` +
        `• ${code('/document')} - Document structure inspector\n` +
        `• ${code('/extract')} - Extract emails, links, or code\n` +
        `• ${code('/convert')} - Convert text, CSV, or Markdown\n` +
        `• ${code('/fileinfo')} - Metadata & file details`
      );

    case 'utilities':
      return (
        `⚡ ${bold('Utility Commands (8)')}\n\n` +
        `• ${code('/calculate <expr>')} - Safe math calculator\n` +
        `• ${code('/math <problem>')} - Step-by-step math solver\n` +
        `• ${code('/weather <city>')} - Real-time weather info\n` +
        `• ${code('/search <query>')} - Fast web lookup\n` +
        `• ${code('/define <word>')} - Dictionary & etymology\n` +
        `• ${code('/shorten <url>')} - Clean URL shortener\n` +
        `• ${code('/remind <time> <text>')} - Set reminders\n` +
        `• ${code('/todo [list|add|done]')} - To-do list manager`
      );

    default:
      return `ℹ️ ${bold('Help & Information')}\nSelect a category or command to get started.`;
  }
}
