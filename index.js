globalThis.crypto = require('node:crypto').webcrypto;
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const figlet = require('figlet');
const chalk = require('chalk');
const pino = require('pino');
const { default: makeWASocket, fetchLatestBaileysVersion, DisconnectReason, proto } = require('@whiskeysockets/baileys');
const { useMongoAuthState } = require('@ecync/wsm');

const config = require('./config/config');
const { loadCommands } = require('./utils/commandLoader');

const logger = pino({ level: 'silent' });
const commands = loadCommands(path.join(__dirname, 'commands'));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const sessions = new Map();
const pendingPairings = new Map();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error("❌ FATAL ERROR: MONGO_URI is not set.");
    process.exit(1);
}
mongoose.connect(MONGO_URI).then(() => console.log("✅ Database connected")).catch(err => console.error("DB Error:", err.message));

// ─── API ROUTE (Matches HTML: sends { phone }, expects { success, code }) ───
app.post('/api/pair', async (req, res) => {
    const { phone } = req.body;
    if (!phone || phone.length < 10) return res.status(400).json({ error: "Invalid phone number" });
    
    const id = `user_${phone}`;
    try {
        if (sessions.has(id)) return res.status(400).json({ error: "Session already active" });

        const pairingPromise = new Promise((resolve, reject) => {
            pendingPairings.set(id, { resolve, reject, phone });
        });

        createSession(id, phone);

        const code = await pairingPromise;
        res.json({ success: true, code: code });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

async function createSession(sessionId, phone) {
    const { state, saveCreds } = await useMongoAuthState(MONGO_URI, { session: sessionId });
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version, auth: state, logger,
        browser: ['Ubuntu', 'Chrome', '120.0.6099.130'],
        connectTimeoutMs: 60000,
        getMessage: async () => proto.Message.fromObject({})
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection } = update;
        
        if (connection === "connecting" && !state.creds.registered && pendingPairings.has(sessionId)) {
            const pending = pendingPairings.get(sessionId);
            try {
                await new Promise(r => setTimeout(r, 3000));
                const code = await sock.requestPairingCode(pending.phone);
                
                pending.resolve(code);
                sock.sendMessage(pending.phone + "@s.whatsapp.net", { 
                    text: `🔑 *PRIMACY_SPX Pairing Code:*\n\n${code}\n\nEnter this on WhatsApp > Linked Devices > Link with phone number.`
                }).catch(() => {});
                
                pendingPairings.delete(sessionId);
            } catch (e) {
                pending.reject(e);
                pendingPairings.delete(sessionId);
            }
        }

        if (connection === 'open') {
            console.log(`✅ ${sessionId} connected as ${sock.user.id}`);
            const sessionString = `PRIMACY-SPX:~${Buffer.from(JSON.stringify(state.creds)).toString('base64')}`;
            const successMsg = `✦ PRIMACY_SPX ✦\n✅ CONNECTED & ACTIVE\n\n📱 Connected : ${sock.user.id}\n📦 Commands : ${Object.keys(commands).length}\n\n─ [ SESSION CREATED ] ─\nName: ${config.botName}\nStatus: ⏳ Waiting Deployment\n\n⚠️ Your Session ID (Keep Private):\n\n${sessionString}`;
            
            await sock.sendMessage(phone + "@s.whatsapp.net", { text: successMsg });
            console.log(`📨 Session ID sent to ${phone}`);
        }

        if (connection === 'close') {
            const statusCode = update.lastDisconnect?.error?.output?.statusCode;
            if (statusCode !== DisconnectReason.loggedOut) {
                setTimeout(() => createSession(sessionId, phone), 5000);
            } else {
                sessions.delete(sessionId);
            }
        }
    });

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        for (const msg of messages) {
            try {
                if (!msg.message || msg.key.fromMe) continue;
                const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
                if (!text.startsWith(config.prefix)) continue;
                let args = text.slice(config.prefix.length).trim().split(/\s+/);
                let cmdName = args.shift().toLowerCase();
                let command = commands.get(cmdName);
                if (command) {
                    await command.execute(sock, msg.key.remoteJid, args, msg, { commands: commands });
                }
            } catch (e) { console.error(`[${sessionId}] Message error:`, e.message); }
        }
    });

    sessions.set(sessionId, sock);
}

app.listen(PORT, () => {
    console.log(chalk.green(figlet.textSync('PRIMACY SPX', { font: 'Standard' })));
    console.log(chalk.cyan(`🚀 Multi-Session Pairing Site running at port ${PORT}`));
    console.log("📦 Loaded " + Object.keys(commands).length + " commands");
});

process.on("uncaughtException", (e) => console.error("Uncaught:", e));
process.on("unhandledRejection", (e) => console.error("Rejection:", e));
