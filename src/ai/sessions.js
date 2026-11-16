/**
 * SHIV YOGI AI BOT - Chat Session & Conversation Management
 * Controls session creation, history resets, exports, and inspection.
 */

import { getUserHistory, clearUserHistory, saveUserHistory } from '../storage/kv.js';
import { formatDateIST } from '../utilities/dates.js';

export async function createNewSession(env, userId) {
  // Clear active context to begin a clean slate
  await clearUserHistory(env, userId);
  return {
    success: true,
    sessionId: `sess_${Date.now()}`
  };
}

export async function resetHistory(env, userId) {
  await clearUserHistory(env, userId);
  return true;
}

export async function exportConversation(env, userId) {
  const history = await getUserHistory(env, userId);
  if (!history || history.length === 0) {
    return 'No conversation history found for this session.';
  }

  let doc = `# Conversation Export - User ${userId}\n`;
  doc += `Generated on: ${formatDateIST(Date.now())}\n`;
  doc += `Total Messages: ${history.length}\n\n---\n\n`;

  for (const entry of history) {
    const roleName = entry.role === 'user' ? 'User' : 'Shiv Yogi AI';
    const text = entry.parts?.map(p => p.text).join('\n') || '';
    const time = entry.timestamp ? formatDateIST(entry.timestamp) : 'N/A';
    doc += `### [${roleName}] - ${time}\n${text}\n\n---\n\n`;
  }

  return doc;
}

export async function getLastHistoryTurns(env, userId, maxCount = 5) {
  const history = await getUserHistory(env, userId);
  if (!history || history.length === 0) return [];
  return history.slice(-maxCount * 2);
}
