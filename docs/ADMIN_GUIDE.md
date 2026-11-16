# Administrator Guide & Operations Manual

This guide describes the operation, security policies, and capabilities of the Admin subsystem for **@ShivYogi19_bot**.

---

## 1. Security & Authorization Architecture
- **Default-Deny Model:** Every administrative command and callback action verifies user identity on the server side.
- **Owner Verification:** Primary authorization matches `OWNER_TELEGRAM_ID` (default: `8226363418`).
- **Dynamic Administrators:** Secondary administrators can be listed in `env.ADMIN_IDS` or added dynamically.
- **Audit Logging:** Every administrative action (bans, unbans, maintenance toggles, broadcasts, notices, backups) is logged to `admin:actions` in KV with timestamps.
- **Unauthorized Alerts:** Unauthorized attempts to execute admin commands are logged as security events and blocked immediately.

---

## 2. Interactive Admin Dashboard (`/admin`)
Sending `/admin` from an authorized Telegram account displays the interactive dashboard:

```
🛡️ Shiv Yogi Bot - Admin Command Dashboard

• System State: 🟢 Operational
• Total Registered Users: 1,420
• Active System Notice: "Server maintenance at 11 PM"
• Updated: 16 Nov 2026, 05:30 PM IST
```

### Dashboard Actions:
1. **📊 Overview & Stats:** Inspects key counts, registered users, and active sessions.
2. **👥 User Management:** Views recent registered users, their request counts, and moderation status.
3. **📢 Broadcast:** Access broadcast instructions and execution commands.
4. **📌 Notice Manager:** View active system notice, expiration time, and status.
5. **🎛️ Feature Toggles:** Dynamically toggle features on or off without redeploying.
6. **🛠️ Maintenance Mode:** Toggle global maintenance mode on/off.
7. **🧹 Safe KV Cleanup:** Triggers immediate execution of the KV auto-cleanup engine.
8. **💾 Backup Snapshot:** Creates a point-in-time configuration snapshot.
9. **🩺 Health & Errors:** Runs live probes for Worker status, KV read/write latency, and secrets check.

---

## 3. User Moderation Commands
- **Ban User:** `/ban <user_id> [reason]`  
  Blocks the user at the webhook gateway. Their requests will immediately receive a ban notification.
- **Unban User:** `/unban <user_id>`  
  Restores user access immediately.
- **Mute User:** `/mute <user_id> [minutes]`  
  Temporarily blocks responses for the specified number of minutes (e.g. `/mute 12345678 60`).
- **Unmute User:** `/unmute <user_id>`  
  Clears the mute expiration timestamp immediately.
- **Inspect User:** `/user <user_id>` or `/userinfo <user_id>`  
  Displays full details: join date, total requests, daily requests, active language, and ban/mute status.

---

## 4. Broadcasting & Announcements
- **Safe Batched Broadcast:** `/broadcast <message>`  
  Batches deliveries in groups of 25 messages with 1-second delays to prevent hitting Telegram's 30 messages/second rate limit. Collects statistics on delivered, blocked, and failed deliveries.
- **Urgent Announcement:** `/announce <message>`  
  Dispatches high-priority notifications to registered users.

---

## 5. System Notices (`/notice`)
- **Set Notice:** `/notice <message>`  
  Sets a global announcement banner that will automatically be prepended to AI responses for the next 24 hours.
- **Check Notice Status:** `/notice` (without arguments)  
  Displays the active notice, creation time, and expiration time.
- **Delete Notice:** `/delnotice`  
  Instantly clears the active notice banner.

---

## 6. KV Storage Auto-Cleanup (`/cleanup`)
The KV auto-cleanup engine removes ephemeral data while preserving permanent records:
- **Pruned:** Expired deduplication tokens older than 10 minutes, temporary task metadata older than 24 hours, stale rate-limit windows.
- **Preserved:** All user profiles (`profile:*`), conversation histories (`history:*`), personal memories (`memory:*`), user settings (`settings:*`), and backups (`backup:*`).
- **Batch Safety Limit:** Bounded to 50 keys per execution cycle to prevent Cloudflare Worker CPU timeouts.
- **Scheduled Automation:** Executes automatically if the Cron Trigger is configured.
