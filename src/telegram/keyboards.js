/**
 * SHIV YOGI AI BOT - Telegram Inline Keyboard Builder
 * Provides intuitive, structured UI keyboards for main menus, categories,
 * pagination, confirmation, user settings, and admin dashboard.
 */

export function getMainMenuKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: '🤖 AI Assistant', callback_data: 'cat:ai' },
        { text: '🎨 Image Tools', callback_data: 'cat:image' }
      ],
      [
        { text: '💻 Coding Tools', callback_data: 'cat:coding' },
        { text: '✍️ Writing Tools', callback_data: 'cat:writing' }
      ],
      [
        { text: '📁 File Tools', callback_data: 'cat:files' },
        { text: '⚡ Utilities', callback_data: 'cat:utilities' }
      ],
      [
        { text: '👤 My Profile', callback_data: 'cat:profile' },
        { text: '⚙️ Settings', callback_data: 'cat:settings' }
      ],
      [
        { text: '📖 Help & Guides', callback_data: 'cat:help' },
        { text: 'ℹ️ About Bot', callback_data: 'cat:about' }
      ]
    ]
  };
}

export function getCategoryBackKeyboard(currentCategory) {
  return {
    inline_keyboard: [
      [
        { text: '🔙 Back to Menu', callback_data: 'home' }
      ]
    ]
  };
}

export function getSettingsKeyboard(settings = {}) {
  const memStatus = settings.memoryEnabled ? '🟢 ON' : '🔴 OFF';
  return {
    inline_keyboard: [
      [
        { text: `🌐 Language: ${settings.language === 'hi' ? 'हिंदी' : 'English'}`, callback_data: 'set:lang:toggle' }
      ],
      [
        { text: `🧠 Memory: ${memStatus}`, callback_data: 'set:mem:toggle' }
      ],
      [
        { text: `🎨 Style: ${settings.style || 'balanced'}`, callback_data: 'set:style:cycle' }
      ],
      [
        { text: '🔙 Back to Menu', callback_data: 'home' }
      ]
    ]
  };
}

export function getConfirmationKeyboard(action, identifier = '') {
  return {
    inline_keyboard: [
      [
        { text: '✅ Yes, Proceed', callback_data: `confirm:${action}:${identifier}` },
        { text: '❌ Cancel', callback_data: 'home' }
      ]
    ]
  };
}

export function getPaginationKeyboard(page, totalPages, prefix) {
  const buttons = [];
  if (page > 1) {
    buttons.push({ text: '⬅️ Previous', callback_data: `${prefix}:${page - 1}` });
  }
  buttons.push({ text: `📄 ${page}/${totalPages}`, callback_data: 'noop' });
  if (page < totalPages) {
    buttons.push({ text: 'Next ➡️', callback_data: `${prefix}:${page + 1}` });
  }

  return {
    inline_keyboard: [
      buttons,
      [{ text: '🔙 Back', callback_data: 'home' }]
    ]
  };
}

export function getAdminDashboardKeyboard(maintMode = false) {
  return {
    inline_keyboard: [
      [
        { text: '📊 Overview & Stats', callback_data: 'admin:stats' },
        { text: '👥 User Management', callback_data: 'admin:users' }
      ],
      [
        { text: '📢 Broadcast', callback_data: 'admin:broadcast' },
        { text: '📌 Notice Manager', callback_data: 'admin:notices' }
      ],
      [
        { text: '🎛️ Feature Toggles', callback_data: 'admin:features' },
        { text: maintMode ? '🔴 Maint: ON' : '🟢 Maint: OFF', callback_data: 'admin:toggle_maint' }
      ],
      [
        { text: '🧹 Safe KV Cleanup', callback_data: 'admin:cleanup' },
        { text: '💾 Backup Snapshot', callback_data: 'admin:backup' }
      ],
      [
        { text: '🩺 Health & Errors', callback_data: 'admin:health' },
        { text: '🔙 Exit Dashboard', callback_data: 'home' }
      ]
    ]
  };
}
