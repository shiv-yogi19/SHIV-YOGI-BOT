/**
 * SHIV YOGI AI BOT - User Memory & Personalization System
 * Stores and manages explicit user facts, preferences, and details.
 */

import { getUserMemory, saveUserMemory, addMemoryFact, clearUserMemory } from '../storage/kv.js';

export async function getFormattedMemory(env, userId) {
  const memoryList = await getUserMemory(env, userId);
  if (!memoryList || memoryList.length === 0) {
    return '🧠 No saved memory facts found. As we chat, or if you tell me things to remember, they will appear here.';
  }

  let text = '🧠 <b>Your Saved Memory & Preferences:</b>\n\n';
  memoryList.forEach((item, index) => {
    text += `${index + 1}. ${item.fact}\n`;
  });
  text += '\n<i>Use /reset or settings to clear your stored memory.</i>';
  return text;
}

export async function addFact(env, userId, factText) {
  if (!factText || factText.trim() === '') return [];
  return await addMemoryFact(env, userId, factText.trim());
}

export async function wipeMemory(env, userId) {
  return await clearUserMemory(env, userId);
}
