# Complete Command Directory: @ShivYogi19_bot

Total Commands: **91 Commands** (60 User Commands + 31 Admin Commands)

---

## 1. User Commands (60 Commands)

### A. General Commands (10)
| Command | Syntax | Description | Example |
| :--- | :--- | :--- | :--- |
| `/start` | `/start` | Welcome greeting, provisions user profile, opens main interactive inline keyboard | `/start` |
| `/help` | `/help` | Displays categorized help directory with navigation buttons | `/help` |
| `/about` | `/about` | Displays bot details, creator (Shiv Yogi), version, Cloudflare Worker architecture & AI engine | `/about` |
| `/status` | `/status` | Shows system operational state, edge status, and maintenance mode | `/status` |
| `/ping` | `/ping` | Tests round-trip latency to the Cloudflare Worker | `/ping` |
| `/settings` | `/settings` | Opens personal preferences menu (language, AI style, memory toggle) | `/settings` |
| `/language` | `/language [hi\|en]` | Switches response language between Hindi and English | `/language hi` |
| `/profile` | `/profile` | Shows user profile details, total requests, registration date, and statistics | `/profile` |
| `/feedback` | `/feedback <text>` | Submits user feedback directly to the administrator ledger | `/feedback Great bot!` |
| `/report` | `/report <text>` | Reports an issue, bug, or problem for admin review | `/report /weather error` |

### B. AI Commands (12)
| Command | Syntax | Description | Example |
| :--- | :--- | :--- | :--- |
| `/ask` | `/ask <question>` | Direct single-turn question to Gemini AI | `/ask Explain relativity` |
| `/chat` | `/chat <message>` | Multi-turn conversational chat with context awareness | `/chat Help me plan a trip` |
| `/newchat` | `/newchat` | Clears active context and starts a fresh conversation session | `/newchat` |
| `/reset` | `/reset` | Requests confirmation to reset conversation history | `/reset` |
| `/memory` | `/memory` | Inspects personalized memory facts remembered about you | `/memory` |
| `/history` | `/history` | Displays recent conversation turns in this session | `/history` |
| `/export` | `/export` | Exports conversation history as formatted Markdown | `/export` |
| `/summarize` | `/summarize <text>` | Summarizes input text or replied message into concise bullet points | `/summarize <long article>` |
| `/translate` | `/translate <lang> <text>` | Translates text into target language preserving tone | `/translate Hindi Hello world` |
| `/explain` | `/explain <concept>` | Detailed step-by-step breakdown of concepts | `/explain How do black holes form?` |
| `/rewrite` | `/rewrite <text>` | Rephrases text in 3 distinct tones (professional, friendly, punchy) | `/rewrite Hey look at this` |
| `/continue` | `/continue` | Continues an AI response that was truncated or ended early | `/continue` |

### C. Image Commands (7)
| Command | Syntax | Description | Example |
| :--- | :--- | :--- | :--- |
| `/image` | `/image <prompt>` | Generates high-resolution images via Google Imagen with capability verification | `/image Cyberpunk city at night` |
| `/imagine` | `/imagine <prompt>` | Expands prompt with artistic details and generates image | `/imagine Golden dragon in clouds` |
| `/analyzeimage` | `/analyzeimage [query]` | Multimodal vision analysis of attached or replied photo | `/analyzeimage What breed is this dog?` |
| `/describeimage` | `/describeimage` | Generates a vivid descriptive visual breakdown of a photo | `/describeimage` (reply to photo) |
| `/ocr` | `/ocr` | Extracts all visible text from an image or document | `/ocr` (reply to photo) |
| `/imageprompt` | `/imageprompt <idea>` | Expands a simple concept into a rich diffusion prompt | `/imageprompt Samurai in rain` |
| `/imagehelp` | `/imagehelp` | Comprehensive guide and prompt crafting tips | `/imagehelp` |

### D. Coding Commands (8)
| Command | Syntax | Description | Example |
| :--- | :--- | :--- | :--- |
| `/code` | `/code <prompt>` | Generates clean, production-ready code with comments | `/code Binary search in Python` |
| `/debug` | `/debug <code>` | Detects syntax bugs, logical flaws, and edge cases | `/debug def add(a, b): return a - b` |
| `/fixcode` | `/fixcode <code>` | Provides corrected working code with bulleted fix summary | `/fixcode <broken snippet>` |
| `/reviewcode` | `/reviewcode <code>` | Peer code review evaluating performance, security, and cleanliness | `/reviewcode <snippet>` |
| `/explaincode` | `/explaincode <code>` | Step-by-step walkthrough of code logic and functions | `/explaincode <snippet>` |
| `/formatcode` | `/formatcode <code>` | Cleans, formats, and indents code cleanly | `/formatcode <snippet>` |
| `/convertcode` | `/convertcode <from> to <to> <code>` | Translates code between programming languages | `/convertcode Python to JS <def...>` |
| `/regex` | `/regex <pattern or goal>` | Generates and explains regular expressions with test examples | `/regex Match email addresses` |

