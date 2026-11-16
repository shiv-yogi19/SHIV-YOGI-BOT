/**
 * SHIV YOGI AI BOT - Command and Message Router
 * Resolves commands, routes freeform chat to Gemini, and dispatches media.
 */

import { getCommand } from './command-registry.js';
import { parseCommandArgs } from '../security/validation.js';
import { ChatEngine } from '../ai/chat.js';
import { handleAnalyzeImage } from '../commands/image/index.js';
import { handlePdf, handleReadFile } from '../commands/files/index.js';
import { withNoticeBanner } from '../telegram/messages.js';

export async function routeMessage(ctx) {
  const { message, client, chatId, env, userId, activeNotice } = ctx;
  const text = (message.text || message.caption || '').trim();

  // 1. Slash Command Routing
  if (text.startsWith('/')) {
    const { command, args, argList } = parseCommandArgs(text);
    const cmdDef = getCommand(command);

    if (cmdDef && typeof cmdDef.handler === 'function') {
      return await cmdDef.handler({
        ...ctx,
        command,
        args,
        argList
      });
    }

    // Unknown command feedback
    await client.sendMessage(
      chatId,
      `❓ अज्ञात कमांड: <code>${command}</code>\nसभी उपलब्ध कमांड देखने के लिए <code>/help</code> टाइप करें।`
    );
    return;
  }

  // 2. Photo Handling (Multimodal Auto-Vision)
  if (message.photo && message.photo.length > 0) {
    return await handleAnalyzeImage({
      ...ctx,
      args: message.caption || 'Analyze this image and describe what you see.'
    });
  }

  // 3. Document Handling (Auto PDF or Text Reader)
  if (message.document) {
    const fileName = (message.document.file_name || '').toLowerCase();
    const mime = (message.document.mime_type || '').toLowerCase();

    if (mime === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await handlePdf({
        ...ctx,
        args: message.caption || 'Analyze this PDF document.'
      });
    }

    if (mime.startsWith('text/') || fileName.endsWith('.txt') || fileName.endsWith('.js') || fileName.endsWith('.py')) {
      return await handleReadFile(ctx);
    }
  }

  // 4. Default: Natural Language Multi-Turn Conversational Chat
  if (text) {
    await client.sendChatAction(chatId, 'typing');
    const chatEngine = new ChatEngine(env);
    const reply = await chatEngine.chat(userId, text);
    await client.sendMessage(chatId, withNoticeBanner(reply, activeNotice));
    return;
  }
}
