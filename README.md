# SHIV YOGI BOT

**Telegram:** [@ShivYogi19_bot](https://t.me/ShivYogi19_bot)  
**Creator:** Shiv Yogi  
**Repository:** https://github.com/shiv-yogi19/SHIV-YOGI-BOT

A bilingual Telegram AI assistant project designed for English and Hindi question answering. The intended backend uses Cloudflare Workers, the Telegram Bot API, Google Gemini API, GitHub-hosted JSON content, and Cloudflare KV.

> **Important:** These repository files document configuration and intended behavior. They do not, by themselves, implement a working bot. The Cloudflare Worker backend must implement and test each advertised feature before it is described as live.

## Repository layout

```text
SHIV-YOGI-BOT/
├── README.md
├── about.json
├── bot_info.json
├── commands.json
├── config.json
└── index.html
```

## File responsibilities

| File | Responsibility |
|---|---|
| `bot_info.json` | Project identity, creator profile, architecture, and disclaimers |
| `commands.json` | Bilingual command catalog and access-level documentation |
| `about.json` | About content, 30 terms sections, 11 privacy sections, thank-you text |
| `config.json` | Welcome, language, help, error, fallback, and feature text |
| `index.html` | Static bilingual project information portal |
| `README.md` | Setup notes, architecture, and maintenance guidance |

## Intended message flow

1. Telegram sends an update to the Cloudflare Worker webhook.
2. The Worker validates the webhook secret and parses the update.
3. The Worker checks the sender's Telegram numeric user ID before any admin action.
4. The Worker loads the user's language preference from KV when implemented.
5. Normal text questions are sent to the configured Gemini API only when AI is enabled.
6. The Worker formats the answer and sends it back using the Telegram Bot API.

The initial `/start` message is intended to be English, followed by English/Hindi selection. After selection, user-facing bot messages should follow that language. Normal questions should not require a slash command.

## GitHub raw content URLs

Base URL:

```text
https://raw.githubusercontent.com/shiv-yogi19/SHIV-YOGI-BOT/main
```

Examples:

- `https://raw.githubusercontent.com/shiv-yogi19/SHIV-YOGI-BOT/main/about.json`
- `https://raw.githubusercontent.com/shiv-yogi19/SHIV-YOGI-BOT/main/bot_info.json`
- `https://raw.githubusercontent.com/shiv-yogi19/SHIV-YOGI-BOT/main/commands.json`
- `https://raw.githubusercontent.com/shiv-yogi19/SHIV-YOGI-BOT/main/config.json`

Use the `main` branch. Validate HTTP status, JSON syntax, expected keys, and schema before using fetched content. Do not replace a working cached copy with malformed data.

## Cloudflare Worker configuration

Configure these **Worker Secrets** (never commit their values):

- `TELEGRAM_BOT_TOKEN`
- `GEMINI_API_KEY`
- `WEBHOOK_SECRET`

Configure the KV namespace binding:

| Worker variable | Namespace |
|---|---|
| `BOT_DATA` | `SHIV_YOGI_BOT_DATA` |

The deployed Worker should access the namespace as `env.BOT_DATA`. Do not use `env.BOT_KV`.

The Telegram webhook must be configured with a `secret_token` matching the Worker secret. Rotate any secret that has been exposed. Never paste tokens or secret values into GitHub files, HTML, screenshots, or public chats.

## Administrator authorization

The configured owner Telegram user ID is:

```text
8226363418
```

The Worker must compare this numeric ID against `message.from.id` (or the callback sender's `from.id`) for every privileged action. Do not authorize by username, display name, or chat ID alone. Re-check authorization on every admin callback and command.

## Security and privacy requirements

- Keep API keys, bot tokens, and webhook secrets in Cloudflare Worker Secrets.
- Do not return secret values in `/list`, logs, errors, or backups.
- Validate GitHub JSON before caching.
- Escape Telegram HTML/Markdown output to prevent formatting injection.
- Apply request size limits, timeouts, and rate limits.
- Do not store full message history unless explicitly required, documented, and protected.
- Set KV expiration for data that should expire.
- Never claim a retention period, deletion guarantee, encryption feature, or security certification unless verified in the deployed implementation.
- Do not send sensitive user information to the AI provider.

## Command implementation status

`commands.json` is a command **catalog**, not executable code. The Worker must implement command handlers. In particular, `/stats`, `/reload`, `/list`, `/ai`, `/broadcast`, and `/backup` require backend logic and admin authorization. `/unknown` is an internal fallback and is not an admin command.

## Gemini API notes

Gemini model identifiers and API availability change. Before deployment, verify the current official Gemini API documentation and the models available to the API key. Do not hard-code obsolete model names or assume free, unlimited quota.

## GitHub Pages

To publish `index.html` as a static information page:

1. Open repository **Settings**.
2. Open **Pages**.
3. Select **Deploy from a branch**.
4. Select branch `main` and folder `/ (root)`.
5. Save and wait for the Pages deployment.

The page is informational only. It must never contain API credentials or act as the webhook backend.

## Updating files

1. Edit the relevant JSON or HTML file.
2. Validate JSON files with a JSON parser.
3. Commit the change to the `main` branch.
4. If the Worker has a content cache, run the implemented admin reload action or wait for cache expiry.
5. Verify the bot's displayed content in Telegram.

## Validation checklist

- [ ] All JSON files parse successfully.
- [ ] All repository links use `shiv-yogi19/SHIV-YOGI-BOT`.
- [ ] Worker KV binding is named `BOT_DATA`.
- [ ] No secrets exist in repository files.
- [ ] `/start` greeting is in English and language buttons work.
- [ ] Hindi and English preferences persist as intended.
- [ ] Normal text prompts reach Gemini only when AI is enabled.
- [ ] Every admin action verifies Telegram user ID `8226363418`.
- [ ] Documented commands match actual Worker handlers.
- [ ] Privacy text matches actual storage and retention behavior.
- [ ] Webhook secret validation is enabled and tested.

## Independent project notice

SHIV YOGI BOT is an independent project created by Shiv Yogi. It is not owned, operated, sponsored, endorsed, or officially affiliated with Google, Cloudflare, or Telegram. Product and service names belong to their respective owners.

## Creator

**Created by Shiv Yogi**  
Telegram: [@ShivYogi19_bot](https://t.me/ShivYogi19_bot)  
GitHub: [https://github.com/shiv-yogi19/SHIV-YOGI-BOT](https://github.com/shiv-yogi19/SHIV-YOGI-BOT)
