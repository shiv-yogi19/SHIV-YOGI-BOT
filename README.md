# Shiv Yogi AI Bot (@ShivYogi19_bot)

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini%202.5-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Telegram Bot API](https://img.shields.io/badge/Telegram-Bot%20API-2CA5E0?logo=telegram&logoColor=white)](https://core.telegram.org/bots/api)
[![Version](https://img.shields.io/badge/Version-5.0.0--PROD-success)](#)
[![Tests](https://img.shields.io/badge/Tests-24%2F24%20Passing-brightgreen)](#)

A high-performance, modular, and production-ready Telegram AI assistant powered by **Google Gemini** and hosted on **Cloudflare Workers**. Built for speed, multi-turn context retention, personalized memory, vision analysis, coding assistance, and comprehensive system administration.

---

## 🌟 Key Capabilities

- 🤖 **Multi-Turn Conversational AI:** Retains conversation context with personalized memory and 7-day TTL history retention.
- 🎨 **Image & Vision Suite:** Text-to-image generation via Google Imagen with capability verification, plus multimodal vision analysis, scene descriptions, and visual OCR.
- 💻 **Coding Assistant:** Code generation, peer review, bug fixing, formatting, language conversion, and regex explanation across Python, JavaScript, TypeScript, C++, and more.
- ✍️ **Writing Assistant:** Articles, emails, social captions, profile bios, stories, brainstorming, viral hashtags, and interactive quizzes in Hindi and English.
- 📁 **Document Processing:** PDF text extraction, document metrics inspector, technical metadata, entity extraction (emails, URLs, IPs), and data conversion.
- ⚡ **Utilities:** Sandbox-safe mathematical expression evaluator (zero `eval()`), step-by-step math solver, real-time global weather, web search summaries, dictionary definitions, URL shortening, to-do lists, and reminders.
- 🛡️ **Interactive Admin Suite:** 31 administration commands, real-time inline dashboard, user moderation (ban/mute/unban), batched broadcasts, system notices, maintenance mode, KV auto-cleanup, and snapshot backups.

---

## 📊 Command Architecture (91 Total Commands)

```
                            @ShivYogi19_bot
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         │                                                   │
  60 User Commands                                   31 Admin Commands
  ├── General (10)                                   ├── Dashboard & Stats (5)
  ├── AI Assistant (12)                              ├── User Moderation (7)
  ├── Image & Vision (7)                             ├── Broadcast & Notices (4)
  ├── Coding Tools (8)                               ├── System Controls (7)
  ├── Writing Tools (8)                              ├── Storage & Cleanup (4)
  ├── File Tools (7)                                 └── Diagnostics & Tests (4)
  └── Utilities (8)
```

For complete syntax and examples, see [docs/COMMANDS.md](file:///data/user/0/com.termux/files/home/projects/SHIV-YOGI-BOT/docs/COMMANDS.md).

---

## 📁 Repository Structure

```
.
├── src/
│   ├── index.js               # Canonical Worker entry point (fetch & scheduled)
│   ├── config/
│   │   ├── config.js          # Centralized configuration loader
│   │   ├── constants.js       # Bot identity, status enums, limits, messages
│   │   └── owner.js           # Owner resolution & default-deny authorization
│   ├── storage/
│   │   ├── kv.js              # Centralized KV client with entity helpers
│   │   ├── keys.js            # Standardized key prefixes
│   │   ├── schemas.js         # Default schemas for profiles, settings, notices
│   │   ├── cleanup.js         # Safe KV Auto-Cleanup engine (batch bounded)
│   │   └── backup.js          # Point-in-time configuration snapshot & restore
│   ├── security/
│   │   ├── webhook-auth.js    # Timing-safe X-Telegram-Bot-Api-Secret-Token validation
│   │   ├── rate-limit.js      # Sliding-window rate limiter per user
│   │   ├── deduplication.js   # Telegram update retry deduplication
│   │   ├── validation.js      # Input length bounds & MIME whitelist
│   │   └── sanitization.js    # HTML escaping & log secret masking
│   ├── utilities/
│   │   ├── helpers.js         # Pure Shunting-Yard AST math evaluator (zero eval)
│   │   ├── text.js            # Code-aware message splitter (>4096 chars)
│   │   ├── dates.js           # Indian Standard Time (IST) formatting
│   │   └── ids.js             # UUID generator
│   ├── telegram/
│   │   ├── client.js          # Telegram Bot API HTTP client with retries
│   │   ├── keyboards.js       # Inline menu keyboards, pagination, settings
│   │   ├── messages.js        # Standardized messages & notice banner injector
│   │   ├── formatting.js      # Telegram HTML tag formatting helpers
│   │   └── files.js           # Safe file downloading & base64 conversion
│   ├── ai/
│   │   ├── gemini.js          # Google Gemini Generative Language REST client
│   │   ├── chat.js            # Context-aware multi-turn chat builder
│   │   ├── sessions.js        # Session lifecycle & history export
│   │   ├── memory.js          # Personalized fact memory persistence
│   │   └── image-generation.js# Google Imagen engine with capability check
│   ├── commands/              # Handlers for all 60 User Commands
│   ├── admin/                 # Handlers for all 31 Admin Commands & Dashboard
│   ├── core/
│   │   ├── router.js          # Message & command routing engine
│   │   ├── command-registry.js# Centralized command map (91 commands)
│   │   ├── feature-registry.js# 90+ features registry with state enums
│   │   ├── update-handler.js  # Main Telegram webhook update pipeline
│   │   ├── callback-handler.js# Secure callback query processor
│   │   └── error-handler.js   # Top-level error boundary with secret redaction
│   └── scheduled/
│       └── handler.js         # Cloudflare Worker scheduled event handler
├── tests/                     # 24 Automated unit & integration tests
├── docs/                      # Comprehensive technical documentation
├── scripts/                   # Code quality & syntax audit scripts
├── worker.js                  # Root proxy exporting src/index.js
├── wrangler.toml              # Preserved Cloudflare configuration
└── package.json               # Scripts & metadata
```

---

## 🔒 Security Architecture

1. **Timing-Safe Webhook Validation:** Incoming requests must present the secret token matching `env.WEBHOOK_SECRET` via constant-time comparison.
2. **Default-Deny Admin Guard:** Admin features are strictly locked to `OWNER_TELEGRAM_ID`.
3. **Secret Redaction:** Bot tokens, Gemini API keys, and authorization headers are dynamically masked in logs.
4. **Untrusted Code Execution Sandbox:** User code snippets are analyzed via AI and never executed inside the Worker runtime.
5. **Safe Mathematical Evaluation:** Math queries are parsed using a tokenized Shunting-Yard AST evaluator without `eval()` or `Function()`.
6. **Rate Limiting & Deduplication:** Per-user sliding-window rate limiting and update deduplication protect KV and downstream APIs.

---

## 🧪 Testing & Code Quality

Run the complete automated test suite:
```bash
npm test
```
*Executes all 24 unit and integration test suites testing security, KV isolation, command routing, Gemini client, image fallbacks, and scheduled handlers.*

Run strict syntax verification:
```bash
npm run check
```
*Validates 100% of all JavaScript source files using `node --check`.*

---

## 🚀 Deployment

The project is pre-configured to work seamlessly with your existing Cloudflare Worker:
- **Worker Name:** `shiv-yogi-qa-bott`
- **KV Binding:** `BOT_DATA` (`id: 55e587063e784c8192292da4f653c7c1`)
- **Compatibility Date:** `2024-09-23`

Refer to [docs/DEPLOYMENT.md](file:///data/user/0/com.termux/files/home/projects/SHIV-YOGI-BOT/docs/DEPLOYMENT.md) for full step-by-step instructions.

---

## 📄 License

This project is licensed under the MIT License.
