/**
 * SHIV YOGI AI BOT - Date & Time Utilities
 * Supports Indian Standard Time (IST) display and relative time formatting.
 */

export function formatDateIST(timestamp = Date.now()) {
  const d = new Date(timestamp);
  return d.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

export function formatRelativeTime(timestamp) {
  if (!timestamp) return 'never';
  const diffMs = Date.now() - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

export function getTodayDateString() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}
