/**
 * SHIV YOGI AI BOT - Telegram Bot API Client
 * 
 * Implements robust HTTP requests to api.telegram.org with timeout controls,
 * automatic message splitting for long messages, and secret masking.
 * Never logs or prints the bot token.
 */

import { splitTelegramMessage } from '../utilities/text.js';
import { delay } from '../utilities/helpers.js';
import { sanitizeLogMessage } from '../security/sanitization.js';

export class TelegramClient {
  /**
   * @param {string} token - Bot Token from env.TELEGRAM_BOT_TOKEN
   */
  constructor(token) {
    this.token = token;
    this.baseUrl = `https://api.telegram.org/bot${token}`;
  }

  /**
   * Executes a Telegram API method with timeout and retry logic
   * @param {string} method 
   * @param {object|FormData} payload 
   * @param {number} [retries=2] 
   * @returns {Promise<any>}
   */
  async request(method, payload = {}, retries = 2) {
    if (!this.token) {
      throw new Error('TELEGRAM_BOT_TOKEN is missing');
    }

    const url = `${this.baseUrl}/${method}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData;
    const fetchOptions = {
      method: 'POST',
      signal: controller.signal
    };

    if (isFormData) {
      fetchOptions.body = payload;
    } else {
      fetchOptions.headers = { 'Content-Type': 'application/json' };
      fetchOptions.body = JSON.stringify(payload);
    }

    try {
      const response = await fetch(url, fetchOptions);
      clearTimeout(timeout);

      const data = await response.json();
      if (!response.ok || !data.ok) {
        // Handle rate limiting (429)
        if (response.status === 429 && retries > 0) {
          const waitTime = (data.parameters?.retry_after || 1) * 1000;
          await delay(Math.min(waitTime, 3000));
          return this.request(method, payload, retries - 1);
        }
        const errorDesc = sanitizeLogMessage(data.description || `HTTP ${response.status}`);
        throw new Error(`Telegram API Error [${method}]: ${errorDesc}`);
      }

      return data.result;
    } catch (err) {
      clearTimeout(timeout);
      if (retries > 0 && (err.name === 'AbortError' || err.message.includes('network'))) {
        await delay(1000);
        return this.request(method, payload, retries - 1);
      }
      throw new Error(sanitizeLogMessage(err.message));
    }
  }

  /**
   * Sends a message to a Telegram chat, automatically splitting if it exceeds length limits
   */
  async sendMessage(chatId, text, options = {}) {
    if (!text || String(text).trim() === '') return null;

    const chunks = splitTelegramMessage(text);
    let lastResult = null;

    for (let i = 0; i < chunks.length; i++) {
      const isLastChunk = i === chunks.length - 1;
      const payload = {
        chat_id: chatId,
        text: chunks[i],
        parse_mode: options.parse_mode !== undefined ? options.parse_mode : 'HTML',
        disable_web_page_preview: options.disable_web_page_preview ?? true
      };

      // Only attach reply_markup and reply_to_message_id to the appropriate chunk
      if (isLastChunk && options.reply_markup) {
        payload.reply_markup = options.reply_markup;
      }
      if (i === 0 && options.reply_to_message_id) {
        payload.reply_to_message_id = options.reply_to_message_id;
      }

      lastResult = await this.request('sendMessage', payload);
    }

    return lastResult;
  }

  /**
   * Edits text of an existing message
   */
  async editMessageText(chatId, messageId, text, options = {}) {
    const payload = {
      chat_id: chatId,
      message_id: messageId,
      text: text,
      parse_mode: options.parse_mode !== undefined ? options.parse_mode : 'HTML',
      disable_web_page_preview: options.disable_web_page_preview ?? true
    };
    if (options.reply_markup) {
      payload.reply_markup = options.reply_markup;
    }
    return await this.request('editMessageText', payload);
  }

  /**
   * Answers a Telegram callback query
   */
  async answerCallbackQuery(callbackQueryId, options = {}) {
    const payload = {
      callback_query_id: callbackQueryId,
      text: options.text || '',
      show_alert: options.show_alert || false
    };
    return await this.request('answerCallbackQuery', payload);
  }

  /**
   * Sends a photo (by URL, File ID, or buffer)
   */
  async sendPhoto(chatId, photo, options = {}) {
    const payload = {
      chat_id: chatId,
      photo: photo,
      caption: options.caption || '',
      parse_mode: options.parse_mode !== undefined ? options.parse_mode : 'HTML'
    };
    if (options.reply_markup) {
      payload.reply_markup = options.reply_markup;
    }
    return await this.request('sendPhoto', payload);
  }

  /**
   * Sends a document / file
   */
  async sendDocument(chatId, document, options = {}) {
    const payload = {
      chat_id: chatId,
      document: document,
      caption: options.caption || '',
      parse_mode: options.parse_mode !== undefined ? options.parse_mode : 'HTML'
    };
    if (options.reply_markup) {
      payload.reply_markup = options.reply_markup;
    }
    return await this.request('sendDocument', payload);
  }

  /**
   * Sends a chat action (typing, upload_photo, etc.)
   */
  async sendChatAction(chatId, action = 'typing') {
    try {
      return await this.request('sendChatAction', { chat_id: chatId, action });
    } catch {
      return false; // Non-critical operation
    }
  }

  /**
   * Deletes a message
   */
  async deleteMessage(chatId, messageId) {
    try {
      return await this.request('deleteMessage', { chat_id: chatId, message_id: messageId });
    } catch {
      return false;
    }
  }

  /**
   * Fetches Telegram file metadata and download path
   */
  async getFile(fileId) {
    return await this.request('getFile', { file_id: fileId });
  }

  /**
   * Gets absolute download URL for a file
   */
  getFileDownloadUrl(filePath) {
    return `https://api.telegram.org/file/bot${this.token}/${filePath}`;
  }
}
