/**
 * SHIV YOGI AI BOT - Centralized Command Registry
 * Contains metadata and handlers for all 60 User Commands + 31 Admin Commands (91 Total).
 */

import { COMMAND_CATEGORIES } from '../config/constants.js';

// User Command Handlers
import {
  handleStart,
  handleHelp,
  handleAbout,
  handleStatus,
  handlePing,
  handleSettings,
  handleLanguage,
  handleProfile,
  handleFeedback,
  handleReport
} from '../commands/general/index.js';

import {
  handleAsk,
  handleChat,
  handleNewChat,
  handleReset,
  handleMemory,
  handleHistory,
  handleExport,
  handleSummarize,
  handleTranslate,
  handleExplain,
  handleRewrite,
  handleContinue
} from '../commands/ai/index.js';

import {
  handleImage,
  handleImagine,
  handleAnalyzeImage,
  handleDescribeImage,
  handleOcr,
  handleImagePrompt,
  handleImageHelp
} from '../commands/image/index.js';

import {
  handleCode,
  handleDebug,
  handleFixCode,
  handleReviewCode,
  handleExplainCode,
  handleFormatCode,
  handleConvertCode,
  handleRegex
} from '../commands/coding/index.js';

import {
  handleWrite,
  handleEmail,
  handleCaption,
  handleBio,
  handleStory,
  handleIdeas,
  handleHashtags,
  handleQuiz
} from '../commands/writing/index.js';

import {
  handleFile,
  handleReadFile,
  handlePdf,
  handleDocument,
  handleExtract,
  handleConvert,
  handleFileInfo
} from '../commands/files/index.js';

import {
  handleCalculate,
  handleMath,
  handleWeather,
  handleSearch,
  handleDefine,
  handleShorten,
  handleRemind,
  handleTodo
} from '../commands/utilities/index.js';

// Admin Command Handlers
import {
  handleAdmin,
  handleAdminHelp,
  handleStats,
  handleUsers,
  handleUser,
  handleUserInfo,
  handleBan,
  handleUnban,
  handleMute,
  handleUnmute,
  handleBroadcast,
  handleNotice,
  handleDelNotice,
  handleMaintenance,
  handleSetMaintenance,
  handleFeatures,
  handleEnableFeature,
  handleDisableFeature,
  handleSetLimit,
  handleUsage,
  handleTopUsers,
  handleLogs,
  handleErrors,
  handleHealth,
  handleStorage,
  handleCleanup,
  handleBackup,
  handleRestore,
  handleSettingsAdmin,
  handleTest,
  handleAnnounce
} from '../admin/commands.js';