### E. Writing Commands (8)
| Command | Syntax | Description | Example |
| :--- | :--- | :--- | :--- |
| `/write` | `/write <topic>` | Writes essays, blogs, articles, or comprehensive write-ups | `/write Climate change solutions` |
| `/email` | `/email <purpose>` | Drafts professional or personal emails with subject lines | `/email Project status update to client` |
| `/caption` | `/caption <topic>` | Creates catchy social media captions with hashtags | `/caption Weekend coffee morning` |
| `/bio` | `/bio <details>` | Generates 3 profile bios for LinkedIn, Twitter, and Instagram | `/bio Full stack web developer` |
| `/story` | `/story <premise>` | Writes immersive fiction stories with vivid characters | `/story Detective in futuristic Tokyo` |
| `/ideas` | `/ideas <topic>` | Brainstorms 10 creative actionable concepts | `/ideas Side hustles in tech` |
| `/hashtags` | `/hashtags <topic>` | Generates targeted hashtags categorized by reach | `/hashtags Street photography` |
| `/quiz` | `/quiz <topic>` | Creates a 5-question multiple-choice interactive quiz | `/quiz Solar system astronomy` |

### F. File Commands (7)
| Command | Syntax | Description | Example |
| :--- | :--- | :--- | :--- |
| `/file` | `/file` | Displays file suite overview, supported types, and limits | `/file` |
| `/readfile` | `/readfile` | Reads and previews text/code documents safely | `/readfile` (reply to document) |
| `/pdf` | `/pdf [query]` | Multimodal extraction and analysis of PDF documents | `/pdf` (reply to PDF) |
| `/document` | `/document` | Inspects document lines, words, characters, and size | `/document` (reply to file) |
| `/extract` | `/extract` | Extracts emails, URLs, and IP addresses using regex | `/extract` (reply to text/file) |
| `/convert` | `/convert <format>` | Converts text/tables to JSON, CSV, or formatted Markdown | `/convert to JSON <data>` |
| `/fileinfo` | `/fileinfo` | Displays technical file metadata and MIME details | `/fileinfo` (reply to file) |

### G. Utility Commands (8)
| Command | Syntax | Description | Example |
| :--- | :--- | :--- | :--- |
| `/calculate` | `/calculate <expr>` | Sandbox-safe mathematical evaluator (Zero eval) | `/calculate (25 * 4) + sqrt(144)` |
| `/math` | `/math <problem>` | Step-by-step mathematical problem solver via Gemini | `/math Solve: 2x^2 + 5x - 3 = 0` |
| `/weather` | `/weather <city>` | Real-time global weather data via Open-Meteo | `/weather New Delhi` |
| `/search` | `/search <query>` | Comprehensive web research insights and summaries | `/search Latest NASA missions` |
| `/define` | `/define <word>` | Dictionary definition, phonetics, etymology, and synonyms | `/define Serendipity` |
| `/shorten` | `/shorten <url>` | Clean URL shortener via public API | `/shorten https://example.com` |
| `/remind` | `/remind <text>` | Saves personal reminder to persistent KV storage | `/remind Call bank at 3 PM` |
| `/todo` | `/todo [add\|list\|done\|clear]` | Complete to-do list manager stored per user | `/todo add Finish report` |

---

## 2. Admin Commands (31 Commands)
*Restricted to configured OWNER_TELEGRAM_ID and dynamic admins.*

| Command | Syntax | Description |
| :--- | :--- | :--- |
| `/admin` | `/admin` | Opens the interactive inline keyboard Admin Dashboard |
| `/adminhelp` | `/adminhelp` | Complete directory and documentation of all 31 admin commands |
| `/stats` | `/stats` | System overview, active users, session counts, and KV storage keys |
| `/users` | `/users` | Lists recently registered users with activity indicators |
| `/user` | `/user <user_id>` | Inspects a specific user by numeric Telegram ID |
| `/userinfo` | `/userinfo <user_id>` | Alias for deep user inspection |
| `/ban` | `/ban <user_id> [reason]` | Bans a user from using the bot |
| `/unban` | `/unban <user_id>` | Removes ban restriction from a user |
| `/mute` | `/mute <user_id> [mins]` | Temporarily mutes a user for specified minutes |
| `/unmute` | `/unmute <user_id>` | Removes mute restriction from a user |
| `/broadcast` | `/broadcast <text>` | Safe batched broadcast to all registered bot users |
| `/announce` | `/announce <text>` | High-priority announcement to all users |
| `/notice` | `/notice <text>` | Sets or updates active system-wide banner displayed before responses |
| `/delnotice` | `/delnotice` | Deletes the active system-wide banner |
| `/maintenance` | `/maintenance` | Checks current maintenance mode status and custom message |
| `/setmaintenance` | `/setmaintenance <on\|off> [msg]` | Toggles maintenance mode on or off |
| `/features` | `/features` | Lists all feature flags and toggle statuses |
| `/enablefeature` | `/enablefeature <feature_id>` | Enables a specific feature flag |
| `/disablefeature` | `/disablefeature <feature_id>` | Disables a specific feature flag |
| `/setlimit` | `/setlimit <max_req_per_min>` | Sets default user rate limit threshold |
| `/usage` | `/usage` | System-wide request and storage volume metrics |
| `/topusers` | `/topusers` | Ranks top 10 users by total interaction volume |
| `/logs` | `/logs` | Displays recent admin actions and audit records |
| `/errors` | `/errors` | Displays security events and handled exceptions |
| `/health` | `/health` | Live diagnostic probe for Worker status and KV latency |
| `/storage` | `/storage` | KV storage metrics broken down by namespace prefix |
| `/cleanup` | `/cleanup` | Manually triggers safe KV auto cleanup cycle |
| `/backup` | `/backup [note]` | Creates a snapshot backup of admin configs and notices |
| `/restore` | `/restore [backup_id]` | Restores settings from a backup snapshot |
| `/settingsadmin` | `/settingsadmin` | Displays global administrative settings and thresholds |
| `/test` | `/test` | Runs internal system self-test verifying core modules |
