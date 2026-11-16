/**
 * SHIV YOGI AI BOT - Gemini Client & Image Generation Capability Tests
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { GeminiClient } from '../src/ai/gemini.js';
import { ImageGenerationEngine } from '../src/ai/image-generation.js';
import { MESSAGES } from '../src/config/constants.js';

test('Gemini Client Response Parsing and Error Extraction', () => {
  const gemini = new GeminiClient('dummy_key');

  // Successful candidate parse
  const mockPayload = {
    candidates: [
      {
        content: {
          parts: [{ text: 'Hello! I am ready to help.' }]
        }
      }
    ]
  };
  const extracted = gemini.extractResponseText(mockPayload);
  assert.equal(extracted, 'Hello! I am ready to help.');

  // Safety block detection
  const blockedPayload = {
    candidates: [{ finishReason: 'SAFETY' }]
  };
  assert.throws(() => gemini.extractResponseText(blockedPayload), /safety filters/);

  // Empty response detection
  assert.throws(() => gemini.extractResponseText({ candidates: [] }), /Empty response/);
});

test('Image Engine Real Capability Check & Graceful Fallback Message', async () => {
  // Test when API key is missing
  const engineNoKey = new ImageGenerationEngine({});
  const resNoKey = await engineNoKey.generate('A cat in a hat');
  assert.equal(resNoKey.success, false);
  assert.equal(resNoKey.unavailable, true);
  assert.equal(resNoKey.message, MESSAGES.IMAGE_UNAVAILABLE);

  // Test empty prompt validation
  const engineWithKey = new ImageGenerationEngine({ GEMINI_API_KEY: 'test_key' });
  const emptyRes = await engineWithKey.generate('');
  assert.equal(emptyRes.success, false);
  assert.ok(emptyRes.message.includes('प्रॉम्प्ट'));

  // Test image help guide contains expected instructions
  const helpText = engineWithKey.getImageHelp();
  assert.ok(helpText.includes('/image'));
  assert.ok(helpText.includes('/imagine'));
  assert.ok(helpText.includes('/ocr'));
});
