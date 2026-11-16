/**
 * SHIV YOGI AI BOT - Chat Engine & Conversational Context Builder
 * Assembles system prompts, user memory, style instructions, and history turns.
 */

import { GeminiClient } from './gemini.js';
import {
  getUserHistory,
  appendUserHistory,
  getUserMemory,
  getUserSettings,
  getUserProfile
} from '../storage/kv.js';
import { BOT_IDENTITY } from '../config/constants.js';

export class ChatEngine {
  constructor(env) {
    this.env = env;
    this.gemini = new GeminiClient(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  }

  /**
   * Constructs the personalized system prompt
   */
  async buildSystemPrompt(userId) {
    const settings = await getUserSettings(this.env, userId);
    const profile = await getUserProfile(this.env, userId);
    const memoryFacts = settings.memoryEnabled ? await getUserMemory(this.env, userId) : [];

    let prompt = `You are ${BOT_IDENTITY.NAME} (@${BOT_IDENTITY.USERNAME}), an advanced, highly intelligent AI assistant created by Shiv Yogi. You run on Cloudflare Workers edge architecture and are powered by Google Gemini.\n`;
    prompt += `You are polite, precise, helpful, and culturally respectful.\n`;

    if (profile.firstName) {
      prompt += `The user's name is ${profile.firstName}.\n`;
    }

    if (settings.language === 'hi') {
      prompt += `Respond predominantly in Hindi or conversational Hinglish unless the user explicitly requests otherwise.\n`;
    } else {
      prompt += `Respond in clear, natural English unless the user asks in Hindi or another language.\n`;
    }

    if (settings.style === 'creative') {
      prompt += `Style: Expressive, vivid, imaginative, and engaging.\n`;
    } else if (settings.style === 'precise') {
      prompt += `Style: Highly direct, concise, factual, without fluff.\n`;
    } else if (settings.style === 'coding') {
      prompt += `Style: Senior software engineer mode. Provide clean, well-commented code, edge-case considerations, and concise explanations.\n`;
    } else {
      prompt += `Style: Balanced, warm, articulate, and well-structured.\n`;
    }

    if (memoryFacts.length > 0) {
      prompt += `\nPersonalized context remembered about this user:\n`;
      for (const item of memoryFacts) {
        prompt += `- ${item.fact}\n`;
      }
      prompt += `Use this context naturally when relevant, but do not mention that you read it from a memory list unless asked.\n`;
    }

    return prompt;
  }

  /**
   * Sends a user query to the AI engine with full context
   * @param {string|number} userId 
   * @param {string} userMessage 
   * @param {object} [options={}] 
   * @returns {Promise<string>}
   */
  async chat(userId, userMessage, options = {}) {
    const systemPrompt = await this.buildSystemPrompt(userId);
    const rawHistory = await getUserHistory(this.env, userId);

    // Build payload contents
    const contents = [];
    for (const h of rawHistory) {
      if (h.role && h.parts && Array.isArray(h.parts)) {
        contents.push({
          role: h.role,
          parts: h.parts.map(p => ({ text: p.text || '' }))
        });
      }
    }

    // Add current turn
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const replyText = await this.gemini.generateChat(contents, systemPrompt);

    // Save history turn
    await appendUserHistory(this.env, userId, userMessage, replyText);

    return replyText;
  }

  /**
   * Single-turn ask query without history persistence
   */
  async ask(userId, prompt, customInstruction = '') {
    const systemPrompt = customInstruction || (await this.buildSystemPrompt(userId));
    return await this.gemini.generateText(prompt, systemPrompt);
  }
}
