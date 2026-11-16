# Production Deployment & Configuration Guide

**Target Bot:** [@ShivYogi19_bot](https://t.me/ShivYogi19_bot)  
**Worker Name:** `shiv-yogi-qa-bott`  
**Worker URL:** `https://shiv-yogi-qa-bott.shivyogi-x19.workers.dev`  
**KV Binding:** `BOT_DATA` (`SHIV_YOGI_BOT_DATA`)  

---

## 1. Safety Checklist Before Deployment
- [x] **Zero Production Modification**: No changes have been pushed to Cloudflare production.
- [x] **Preserve Secrets**: `GEMINI_API_KEY`, `TELEGRAM_BOT_TOKEN`, and `WEBHOOK_SECRET` already exist in Cloudflare Worker settings. Never recreate or delete them.
- [x] **Preserve KV Namespace**: `BOT_DATA` binding with ID `55e587063e784c8192292da4f653c7c1` is preserved in `wrangler.toml`.
- [x] **Preserve Webhook**: The Telegram webhook is already pointed to `https://shiv-yogi-qa-bott.shivyogi-x19.workers.dev` with `X-Telegram-Bot-Api-Secret-Token`. Never call `setWebhook` or `deleteWebhook`.

---

## 2. Source Files to Upload to GitHub
Upload the following files and directories to your GitHub repository `shiv-yogi19/SHIV-YOGI-BOT`:

```
src/                       # Complete modular source code
├── index.js               # Canonical Worker entry point (fetch & scheduled)
├── config/                # Constants, config loader, owner resolution
├── storage/               # KV storage, schemas, keys, auto-cleanup, backup
├── security/              # Webhook auth, rate-limiting, dedup, sanitization
├── utilities/             # Safe math evaluator, text chunking, date formatting
├── telegram/              # Telegram API client, keyboards, messages, files
├── ai/                    # Gemini API, chat context, memory, image engine
├── commands/              # All 60 User Commands across 7 categories
├── admin/                 # All 31 Admin Commands, dashboard, moderation
├── core/                  # Router, command registry, feature registry, updates
└── scheduled/             # Cron event handler for automated KV cleanup

tests/                     # 24 Automated unit & integration tests
docs/                      # Commands, features, deployment, admin documentation
scripts/                   # Syntax verification script
package.json               # Project manifest and test runner scripts
wrangler.toml              # Cloudflare Worker configuration
wrangler.toml.example      # Example template
worker.js                  # Root proxy exporting src/index.js
.gitignore                 # Secret and artifact exclusion rules
README.md                  # Project overview
CHANGELOG.md               # Version 5.0.0 release notes
PROJECT_STATE.md           # Implementation verification status
```

---

## 3. Worker Entry Point Architecture
- **Canonical Entry Point:** `src/index.js`
- **Root Entry Point:** `worker.js` (re-exports `src/index.js`)
- `wrangler.toml` references `main = "src/index.js"`.
- This ensures consistency whether deploying directly with Wrangler or through Git integrations.

---

## 4. Configuring OWNER_TELEGRAM_ID
Your primary owner Telegram numeric ID is already configured in `wrangler.toml` and `src/config/owner.js`:
```toml
[vars]
OWNER_TELEGRAM_ID = "8226363418"
OWNER_ID = "8226363418"
```
To change or add additional administrators:
1. In Cloudflare Dashboard: **Workers & Pages** → `shiv-yogi-qa-bott` → **Settings** → **Variables**.
2. Add or edit `OWNER_TELEGRAM_ID` with your numeric ID.
3. Optionally add `ADMIN_IDS` with a comma-separated list of secondary admin IDs (e.g. `12345678,87654321`).

---

## 5. Manual Cron Trigger Setup (KV Auto-Cleanup)
Per specifications, automated Cron Triggers are left unactivated by default. To schedule the automated KV cleanup cycle:

### Method A: Cloudflare Dashboard (Recommended)
1. Go to **Cloudflare Dashboard** → **Workers & Pages** → **shiv-yogi-qa-bott**.
2. Select **Settings** → **Triggers**.
3. Under **Cron Triggers**, click **Add Cron Trigger**.
4. Set the expression:
   ```cron
   0 */6 * * *
   ```
   *(Executes a safe auto-cleanup cycle every 6 hours).*
5. Click **Add Trigger**.

### Method B: Wrangler Configuration
Uncomment the triggers section in `wrangler.toml`:
```toml
[triggers]
crons = ["0 */6 * * *"]
```

---

## 6. How to Verify Webhook Without Resetting
To verify that your worker is healthy and accepting updates without touching the webhook:

1. **Test GET Health Probe:**
   Visit your browser or run:
   ```bash
   curl https://shiv-yogi-qa-bott.shivyogi-x19.workers.dev
   ```
   Expected response:
   ```json
   {
     "status": "online",
     "bot": "@ShivYogi19_bot",
     "name": "Shiv Yogi AI Assistant",
     "version": "5.0.0-PROD",
     "environment": "production"
   }
   ```

2. **Test in Telegram:**
   Open [@ShivYogi19_bot](https://t.me/ShivYogi19_bot) in Telegram:
   - Send `/ping` -> Bot should reply with latency.
   - Send `/start` -> Bot should display welcome message and inline keyboard.
   - Send `/status` -> Bot should report operational health.
   - Send `/admin` (from owner account) -> Bot should open the interactive Admin Dashboard.

---

## 7. Rollback Procedure
If any unexpected issue occurs after deployment:
1. Go to **Cloudflare Dashboard** → **Workers & Pages** → **shiv-yogi-qa-bott**.
2. Navigate to **Deployments**.
3. Select the previous active deployment from the history list.
4. Click **Rollback** to instantly restore the prior production version.
