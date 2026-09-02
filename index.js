globalThis.crypto = require('node:crypto').webcrypto;
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const figlet = require('figlet');
const chalk = require('chalk');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  makeCacheableSignalKeyStore,
  proto,
} = require('@whiskeysockets/baileys');

const config = require('./config/config');
const logger = require('./utils/logger');
const { loadCommands } = require('./utils/commandLoader');
const { registerConnectionHandler } = require('./events/connection');
const { registerMessageHandler } = require('./events/messages');
const { acquireLock, releaseLock } = require('./utils/instanceLock');
const { groupCache } = require('./utils/groupCache');

acquireLock();

function restoreSettingsFromEnv() {
  const settingsPath = path.join(__dirname, 'config', 'botSettings.json');
  if (config.botSettingsData && !fs.existsSync(settingsPath)) {
    try {
      const raw = Buffer.from(config.botSettingsData, 'base64').toString('utf8');
      fs.writeFileSync(settingsPath, raw);
      logger.info('✅ Restored bot settings from BOT_SETTINGS_DATA.');
    } catch (error) {
      logger.error(`[restoreSettingsFromEnv] Failed to restore settings: ${error.message}`);
    }
  }
}

function restoreSessionFromEnv() {
  const authDir = path.join(__dirname, config.authFolder);
  const credsPath = path.join(authDir, 'creds.json');
  if (fs.existsSync(credsPath)) return;

  try {
    const settingsStore = require('./utils/settingsStore');
    if (settingsStore.get('_sessionLoggedOut', false)) {
      logger.warn('[restoreSession] Last session was logged out. Skipping restoration.');
      settingsStore.set('_sessionLoggedOut', false);
      return;
    }
  } catch {}

  let raw = config.sessionId;
  if (!raw) {
    try {
      const settingsStore = require('./utils/settingsStore');
      raw = settingsStore.get('_sessionBackup', null);
    } catch {}
  }
  if (!raw) return;

  try {
    if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });
    const buffer = Buffer.from(raw.replace(/^PRIMACY-SPX:~/, ''), 'base64');
    fs.writeFileSync(credsPath, buffer);
    logger.info('✅ Restored session from SESSION_ID.');
  } catch (error) {
    logger.error(`[restoreSessionFromEnv] Failed to restore session: ${error.message}`);
  }
}

const commandsPath = path.join(__dirname, 'commands');
let commands = {};
let wapresenceInterval = null;
let autobioInterval = null;

async function startBot() {
  try {
    restoreSessionFromEnv();
    restoreSettingsFromEnv();

    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, config.authFolder));
    const wasAlreadyRegistered = state.creds.registered;
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, logger) },
      logger,
      connectTimeoutMs: 90000,
      keepAliveIntervalMs: 15000,
      browser: ['Ubuntu', 'Chrome', '120.0.6099.130'],
      getMessage: async (key) => {
        const messageCache = require('./utils/messageCache');
        const cached = messageCache.get(key.remoteJid, key.id);
        if (cached?.rawMessage) return cached.rawMessage;
        return proto.Message.fromObject({});
      },
    });

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('creds.update', async () => {
      try {
        const settingsStore = require('./utils/settingsStore');
        const credsPath = path.join(__dirname, config.authFolder, 'creds.json');
        if (fs.existsSync(credsPath)) {
          const sessionId = `PRIMACY-SPX:~${fs.readFileSync(credsPath).toString('base64')}`;
          settingsStore.set('_sessionBackup', sessionId);
        }
      } catch (e) { logger.warn('[sessionBackup] Could not back up session to DB:', e.message); }
    });

    sock.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
      if (connection === 'close') {
        const status = lastDisconnect?.error?.output?.statusCode;
        if (status === DisconnectReason.loggedOut) {
          releaseLock();
          try {
            const settingsStore = require('./utils/settingsStore');
            settingsStore.set('_sessionBackup', null);
            settingsStore.set('_sessionLoggedOut', true);
            const authDir = path.join(__dirname, config.authFolder);
            fs.rmSync(authDir, { recursive: true, force: true });
          } catch {}
        }
      }
    });

    // Register Events
    registerConnectionHandler(sock, startBot, wasAlreadyRegistered);
    registerMessageHandler(sock, commands);

    // Load local commands
    commands = loadCommands(commandsPath);
    console.log('📦 Loaded ' + Object.keys(commands).length + ' commands');

    // Presence and Auto-bio
    if (wapresenceInterval) clearInterval(wapresenceInterval);
    wapresenceInterval = setInterval(async () => {
      try {
        const settingsStore = require('./utils/settingsStore');
        if (settingsStore.get('wapresence', false)) await sock.sendPresenceUpdate('available');
      } catch (e) {}
    }, 30000);

    if (autobioInterval) clearInterval(autobioInterval);
    autobioInterval = setInterval(async () => {
      try {
        const settingsStore = require('./utils/settingsStore');
        if (!settingsStore.get('autobio', false)) return;
        const quotes = JSON.parse(fs.readFileSync(path.join(__dirname, 'config', 'autobioQuotes.json'), 'utf8'));
        const quoteIndex = Math.floor(Date.now() / 43200000) % quotes.length;
        const quote = quotes[quoteIndex];
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-GB', { timeZone: config.timezone, hour: '2-digit', minute: '2-digit' });
        const dateStr = now.toLocaleDateString('en-GB', { timeZone: config.timezone });
        await sock.updateProfileStatus(`PRIMACY_SPX ULTRA is alive now\n${dateStr} ${timeStr}\n"${quote}"`);
      } catch (e) {}
    }, 60000);

  } catch (error) {
    logger.error(`[startBot] Failed to start the bot: ${error.message}`);
  }
}

process.on('uncaughtException', (error) => logger.error(`[uncaughtException] ${error.stack || error.message}`));
process.on('unhandledRejection', (reason) => logger.error(`[unhandledRejection] ${reason}`));

console.log(chalk.green(figlet.textSync('PRIMACY SPX', { font: 'Standard' })));
console.log(chalk.cyan('🤖 PRIMACY_SPX ULTRA is starting up...'));

startBot();
