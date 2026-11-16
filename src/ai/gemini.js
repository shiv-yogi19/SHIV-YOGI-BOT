/**
 * SHIV YOGI AI BOT - Google Gemini API Client
 * 
 * Supports text generation, multi-turn chat, and multimodal vision analysis
 * using the official Google Generative Language API v1beta.
 * NEVER logs or prints GEMINI_API_KEY.
 */

import { AI_CONFIG } from '../config/constants.js';
import { delay } from '../utilities/helpers.js';
import { sanitizeLogMessage } from '../security/sanitization.js';

export class GeminiClient {
  /**
   * @param {string} apiKey - Gemini API Key from env.GEMINI_API_KEY
   * @param {string} [defaultModel] - Default model identifier
   */
  constructor(apiKey, defaultModel = AI_CONFIG.DEFAULT_MODEL) {
    this.apiKey = apiKey;
    this.defaultModel = defaultModel;
    this.fallbackModel = AI_CONFIG.FALLBACK_MODEL;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
  }

  /**
   * Core request dispatcher with retry and timeout logic
   */
  async request(endpoint, payload, retries = AI_CONFIG.MAX_RETRIES) {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is missing from environment secrets');
    }

    const url = `${this.baseUrl}/${endpoint}?key=${this.apiKey}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), AI_CONFIG.TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeout);

      const data = await response.json();

      if (!response.ok) {
        // Rate limit or quota error handling
        if (response.status === 429 && retries > 0) {
          await delay(2000);
          return this.request(endpoint, payload, retries - 1);
        }
        // 503 Service Unavailable / temporary overload
        if (response.status === 503 && retries > 0) {
          await delay(1500);
          return this.request(endpoint, payload, retries - 1);
        }

        const msg = data.error?.message || `HTTP ${response.status}`;
        throw new Error(`Gemini API Error: ${sanitizeLogMessage(msg)}`);
      }

      return data;
    } catch (err) {
      clearTimeout(timeout);
      if (retries > 0 && (err.name === 'AbortError' || err.message.includes('network'))) {
        await delay(1500);
        return this.request(endpoint, payload, retries - 1);
      }
      throw new Error(sanitizeLogMessage(err.message));
    }
  }

  /**
   * Generates single-turn text completion
   */
  async generateText(prompt, systemInstruction = '', model = this.defaultModel) {
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        maxOutputTokens: AI_CONFIG.MAX_OUTPUT_TOKENS,
        temperature: AI_CONFIG.TEMPERATURE
      }
    };

    if (systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    try {
      const res = await this.request(`models/${model}:generateContent`, payload);
      return this.extractResponseText(res);
    } catch (err) {
      // If default modern model fails with not found, try fallback
      if (model !== this.fallbackModel && err.message.includes('not found')) {
        return this.generateText(prompt, systemInstruction, this.fallbackModel);
      }
      throw err;
    }
  }

  /**
   * Generates multi-turn chat response
   */
  async generateChat(contents, systemInstruction = '', model = this.defaultModel) {
    const payload = {
      contents,
      generationConfig: {
        maxOutputTokens: AI_CONFIG.MAX_OUTPUT_TOKENS,
        temperature: AI_CONFIG.TEMPERATURE
      }
    };

    if (systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    try {
      const res = await this.request(`models/${model}:generateContent`, payload);
      return this.extractResponseText(res);
    } catch (err) {
      if (model !== this.fallbackModel && err.message.includes('not found')) {
        return this.generateChat(contents, systemInstruction, this.fallbackModel);
      }
      throw err;
    }
  }

  /**
   * Multimodal vision analysis with inline base64 image data
   */
  async analyzeMultimodal(prompt, base64Data, mimeType = 'image/jpeg', model = this.defaultModel) {
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt || 'Analyze this image in detail.' },
            {
              inlineData: {
                mimeType,
                data: base64Data
              }
            }
          ]
        }
      ],
      generationConfig: {
        maxOutputTokens: AI_CONFIG.MAX_OUTPUT_TOKENS,
        temperature: 0.4
      }
    };

    try {
      const res = await this.request(`models/${model}:generateContent`, payload);
      return this.extractResponseText(res);
    } catch (err) {
      if (model !== this.fallbackModel && err.message.includes('not found')) {
        return this.analyzeMultimodal(prompt, base64Data, mimeType, this.fallbackModel);
      }
      throw err;
    }
  }

  /**
   * Extracts text content safely from Gemini response JSON
   */
  extractResponseText(data) {
    if (!data || !data.candidates || data.candidates.length === 0) {
      if (data.promptFeedback?.blockReason) {
        throw new Error(`Content was blocked due to: ${data.promptFeedback.blockReason}`);
      }
      throw new Error('Empty response from AI engine');
    }

    const candidate = data.candidates[0];
    if (candidate.finishReason === 'SAFETY') {
      throw new Error('Response was blocked by safety filters.');
    }

    const parts = candidate.content?.parts;
    if (!parts || parts.length === 0) {
      throw new Error('Response parts are empty');
    }

    return parts.map(p => p.text || '').join('\n').trim();
  }
}
