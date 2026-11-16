/**
 * SHIV YOGI AI BOT - Centralized Feature Registry
 * Tracks 90+ distinct capabilities with state enums, provider requirements,
 * graceful fallback descriptions, and dynamic admin toggle status.
 */

import { FEATURE_STATUS } from '../config/constants.js';

export const FEATURES = {
  // --- AI Experience Features (15) ---
  context_conversations: { id: 'context_conversations', name: 'Contextual Multi-Turn Chat', provider: 'gemini', status: FEATURE_STATUS.AVAILABLE },
  session_branching: { id: 'session_branching', name: 'New Session Branching (/newchat)', provider: 'local', status: FEATURE_STATUS.AVAILABLE },
  response_regeneration: { id: 'response_regeneration', name: 'Response Regeneration', provider: 'gemini', status: FEATURE_STATUS.AVAILABLE },
  response_continuation: { id: 'response_continuation', name: 'Response Continuation (/continue)', provider: 'gemini', status: FEATURE_STATUS.AVAILABLE },
  summarization_engine: { id: 'summarization_engine', name: 'Executive Summarization (/summarize)', provider: 'gemini', status: FEATURE_STATUS.AVAILABLE },
  polyglot_translation: { id: 'polyglot_translation', name: 'Multi-Language Translation (/translate)', provider: 'gemini', status: FEATURE_STATUS.AVAILABLE },
  concept_explanation: { id: 'concept_explanation', name: 'Concept Step-by-Step Explanation (/explain)', provider: 'gemini', status: FEATURE_STATUS.AVAILABLE },
  style_formal: { id: 'style_formal', name: 'Formal Professional Writing Style', provider: 'gemini', status: FEATURE_STATUS.AVAILABLE },
  style_casual: { id: 'style_casual', name: 'Casual Conversational Tone', provider: 'gemini', status: FEATURE_STATUS.AVAILABLE },
  style_creative: { id: 'style_creative', name: 'Creative Imaginative Writing Style', provider: 'gemini', status: FEATURE_STATUS.AVAILABLE },
  style_coding: { id: 'style_coding', name: 'Senior Engineer Coding Mode', provider: 'gemini', status: FEATURE_STATUS.AVAILABLE },
  conversation_history: { id: 'conversation_history', name: 'Bounded History Tracking (7-day TTL)', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  user_memory_storage: { id: 'user_memory_storage', name: 'Personalized Fact Memory (/memory)', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  user_memory_wipe: { id: 'user_memory_wipe', name: 'Personal Memory Clear & Reset', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  history_export: { id: 'history_export', name: 'Chat History Export (/export)', provider: 'local', status: FEATURE_STATUS.AVAILABLE },

  // --- Telegram Experience Features (15) ---
  inline_main_menu: { id: 'inline_main_menu', name: 'Interactive Main Menu Keyboard', provider: 'telegram', status: FEATURE_STATUS.AVAILABLE },
  category_submenus: { id: 'category_submenus', name: 'Categorized Tool Browsing Submenus', provider: 'telegram', status: FEATURE_STATUS.AVAILABLE },
  dynamic_back_navigation: { id: 'dynamic_back_navigation', name: 'One-Tap Back Navigation', provider: 'telegram', status: FEATURE_STATUS.AVAILABLE },
  home_navigation: { id: 'home_navigation', name: 'One-Tap Home Menu Return', provider: 'telegram', status: FEATURE_STATUS.AVAILABLE },
  menu_pagination: { id: 'menu_pagination', name: 'Dynamic Page Navigation with Next/Prev', provider: 'telegram', status: FEATURE_STATUS.AVAILABLE },
  confirmation_dialogs: { id: 'confirmation_dialogs', name: 'Interactive Confirmation Dialogs', provider: 'telegram', status: FEATURE_STATUS.AVAILABLE },
  language_toggle_ui: { id: 'language_toggle_ui', name: 'Interactive Language Switcher', provider: 'telegram', status: FEATURE_STATUS.AVAILABLE },
  settings_inline_editor: { id: 'settings_inline_editor', name: 'In-Chat Settings Controller', provider: 'telegram', status: FEATURE_STATUS.AVAILABLE },
  rich_welcome_banner: { id: 'rich_welcome_banner', name: 'Dynamic Personalized Greeting Banner', provider: 'telegram', status: FEATURE_STATUS.AVAILABLE },
  html_safe_escaping: { id: 'html_safe_escaping', name: 'Telegram HTML Entity Sanitizer', provider: 'local', status: FEATURE_STATUS.AVAILABLE },
  message_length_splitter: { id: 'message_length_splitter', name: 'Code-Aware Message Splitter (>4096)', provider: 'local', status: FEATURE_STATUS.AVAILABLE },
  typing_action_indicator: { id: 'typing_action_indicator', name: 'Real-time Typing Status Indicators', provider: 'telegram', status: FEATURE_STATUS.AVAILABLE },
  upload_photo_indicator: { id: 'upload_photo_indicator', name: 'Upload Photo Status Indicators', provider: 'telegram', status: FEATURE_STATUS.AVAILABLE },
  command_argument_parser: { id: 'command_argument_parser', name: 'Robust Command Argument Parser', provider: 'local', status: FEATURE_STATUS.AVAILABLE },
  graceful_error_feedback: { id: 'graceful_error_feedback', name: 'Localized Friendly Error Dispatcher', provider: 'local', status: FEATURE_STATUS.AVAILABLE },

  // --- User Management Features (10) ---
  user_profile_creation: { id: 'user_profile_creation', name: 'Auto-Provisioning User Profile', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  registration_timestamping: { id: 'registration_timestamping', name: 'User Join Date Tracking', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  last_active_tracking: { id: 'last_active_tracking', name: 'Last Interaction Timestamp Tracking', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  request_counter: { id: 'request_counter', name: 'Lifetime Request Usage Tracking', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  daily_quota_counter: { id: 'daily_quota_counter', name: 'Daily Interaction Counter', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  language_preference_sync: { id: 'language_preference_sync', name: 'Persistent Language Preferences', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  user_ban_enforcement: { id: 'user_ban_enforcement', name: 'User Ban Gatekeeper', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  user_mute_enforcement: { id: 'user_mute_enforcement', name: 'User Temporary Mute System', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  admin_unban_pipeline: { id: 'admin_unban_pipeline', name: 'Instant User Unban Pipeline', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  admin_unmute_pipeline: { id: 'admin_unmute_pipeline', name: 'Instant User Unmute Pipeline', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },

  // --- Image & Vision Tools (10) ---
  text_to_image_gen: { id: 'text_to_image_gen', name: 'Text-to-Image Generation (/image)', provider: 'imagen', status: FEATURE_STATUS.AVAILABLE },
  creative_imagine_flow: { id: 'creative_imagine_flow', name: 'Creative Enhanced Generation (/imagine)', provider: 'imagen', status: FEATURE_STATUS.AVAILABLE },
  prompt_enhancement_engine: { id: 'prompt_enhancement_engine', name: 'Diffusion Prompt Expander (/imageprompt)', provider: 'gemini', status: FEATURE_STATUS.AVAILABLE },
  multimodal_image_analysis: { id: 'multimodal_image_analysis', name: 'Multimodal Vision Analysis (/analyzeimage)', provider: 'gemini', status: FEATURE_STATUS.AVAILABLE },
  image_scene_description: { id: 'image_scene_description', name: 'Vivid Image Scene Description (/describeimage)', provider: 'gemini', status: FEATURE_STATUS.AVAILABLE },
  image_ocr_text_extractor: { id: 'image_ocr_text_extractor', name: 'Visual OCR Text Extraction (/ocr)', provider: 'gemini', status: FEATURE_STATUS.AVAILABLE },
  image_capability_detector: { id: 'image_capability_detector', name: 'Real API Capability Verifier', provider: 'local', status: FEATURE_STATUS.AVAILABLE },
  image_graceful_fallback: { id: 'image_graceful_fallback', name: 'Non-Fabricating Service Fallback', provider: 'local', status: FEATURE_STATUS.AVAILABLE },
  image_rate_limiter: { id: 'image_rate_limiter', name: 'Image Quota Limiter', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  image_guide_system: { id: 'image_guide_system', name: 'Image Prompt Guide (/imagehelp)', provider: 'local', status: FEATURE_STATUS.AVAILABLE },

  // --- File & Document Tools (10) ---
  pdf_text_extraction: { id: 'pdf_text_extraction', name: 'PDF Multimodal Inspector (/pdf)', provider: 'gemini', status: FEATURE_STATUS.AVAILABLE },
  document_text_reader: { id: 'document_text_reader', name: 'Source Document Reader (/readfile)', provider: 'telegram', status: FEATURE_STATUS.AVAILABLE },
  document_metrics_inspector: { id: 'document_metrics_inspector', name: 'Word & Line Count Inspector (/document)', provider: 'local', status: FEATURE_STATUS.AVAILABLE },
  file_metadata_inspector: { id: 'file_metadata_inspector', name: 'Technical File Info Inspector (/fileinfo)', provider: 'telegram', status: FEATURE_STATUS.AVAILABLE },
  entity_regex_extractor: { id: 'entity_regex_extractor', name: 'Email, URL & IP Extractor (/extract)', provider: 'local', status: FEATURE_STATUS.AVAILABLE },
  format_converter: { id: 'format_converter', name: 'Text to JSON/CSV Converter (/convert)', provider: 'gemini', status: FEATURE_STATUS.AVAILABLE },
  file_size_guard: { id: 'file_size_guard', name: 'Worker Memory Size Guard (15MB)', provider: 'local', status: FEATURE_STATUS.AVAILABLE },
  mime_whitelist_validator: { id: 'mime_whitelist_validator', name: 'Strict MIME Whitelist Validator', provider: 'local', status: FEATURE_STATUS.AVAILABLE },
  file_tools_guide: { id: 'file_tools_guide', name: 'File Tools Interactive Guide (/file)', provider: 'local', status: FEATURE_STATUS.AVAILABLE },
  safe_untrusted_file_boundary: { id: 'safe_untrusted_file_boundary', name: 'Untrusted Content Execution Sandbox', provider: 'local', status: FEATURE_STATUS.AVAILABLE },

  // --- Admin & Operations Tools (15) ---
  admin_dashboard_ui: { id: 'admin_dashboard_ui', name: 'Interactive Admin Dashboard (/admin)', provider: 'local', status: FEATURE_STATUS.AVAILABLE },
  admin_command_guide: { id: 'admin_command_guide', name: 'Admin Command Guide (/adminhelp)', provider: 'local', status: FEATURE_STATUS.AVAILABLE },
  batched_broadcast_engine: { id: 'batched_broadcast_engine', name: 'Safe Batched Broadcast (/broadcast)', provider: 'telegram', status: FEATURE_STATUS.AVAILABLE },
  urgent_announcement_system: { id: 'urgent_announcement_system', name: 'Urgent System Announce (/announce)', provider: 'telegram', status: FEATURE_STATUS.AVAILABLE },
  system_notice_banner: { id: 'system_notice_banner', name: 'Global Notice Banner Injector (/notice)', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  notice_deletion_handler: { id: 'notice_deletion_handler', name: 'Instant Notice Deletion (/delnotice)', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  maintenance_mode_controller: { id: 'maintenance_mode_controller', name: 'Maintenance Mode Controller (/setmaintenance)', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  maintenance_admin_bypass: { id: 'maintenance_admin_bypass', name: 'Admin Maintenance Bypass Guard', provider: 'local', status: FEATURE_STATUS.AVAILABLE },
  feature_toggle_engine: { id: 'feature_toggle_engine', name: 'Dynamic Feature Switcher (/features)', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  granular_rate_limiter_config: { id: 'granular_rate_limiter_config', name: 'Rate Limit Threshold Config (/setlimit)', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  system_health_prober: { id: 'system_health_prober', name: 'Live Edge & KV Health Probe (/health)', provider: 'local', status: FEATURE_STATUS.AVAILABLE },
  admin_action_audit_logger: { id: 'admin_action_audit_logger', name: 'Admin Action Audit Logger (/logs)', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  security_error_logger: { id: 'security_error_logger', name: 'Security Event & Error Log (/errors)', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  storage_metrics_inspector: { id: 'storage_metrics_inspector', name: 'KV Namespace Metrics (/storage)', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  snapshot_backup_engine: { id: 'snapshot_backup_engine', name: 'Config Snapshot Backup (/backup, /restore)', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },

  // --- Security & Reliability Features (15) ---
  webhook_secret_auth: { id: 'webhook_secret_auth', name: 'Timing-Safe Webhook Secret Validation', provider: 'local', status: FEATURE_STATUS.AVAILABLE },
  sliding_window_rate_limiter: { id: 'sliding_window_rate_limiter', name: 'Sliding Window Rate Limiter (60s)', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  update_deduplication: { id: 'update_deduplication', name: 'Telegram Update Deduplication (180s)', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  secret_leak_protection: { id: 'secret_leak_protection', name: 'Regex-Based Secret Masking in Logs', provider: 'local', status: FEATURE_STATUS.AVAILABLE },
  admin_authorization_guard: { id: 'admin_authorization_guard', name: 'Default-Deny Admin Authorization', provider: 'local', status: FEATURE_STATUS.AVAILABLE },
  callback_ownership_verification: { id: 'callback_ownership_verification', name: 'Callback Query Tamper Protection', provider: 'local', status: FEATURE_STATUS.AVAILABLE },
  safe_timeout_controller: { id: 'safe_timeout_controller', name: 'AbortController Request Timeouts', provider: 'local', status: FEATURE_STATUS.AVAILABLE },
  transient_backoff_retry: { id: 'transient_backoff_retry', name: 'Exponential Backoff on 429/503', provider: 'local', status: FEATURE_STATUS.AVAILABLE },
  untrusted_prompt_isolation: { id: 'untrusted_prompt_isolation', name: 'Prompt Injection Boundary Separation', provider: 'local', status: FEATURE_STATUS.AVAILABLE },
  safe_json_parser_boundary: { id: 'safe_json_parser_boundary', name: 'Safe JSON Parsing with Fallback', provider: 'local', status: FEATURE_STATUS.AVAILABLE },
  pure_math_evaluator_sandbox: { id: 'pure_math_evaluator_sandbox', name: 'Zero-eval Math AST Evaluator (/calculate)', provider: 'local', status: FEATURE_STATUS.AVAILABLE },
  user_isolation_boundary: { id: 'user_isolation_boundary', name: 'Cross-User Memory & History Isolation', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  non_destructive_storage_policy: { id: 'non_destructive_storage_policy', name: 'Non-Destructive KV Read/Write Guard', provider: 'local', status: FEATURE_STATUS.AVAILABLE },
  input_length_clamp: { id: 'input_length_clamp', name: 'Safe Input Length Truncation Guard', provider: 'local', status: FEATURE_STATUS.AVAILABLE },
  error_boundary_wrapper: { id: 'error_boundary_wrapper', name: 'Top-Level Edge Unhandled Exception Catcher', provider: 'local', status: FEATURE_STATUS.AVAILABLE },

  // --- Automation & Storage (10) ---
  kv_auto_cleanup_engine: { id: 'kv_auto_cleanup_engine', name: 'Safe KV Auto-Cleanup (/cleanup)', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  worker_scheduled_handler: { id: 'worker_scheduled_handler', name: 'Scheduled Cron Event Handler', provider: 'cloudflare', status: FEATURE_STATUS.AVAILABLE },
  batch_bounded_cleanup: { id: 'batch_bounded_cleanup', name: 'Bounded Max 50 Keys Cleanup Batches', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  dedup_ttl_auto_purge: { id: 'dedup_ttl_auto_purge', name: 'Auto-Purge Expired Dedup Tokens', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  task_metadata_auto_purge: { id: 'task_metadata_auto_purge', name: 'Auto-Purge Expired Tasks (>24h)', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  ratelimit_auto_purge: { id: 'ratelimit_auto_purge', name: 'Auto-Purge Stale Rate Limit Windows', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  cleanup_audit_reporter: { id: 'cleanup_audit_reporter', name: 'KV Cleanup Execution Metrics Logging', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  user_todo_manager: { id: 'user_todo_manager', name: 'Persistent To-Do List Engine (/todo)', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  user_reminder_manager: { id: 'user_reminder_manager', name: 'Persistent Reminder Engine (/remind)', provider: 'kv', status: FEATURE_STATUS.AVAILABLE },
  user_feedback_collector: { id: 'user_feedback_collector', name: 'Central User Feedback Ledger (/feedback)', provider: 'kv', status: FEATURE_STATUS.AVAILABLE }
};

export function isFeatureEnabled(featureId, adminConfig = {}) {
  const feat = FEATURES[featureId];
  if (!feat) return true;
  if (adminConfig.featureFlags && adminConfig.featureFlags[featureId] === false) {
    return false;
  }
  return feat.status === FEATURE_STATUS.AVAILABLE;
}

export function getTotalFeaturesCount() {
  return Object.keys(FEATURES).length;
}
