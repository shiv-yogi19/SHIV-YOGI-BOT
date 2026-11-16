/**
 * SHIV YOGI AI BOT - Constants & Enums
 * Bot Username: @ShivYogi19_bot
 * Worker URL: https://shiv-yogi-qa-bott.shivyogi-x19.workers.dev
 */

export const BOT_IDENTITY = {
  USERNAME: 'ShivYogi19_bot',
  NAME: 'Shiv Yogi AI Assistant',
  LINK: 'https://t.me/ShivYogi19_bot',
  WORKER_NAME: 'shiv-yogi-qa-bott',
  WORKER_URL: 'https://shiv-yogi-qa-bott.shivyogi-x19.workers.dev',
  VERSION: '5.0.0-PROD',
  KV_BINDING: 'BOT_DATA',
  KV_NAMESPACE: 'SHIV_YOGI_BOT_DATA'
};

export const FEATURE_STATUS = {
  AVAILABLE: 'AVAILABLE',
  DISABLED: 'DISABLED',
  PROVIDER_UNAVAILABLE: 'PROVIDER_UNAVAILABLE',
  TEMPORARILY_UNAVAILABLE: 'TEMPORARILY_UNAVAILABLE',
  UNSUPPORTED: 'UNSUPPORTED',
  ERROR: 'ERROR'
};

export const COMMAND_CATEGORIES = {
  GENERAL: 'general',
  AI: 'ai',
  IMAGE: 'image',
  CODING: 'coding',
  WRITING: 'writing',
  FILES: 'files',
  UTILITIES: 'utilities',
  ADMIN: 'admin'
};

export const LANGUAGES = {
  EN: 'en',
  HI: 'hi'
};

export const MESSAGES = {
  IMAGE_UNAVAILABLE: 'अभी Image Generation सेवा उपलब्ध नहीं है। कृपया कुछ समय बाद दोबारा प्रयास करें।',
  IMAGE_UNAVAILABLE_EN: 'Image generation service is currently unavailable. Please try again later.',
  FEATURE_DISABLED_HI: 'यह सुविधा वर्तमान में व्यवस्थापक द्वारा अक्षम की गई है।',
  FEATURE_DISABLED_EN: 'This feature is currently disabled by administrator.',
  RATE_LIMITED_HI: 'आप अनुरोध सीमा पर पहुँच गए हैं। कृपया कुछ क्षण प्रतीक्षा करें।',
  RATE_LIMITED_EN: 'You have reached the request rate limit. Please wait a moment.',
  MAINTENANCE_HI: 'बॉट वर्तमान में रखरखाव (Maintenance) मोड में है। कृपया बाद में प्रयास करें।',
  MAINTENANCE_EN: 'Bot is currently undergoing scheduled maintenance. Please try again later.',
  UNAUTHORIZED_HI: 'यह कमांड केवल व्यवस्थापक (Admin) के लिए आरक्षित है।',
  UNAUTHORIZED_EN: 'This command is restricted to administrators only.',
  SERVICE_UNAVAILABLE_HI: 'अभी यह सेवा उपलब्ध नहीं है। कृपया कुछ समय बाद दोबारा प्रयास करें।',
  SERVICE_UNAVAILABLE_EN: 'This service is currently unavailable. Please try again later.',
  ERROR_GENERIC_HI: 'एक अप्रत्याशित त्रुटि हुई। कृपया थोड़ी देर बाद पुनः प्रयास करें।',
  ERROR_GENERIC_EN: 'An unexpected error occurred. Please try again shortly.'
};

export const TELEGRAM_LIMITS = {
  MAX_MESSAGE_LENGTH: 4096,
  SAFE_CHUNK_LENGTH: 3900,
  MAX_CAPTION_LENGTH: 1024,
  MAX_FILE_DOWNLOAD_BYTES: 15 * 1024 * 1024 // 15MB safe Worker limit
};

export const AI_CONFIG = {
  DEFAULT_MODEL: 'gemini-2.5-flash',
  FALLBACK_MODEL: 'gemini-1.5-flash',
  IMAGEN_MODEL: 'imagen-3.0-generate-002',
  MAX_OUTPUT_TOKENS: 4096,
  TEMPERATURE: 0.7,
  TIMEOUT_MS: 25000,
  MAX_RETRIES: 2,
  MAX_HISTORY_TURNS: 10,
  MAX_MEMORY_FACTS: 30
};

export const RATE_LIMITS = {
  WINDOW_SECONDS: 60,
  DEFAULT_USER_MAX: 30, // 30 req / min
  IMAGE_GEN_HOURLY_MAX: 10,
  ADMIN_MAX: 120
};
