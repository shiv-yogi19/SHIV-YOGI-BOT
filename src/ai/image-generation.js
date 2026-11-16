/**
 * SHIV YOGI AI BOT - Modular Image Generation Engine
 * 
 * Supports text-to-image generation via Google Imagen 3 / Generative Language API
 * with strict capability verification, graceful failure fallback, and prompt enhancement.
 * NEVER returns fake images or fabricates success responses.
 */

import { AI_CONFIG, MESSAGES } from '../config/constants.js';
import { sanitizeLogMessage } from '../security/sanitization.js';

export class ImageGenerationEngine {
  constructor(env) {
    this.env = env;
    this.apiKey = env?.GEMINI_API_KEY;
    this.model = env?.IMAGEN_MODEL || AI_CONFIG.IMAGEN_MODEL;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
  }

  /**
   * Enhances a simple prompt idea into a vivid, descriptive prompt using Gemini
   * @param {string} prompt 
   * @param {GeminiClient} geminiClient 
   * @returns {Promise<string>}
   */
  async enhancePrompt(prompt, geminiClient) {
    if (!prompt) return '';
    const enhancementInstruction =
      'You are an expert prompt engineer for text-to-image models like Imagen 3. ' +
      'Given an idea, expand it into a detailed, visually vivid prompt specifying lighting, ' +
      'camera angle, artistic style, texture, and composition. Output ONLY the expanded prompt, nothing else.';
    try {
      const expanded = await geminiClient.generateText(prompt, enhancementInstruction);
      return expanded.trim();
    } catch {
      return prompt; // Fallback to original
    }
  }

  /**
   * Attempts image generation using Google Generative Language API
   * @param {string} prompt 
   * @param {object} [options={}] 
   * @returns {Promise<{ success: boolean, imageBuffer?: ArrayBuffer, base64?: string, unavailable?: boolean, message?: string }>}
   */
  async generate(prompt, options = {}) {
    if (!this.apiKey) {
      return {
        success: false,
        unavailable: true,
        message: MESSAGES.IMAGE_UNAVAILABLE
      };
    }

    if (!prompt || String(prompt).trim() === '') {
      return {
        success: false,
        message: 'कृपया इमेज बनाने के लिए विवरण (प्रॉम्प्ट / Prompt) प्रदान करें।\nExample: /image A serene mountain at sunrise in oil painting style'
      };
    }

    const url = `${this.baseUrl}/models/${this.model}:predict?key=${this.apiKey}`;
    const payload = {
      instances: [
        {
          prompt: String(prompt).trim()
        }
      ],
      parameters: {
        sampleCount: 1,
        aspectRatio: options.aspectRatio || '1:1',
        outputOptions: {
          mimeType: 'image/jpeg'
        }
      }
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 35000);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeout);

      // If model not found (404), access denied (403), or method not supported (400)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.error?.message || `HTTP ${response.status}`;
        console.warn(`Imagen API check failed (${response.status}):`, sanitizeLogMessage(errorMsg));

        return {
          success: false,
          unavailable: true,
          message: MESSAGES.IMAGE_UNAVAILABLE
        };
      }

      const data = await response.json();
      const prediction = data.predictions?.[0];
      const base64Data = prediction?.bytesBase64Encoded;

      if (!base64Data) {
        return {
          success: false,
          unavailable: true,
          message: MESSAGES.IMAGE_UNAVAILABLE
        };
      }

      return {
        success: true,
        base64: base64Data,
        mimeType: 'image/jpeg'
      };
    } catch (err) {
      clearTimeout(timeout);
      console.warn('Image Generation Request Exception:', sanitizeLogMessage(err.message));
      return {
        success: false,
        unavailable: true,
        message: MESSAGES.IMAGE_UNAVAILABLE
      };
    }
  }

  /**
   * Returns helpful instructions for image tools
   */
  getImageHelp() {
    return (
      `🎨 <b>Image & Vision Assistance Guide</b>\n\n` +
      `<b>Available Commands:</b>\n` +
      `• <code>/image &lt;prompt&gt;</code> - Generate an image from a descriptive prompt.\n` +
      `• <code>/imagine &lt;prompt&gt;</code> - Generate an image with automatic prompt enhancement.\n` +
      `• <code>/analyzeimage</code> - Reply to any photo to get a detailed AI analysis.\n` +
      `• <code>/describeimage</code> - Reply to a photo to describe its visual breakdown.\n` +
      `• <code>/ocr</code> - Reply to an image to extract all legible text.\n` +
      `• <code>/imageprompt &lt;idea&gt;</code> - Convert simple ideas into cinematic prompts.\n\n` +
      `💡 <i>Tip: For best image generation results, specify style, lighting, and composition (e.g. "cinematic 35mm photograph", "cyberpunk neon lighting", "watercolor painting").</i>`
    );
  }
}