export const COMMANDS = {
  // --- GENERAL (10) ---
  '/start': { handler: handleStart, category: COMMAND_CATEGORIES.GENERAL, adminOnly: false, desc: 'Start the bot and view main menu' },
  '/help': { handler: handleHelp, category: COMMAND_CATEGORIES.GENERAL, adminOnly: false, desc: 'Display categorized command directory' },
  '/about': { handler: handleAbout, category: COMMAND_CATEGORIES.GENERAL, adminOnly: false, desc: 'About bot, creator and technology' },
  '/status': { handler: handleStatus, category: COMMAND_CATEGORIES.GENERAL, adminOnly: false, desc: 'System status and operational state' },
  '/ping': { handler: handlePing, category: COMMAND_CATEGORIES.GENERAL, adminOnly: false, desc: 'Ping bot and check network latency' },
  '/settings': { handler: handleSettings, category: COMMAND_CATEGORIES.GENERAL, adminOnly: false, desc: 'Customize personal bot preferences' },
  '/language': { handler: handleLanguage, category: COMMAND_CATEGORIES.GENERAL, adminOnly: false, desc: 'Switch response language' },
  '/profile': { handler: handleProfile, category: COMMAND_CATEGORIES.GENERAL, adminOnly: false, desc: 'View user profile & usage statistics' },
  '/feedback': { handler: handleFeedback, category: COMMAND_CATEGORIES.GENERAL, adminOnly: false, desc: 'Submit feedback to the creator' },
  '/report': { handler: handleReport, category: COMMAND_CATEGORIES.GENERAL, adminOnly: false, desc: 'Report a problem or bug' },

  // --- AI COMMANDS (12) ---
  '/ask': { handler: handleAsk, category: COMMAND_CATEGORIES.AI, adminOnly: false, desc: 'Ask Gemini any question directly' },
  '/chat': { handler: handleChat, category: COMMAND_CATEGORIES.AI, adminOnly: false, desc: 'Multi-turn contextual conversational chat' },
  '/newchat': { handler: handleNewChat, category: COMMAND_CATEGORIES.AI, adminOnly: false, desc: 'Start a fresh conversation session' },
  '/reset': { handler: handleReset, category: COMMAND_CATEGORIES.AI, adminOnly: false, desc: 'Reset conversation history' },
  '/memory': { handler: handleMemory, category: COMMAND_CATEGORIES.AI, adminOnly: false, desc: 'View personalized stored memory' },
  '/history': { handler: handleHistory, category: COMMAND_CATEGORIES.AI, adminOnly: false, desc: 'View recent chat turns' },
  '/export': { handler: handleExport, category: COMMAND_CATEGORIES.AI, adminOnly: false, desc: 'Export conversation history' },
  '/summarize': { handler: handleSummarize, category: COMMAND_CATEGORIES.AI, adminOnly: false, desc: 'Summarize long text or articles' },
  '/translate': { handler: handleTranslate, category: COMMAND_CATEGORIES.AI, adminOnly: false, desc: 'Translate text between languages' },
  '/explain': { handler: handleExplain, category: COMMAND_CATEGORIES.AI, adminOnly: false, desc: 'Get step-by-step clear explanations' },
  '/rewrite': { handler: handleRewrite, category: COMMAND_CATEGORIES.AI, adminOnly: false, desc: 'Rephrase text in different tones' },
  '/continue': { handler: handleContinue, category: COMMAND_CATEGORIES.AI, adminOnly: false, desc: 'Continue truncated AI response' },

  // --- IMAGE COMMANDS (7) ---
  '/image': { handler: handleImage, category: COMMAND_CATEGORIES.IMAGE, adminOnly: false, desc: 'Generate images from text prompts' },
  '/imagine': { handler: handleImagine, category: COMMAND_CATEGORIES.IMAGE, adminOnly: false, desc: 'Generate images with enhanced prompts' },
  '/analyzeimage': { handler: handleAnalyzeImage, category: COMMAND_CATEGORIES.IMAGE, adminOnly: false, desc: 'Deep vision analysis of a photo' },
  '/describeimage': { handler: handleDescribeImage, category: COMMAND_CATEGORIES.IMAGE, adminOnly: false, desc: 'Vivid descriptive scene breakdown' },
  '/ocr': { handler: handleOcr, category: COMMAND_CATEGORIES.IMAGE, adminOnly: false, desc: 'Extract text from image or document' },
  '/imageprompt': { handler: handleImagePrompt, category: COMMAND_CATEGORIES.IMAGE, adminOnly: false, desc: 'Expand prompt into diffusion syntax' },
  '/imagehelp': { handler: handleImageHelp, category: COMMAND_CATEGORIES.IMAGE, adminOnly: false, desc: 'Help guide for image tools' },

  // --- CODING COMMANDS (8) ---
  '/code': { handler: handleCode, category: COMMAND_CATEGORIES.CODING, adminOnly: false, desc: 'Generate clean production-ready code' },
  '/debug': { handler: handleDebug, category: COMMAND_CATEGORIES.CODING, adminOnly: false, desc: 'Find and explain code bugs' },
  '/fixcode': { handler: handleFixCode, category: COMMAND_CATEGORIES.CODING, adminOnly: false, desc: 'Provide corrected working code' },
  '/reviewcode': { handler: handleReviewCode, category: COMMAND_CATEGORIES.CODING, adminOnly: false, desc: 'Perform in-depth code review' },
  '/explaincode': { handler: handleExplainCode, category: COMMAND_CATEGORIES.CODING, adminOnly: false, desc: 'Walkthrough code line-by-line' },
  '/formatcode': { handler: handleFormatCode, category: COMMAND_CATEGORIES.CODING, adminOnly: false, desc: 'Beautify and format code snippet' },
  '/convertcode': { handler: handleConvertCode, category: COMMAND_CATEGORIES.CODING, adminOnly: false, desc: 'Translate code between languages' },
  '/regex': { handler: handleRegex, category: COMMAND_CATEGORIES.CODING, adminOnly: false, desc: 'Generate and explain regular expressions' },

  // --- WRITING COMMANDS (8) ---
  '/write': { handler: handleWrite, category: COMMAND_CATEGORIES.WRITING, adminOnly: false, desc: 'Write comprehensive essays/articles' },
  '/email': { handler: handleEmail, category: COMMAND_CATEGORIES.WRITING, adminOnly: false, desc: 'Draft professional emails' },
  '/caption': { handler: handleCaption, category: COMMAND_CATEGORIES.WRITING, adminOnly: false, desc: 'Generate engaging social captions' },
  '/bio': { handler: handleBio, category: COMMAND_CATEGORIES.WRITING, adminOnly: false, desc: 'Create standout profile bios' },
  '/story': { handler: handleStory, category: COMMAND_CATEGORIES.WRITING, adminOnly: false, desc: 'Generate imaginative stories' },
  '/ideas': { handler: handleIdeas, category: COMMAND_CATEGORIES.WRITING, adminOnly: false, desc: 'Brainstorm creative concepts' },
  '/hashtags': { handler: handleHashtags, category: COMMAND_CATEGORIES.WRITING, adminOnly: false, desc: 'Generate targeted viral hashtags' },
  '/quiz': { handler: handleQuiz, category: COMMAND_CATEGORIES.WRITING, adminOnly: false, desc: 'Interactive educational quizzes' },

  // --- FILE COMMANDS (7) ---
  '/file': { handler: handleFile, category: COMMAND_CATEGORIES.FILES, adminOnly: false, desc: 'Overview of file tools & limits' },
  '/readfile': { handler: handleReadFile, category: COMMAND_CATEGORIES.FILES, adminOnly: false, desc: 'Read code or text document files' },
  '/pdf': { handler: handlePdf, category: COMMAND_CATEGORIES.FILES, adminOnly: false, desc: 'Inspect & summarize PDF documents' },
  '/document': { handler: handleDocument, category: COMMAND_CATEGORIES.FILES, adminOnly: false, desc: 'Analyze document metrics and structure' },
  '/extract': { handler: handleExtract, category: COMMAND_CATEGORIES.FILES, adminOnly: false, desc: 'Extract emails, URLs, or tables' },
  '/convert': { handler: handleConvert, category: COMMAND_CATEGORIES.FILES, adminOnly: false, desc: 'Convert text to JSON, CSV, or Markdown' },
  '/fileinfo': { handler: handleFileInfo, category: COMMAND_CATEGORIES.FILES, adminOnly: false, desc: 'View technical file metadata' },

  // --- UTILITY COMMANDS (8) ---
  '/calculate': { handler: handleCalculate, category: COMMAND_CATEGORIES.UTILITIES, adminOnly: false, desc: 'Safe mathematical calculator' },
  '/math': { handler: handleMath, category: COMMAND_CATEGORIES.UTILITIES, adminOnly: false, desc: 'Step-by-step math solver' },
  '/weather': { handler: handleWeather, category: COMMAND_CATEGORIES.UTILITIES, adminOnly: false, desc: 'Real-time global weather data' },
  '/search': { handler: handleSearch, category: COMMAND_CATEGORIES.UTILITIES, adminOnly: false, desc: 'Web research summaries' },
  '/define': { handler: handleDefine, category: COMMAND_CATEGORIES.UTILITIES, adminOnly: false, desc: 'Dictionary definitions & etymology' },
  '/shorten': { handler: handleShorten, category: COMMAND_CATEGORIES.UTILITIES, adminOnly: false, desc: 'Clean URL shortener' },
  '/remind': { handler: handleRemind, category: COMMAND_CATEGORIES.UTILITIES, adminOnly: false, desc: 'Save personal reminders' },
  '/todo': { handler: handleTodo, category: COMMAND_CATEGORIES.UTILITIES, adminOnly: false, desc: 'Manage your personal to-do list' },

  // --- ADMIN COMMANDS (31) ---
  '/admin': { handler: handleAdmin, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'Interactive Admin Dashboard' },
  '/adminhelp': { handler: handleAdminHelp, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'Admin command directory' },
  '/stats': { handler: handleStats, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'System stats & user metrics' },
  '/users': { handler: handleUsers, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'List recent registered users' },
  '/user': { handler: handleUser, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'Inspect user profile by ID' },
  '/userinfo': { handler: handleUserInfo, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'Deep user activity info' },
  '/ban': { handler: handleBan, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'Ban a user from the bot' },
  '/unban': { handler: handleUnban, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'Unban a user' },
  '/mute': { handler: handleMute, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'Temporarily mute a user' },
  '/unmute': { handler: handleUnmute, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'Unmute a user' },
  '/broadcast': { handler: handleBroadcast, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'Safe batched broadcast' },
  '/notice': { handler: handleNotice, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'Create or view active notice' },
  '/delnotice': { handler: handleDelNotice, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'Delete active notice' },
  '/maintenance': { handler: handleMaintenance, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'Check maintenance mode status' },
  '/setmaintenance': { handler: handleSetMaintenance, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'Toggle maintenance mode on/off' },
  '/features': { handler: handleFeatures, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'List feature flags and status' },
  '/enablefeature': { handler: handleEnableFeature, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'Enable a feature' },
  '/disablefeature': { handler: handleDisableFeature, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'Disable a feature' },
  '/setlimit': { handler: handleSetLimit, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'Set rate limits & quotas' },
  '/usage': { handler: handleUsage, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'System-wide AI usage summary' },
  '/topusers': { handler: handleTopUsers, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'Top active users by requests' },
  '/logs': { handler: handleLogs, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'Recent admin audit logs' },
  '/errors': { handler: handleErrors, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'Recent error and security logs' },
  '/health': { handler: handleHealth, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'Real-time health check' },
  '/storage': { handler: handleStorage, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'KV storage breakdown' },
  '/cleanup': { handler: handleCleanup, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'Trigger safe KV cleanup' },
  '/backup': { handler: handleBackup, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'Create config snapshot backup' },
  '/restore': { handler: handleRestore, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'Restore from snapshot backup' },
  '/settingsadmin': { handler: handleSettingsAdmin, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'Admin global settings' },
  '/test': { handler: handleTest, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'Internal integrity diagnostics' },
  '/announce': { handler: handleAnnounce, category: COMMAND_CATEGORIES.ADMIN, adminOnly: true, desc: 'Urgent broadcast announcement' }
};

export function getCommand(cmdText) {
  if (!cmdText) return null;
  const cleanCmd = cmdText.split('@')[0].toLowerCase().trim();
  return COMMANDS[cleanCmd] || null;
}

export function getUserCommandsCount() {
  return Object.values(COMMANDS).filter(c => !c.adminOnly).length;
}

export function getAdminCommandsCount() {
  return Object.values(COMMANDS).filter(c => c.adminOnly).length;
}
