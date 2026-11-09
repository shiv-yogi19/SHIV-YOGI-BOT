# ⚡ SHIV YOGI BOT (@ShivYogi19_bot)

[![Telegram Bot](https://img.shields.io/badge/Telegram-@ShivYogi19__bot-229ED9?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/ShivYogi19_bot)
[![AI Engine](https://img.shields.io/badge/AI_Engine-Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Serverless](https://img.shields.io/badge/Edge_Runtime-Cloudflare_Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Languages](https://img.shields.io/badge/Languages-English_%7C_हिन्दी-10B981?style=for-the-badge)](https://github.com/SHIV-YOGI-BOT/SHIV-YOGI-BOT)
[![JSON Validated](https://img.shields.io/badge/JSON-100%25_Valid-success?style=for-the-badge)](https://github.com/SHIV-YOGI-BOT/SHIV-YOGI-BOT)

Welcome to the official repository content for **SHIV YOGI BOT**, an intelligent, bilingual conversational AI chatbot on Telegram conceived and built by **Shiv Yogi**. Powered by the **Google Gemini Large Language Model (API)** and deployed at the edge with **Cloudflare Workers**, SHIV YOGI BOT delivers rapid, contextual answers in both English and pure Devanagari Hindi.

This repository serves as the **Single Source of Truth** for bot metadata, command documentation, multilingual configurations, policies, and the public web portal.

---

## 📂 Repository File Directory

```
SHIV-YOGI-BOT/
├── index.html       # Responsive, premium bilingual website & documentation portal
├── about.json       # In-depth About, 30 Terms & Conditions, 11 Privacy Policies, Thank-You
├── bot_info.json    # Bot identity, creator profile, architecture & important disclaimers
├── commands.json    # Full catalog of 12 user commands and 8 admin commands (Bilingual)
├── config.json      # Bilingual welcome, help, error, fallback messages & feature config
└── README.md        # Technical architecture, integration guide, and deployment instructions
```

---

## 📖 File-by-File Breakdown

### 1. `bot_info.json`
- **Purpose**: Authoritative identity manifest and system metadata.
- **Contents**:
  - Bot handle: `@ShivYogi19_bot` ([https://t.me/ShivYogi19_bot](https://t.me/ShivYogi19_bot))
  - Creator: **Shiv Yogi** (Founder & Lead Developer)
  - AI Engine: **Google Gemini API** (with explicit independent attribution)
  - Edge Platform: **Cloudflare Workers**
  - Supported Languages: English (`en`) and Hindi (`hi`)
  - Important disclaimers concerning AI accuracy and independent operation.

### 2. `commands.json`
- **Purpose**: Bilingual command specifications and interface contracts.
- **Includes 20 documented commands**:
  - **12 User Commands**: `/start`, `/help`, `/about`, `/creator`, `/features`, `/terms`, `/privacy`, `/language`, `/commands`, `/contact`, `/feedback`, `/cancel`
  - **8 Admin Commands**: `/admin`, `/stats`, `/reload`, `/list`, `/ai`, `/broadcast`, `/backup`, `/unknown`
- **Specification Notice**: Documenting commands defines interface documentation for users and web portals; runtime execution is handled within the Cloudflare Worker webhook handler.

### 3. `about.json`
- **Purpose**: Deep informational knowledge base and legal compliance documentation.
- **Contents**:
  - **12 About Sections**: Bot introduction, creation purpose, user capabilities, AI QA pipeline, Google Gemini integration details, GitHub decoupled content sync, bilingual system design, Telegram UI, administrative AI model switching, roadmap, responsible AI consumption, and creator profile.
  - **30 Terms and Conditions Sections**: Comprehensive terms covering acceptance, service description, AI hallucination warnings, user duties, prohibited & illegal activities, rate limits, API quotas, liability limitations, termination, governing law, and severability.
  - **11 Privacy Policy Sections**: Detailed breakdown of Telegram identifiers, session memory, Google Gemini data transmission, Cloudflare edge execution, sensitive data warnings, and contact rights.
  - **Thank-You Section**: Dedicated message of appreciation from creator Shiv Yogi.

### 4. `config.json`
- **Purpose**: Live dynamic user strings, dialogues, and system responses.
- **Contents**:
  - **Initial Unselected Greeting**: English initial welcome with language selection callback buttons.
  - **Bilingual Welcome Content**: Full greetings tailored to the chosen language.
  - **Comprehensive Help Guides**: Instructions on formulating questions and navigating the bot.
  - **Error & Fallback Handling**: Standardized bilingual messages for rate limits, API outages, invalid inputs, and administrative access restrictions.
  - **Public Features & Branding**: Feature cards and official repository/portal links.

### 5. `index.html`
- **Purpose**: Production-ready, client-facing informational website and documentation portal.
- **Design Highlights**:
  - Modern dark-mode interface with glassmorphic navbar and glowing card accents.
  - **Instant English / हिन्दी Language Switcher** with local persistence.
  - Interactive Command Filter (`All`, `User`, `Admin`).
  - Collapsible **Accordion for all 30 Terms & Conditions** with Expand/Collapse All controls.
  - Complete Privacy Policy cards and Creator Profile showcase.
  - Zero exposed API secrets, zero external trackers, lightweight and mobile-first responsive.
  - Ready for GitHub Pages deployment.

---

## 🌐 Language Workflow & Rule Architecture

SHIV YOGI BOT strictly enforces language consistency:
1. **Initial Greeting**: When a user first sends `/start`, the bot greets the user in English and provides inline keyboard buttons (`🇬🇧 English` | `🇮🇳 हिन्दी`).
2. **Language Persistence**: Upon tapping a button, the user's preference is saved in the session store.
3. **No Language Mixing**:
   - If **English** is selected, all subsequent menus, explanations, error messages, and AI outputs are rendered in English.
   - If **Hindi** is selected, all communications are rendered in natural, readable **Devanagari Hindi** (not Roman Hindi).
4. **Dynamic Switching**: The user can switch languages at any time using `/language`.

---

## ⚡ Cloudflare Worker Integration Pattern

Your Cloudflare Worker backend can fetch and cache content dynamically from this repository:

```javascript
// Example Cloudflare Worker dynamic sync helper
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/SHIV-YOGI-BOT/SHIV-YOGI-BOT/main";

async function fetchRepoConfig(fileName, env) {
  // Check Cloudflare KV cache first
  const cached = await env.BOT_KV.get(`content:${fileName}`, "json");
  if (cached) return cached;

  // Fetch live from GitHub
  const response = await fetch(`${GITHUB_RAW_BASE}/${fileName}`);
  if (!response.ok) throw new Error(`Failed to load ${fileName} from GitHub`);
  
  const data = await response.json();
  // Cache in KV for 1 hour (3600 seconds)
  await env.BOT_KV.put(`content:${fileName}`, JSON.stringify(data), { expirationTtl: 3600 });
  return data;
}

// In your webhook handler for /about, /terms, /help, etc.:
// const config = await fetchRepoConfig("config.json", env);
// const about = await fetchRepoConfig("about.json", env);
```

When an administrator runs `/reload`, the worker purges the KV cache keys, pulling fresh copies immediately from GitHub without redeploying the worker!

---

## 🚀 How to Upload Files to GitHub

### Method A: Using Git CLI (Recommended)

1. Open your terminal in the `SHIV-YOGI-BOT` folder:
   ```bash
   cd /path/to/SHIV-YOGI-BOT
   ```

2. Initialize a git repository:
   ```bash
   git init
   git branch -M main
   ```

3. Add your remote GitHub repository:
   ```bash
   git remote add origin https://github.com/SHIV-YOGI-BOT/SHIV-YOGI-BOT.git
   ```

4. Stage and commit all files:
   ```bash
   git add .
   git commit -m "feat: complete production-ready bilingual content, documentation, and web portal"
   ```

5. Push to GitHub:
   ```bash
   git push -u origin main
   ```

---

### Method B: Uploading via GitHub Web Interface

1. Navigate to your repository: [https://github.com/SHIV-YOGI-BOT/SHIV-YOGI-BOT](https://github.com/SHIV-YOGI-BOT/SHIV-YOGI-BOT)
2. Click on **Add file** -> **Upload files**.
3. Drag and drop all five files:
   - `index.html`
   - `about.json`
   - `bot_info.json`
   - `commands.json`
   - `config.json`
   - `README.md`
4. Enter commit message: `Initial commit: SHIV YOGI BOT repository content`
5. Click **Commit changes**.

---

### Method C: Enabling GitHub Pages (Free Web Hosting for `index.html`)

1. Go to your GitHub repository **Settings**.
2. In the left sidebar, click on **Pages**.
3. Under **Branch**, select `main` and folder `/ (root)`.
4. Click **Save**.
5. Your bilingual portal will be live at:
   `https://<your-username>.github.io/SHIV-YOGI-BOT/`

---

## 🛡️ Responsible AI & Attribution Notice

- **Independent Tool**: SHIV YOGI BOT is an independent community project by **Shiv Yogi**. It is not officially owned, endorsed, sponsored, or affiliated with Google LLC, Cloudflare, Inc., or Telegram Messenger Inc.
- **AI Verification**: Outputs are generated by Google Gemini AI and may occasionally contain inaccuracies. Users should verify critical medical, legal, or financial information independently.

---

## 👨‍💻 Creator & Acknowledgements

Created with dedication and passion by **Shiv Yogi**.
- **Telegram Bot**: [@ShivYogi19_bot](https://t.me/ShivYogi19_bot)
- **Repository**: [SHIV-YOGI-BOT](https://github.com/SHIV-YOGI-BOT/SHIV-YOGI-BOT)

*"Technology shines brightest when it serves curiosity and empowers people."*
