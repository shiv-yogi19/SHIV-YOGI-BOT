/**
 * SHIV YOGI AI BOT - Telegram File Processing Utilities
 * Safely downloads small files into memory for vision/multimodal analysis or text extraction.
 * Never executes files. Enforces strict size bounds.
 */

import { TELEGRAM_LIMITS } from '../config/constants.js';

/**
 * Downloads a Telegram file and converts to base64 string
 * @param {TelegramClient} client 
 * @param {string} fileId 
 * @returns {Promise<{ base64: string, fileSize: number, filePath: string }>}
 */
export async function downloadTelegramFileAsBase64(client, fileId) {
  const fileMeta = await client.getFile(fileId);
  if (!fileMeta || !fileMeta.file_path) {
    throw new Error('Could not retrieve file information from Telegram');
  }

  if (fileMeta.file_size && fileMeta.file_size > TELEGRAM_LIMITS.MAX_FILE_DOWNLOAD_BYTES) {
    throw new Error(`File is too large (${Math.round(fileMeta.file_size / 1024 / 1024)}MB). Maximum allowed is 15MB.`);
  }

  const downloadUrl = client.getFileDownloadUrl(fileMeta.file_path);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch(downloadUrl, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) {
      throw new Error(`Failed to download file: HTTP ${res.status}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    
    // Convert bytes to base64 safely
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);

    return {
      base64,
      fileSize: len,
      filePath: fileMeta.file_path
    };
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

/**
 * Downloads a Telegram file and decodes as UTF-8 text
 * @param {TelegramClient} client 
 * @param {string} fileId 
 * @returns {Promise<string>}
 */
export async function downloadTelegramFileAsText(client, fileId) {
  const fileMeta = await client.getFile(fileId);
  if (!fileMeta || !fileMeta.file_path) {
    throw new Error('Could not retrieve file information from Telegram');
  }

  if (fileMeta.file_size && fileMeta.file_size > 5 * 1024 * 1024) {
    throw new Error('Text document is too large (>5MB) to process in Worker memory.');
  }

  const downloadUrl = client.getFileDownloadUrl(fileMeta.file_path);
  const res = await fetch(downloadUrl);
  if (!res.ok) {
    throw new Error(`Failed to download file: HTTP ${res.status}`);
  }

  return await res.text();
}
