# Changelog

All notable changes to the **Shiv Yogi AI Assistant Bot** (@ShivYogi19_bot) are documented in this file.

---

## [5.0.0-PROD] - 2026-11-16 (Complete Master Rebuild)

### Added
- **Canonical Architecture**:
  - Implemented modular ES module design in `src/` with unified entry point `src/index.js` and proxy `worker.js`.
  - Zero-dependency runtime utilizing native Cloudflare Web APIs and Node built-in testing.
- **60 User Commands**:
  - **General (10)**: `/start`, `/help`, `/about`, `/status`, `/ping`, `/settings`, `/language`, `/profile`, `/feedback`, `/report`.
  - **AI Assistant (12)**: `/ask`, `/chat`, `/newchat`, `/reset`, `/memory`, `/history`, `/export`, `/summarize`, `/translate`, `/explain`, `/rewrite`, `/continue`.
  - **Image & Vision (7)**: `/image`, `/imagine`, `/analyzeimage`, `/describeimage`, `/ocr`, `/imageprompt`, `/imagehelp`.
  - **Coding Tools (8)**: `/code`, `/debug`, `/fixcode`, `/reviewcode`, `/explaincode`, `/formatcode`, `/convertcode`, `/regex`.
  - **Writing Tools (8)**: `/write`, `/email`, `/caption`, `/bio`, `/story`, `/ideas`, `/hashtags`, `/quiz`.
  - **File Tools (7)**: `/file`, `/readfile`, `/pdf`, `/document`, `/extract`, `/convert`, `/fileinfo`.
  - **Utilities (8)**: `/calculate`, `/math`, `/weather`, `/search`, `/define`, `/shorten`, `/remind`, `/todo`.
- **31 Admin Commands**:
  - `/admin`, `/adminhelp`, `/stats`, `/users`, `/user`, `/userinfo`, `/ban`, `/unban`, `/mute`, `/unmute`, `/broadcast`, `/notice`, `/delnotice`, `/maintenance`, `/setmaintenance`, `/features`, `/enablefeature`, `/disablefeature`, `/setlimit`, `/usage`, `/topusers`, `/logs`, `/errors`, `/health`, `/storage`, `/cleanup`, `/backup`, `/restore`, `/settingsadmin`, `/test`, `/announce`.
- **90+ Additional Features**:
  - Contextual multi-turn chat, session branching, personalized memory facts, code-aware message chunking (>4096 chars), inline keyboards, pagination, confirmation modals, rate-limiting, deduplication, audit logging, health probes.
- **Image Generation Engine**:
  - Real capability check against Google Generative Language API.
  - Non-fabricating graceful fallback message: `"अभी Image Generation सेवा उपलब्ध नहीं है। कृपया कुछ समय बाद दोबारा प्रयास करें।"`.
  - Prompt enhancer converting simple concepts into detailed diffusion prompts.
- **Sandbox-Safe Math Evaluator**:
  - Pure Shunting-Yard AST parser evaluating mathematical expressions with zero `eval()` and zero `Function()` constructors.
- **Security & Secret Protection**:
  - Timing-safe `X-Telegram-Bot-Api-Secret-Token` validation.
  - Regex secret masking preventing token and API key leakage in logs.
  - Default-deny admin authorization.
- **Storage & Automation**:
  - Structured KV namespacing (`profile:`, `history:`, `memory:`, `settings:`, `task:`, `ratelimit:`, `backup:`).
  - Safe KV auto-cleanup engine with batch bounds (50 keys).
  - Cloudflare Worker `scheduled()` event handler.
- **Automated Test Suite**:
  - 24 comprehensive unit and integration tests passing with 100% success.
