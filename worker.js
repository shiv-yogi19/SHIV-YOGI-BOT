/**
 * SHIV YOGI AI BOT - Root Worker Proxy
 * Re-exports the canonical Worker implementation from src/index.js
 * to ensure consistency between wrangler config and direct file imports.
 */

export * from './src/index.js';
export { default } from './src/index.js';
