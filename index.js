globalThis.crypto = require('node:crypto').webcrypto;
require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const figlet = require('figlet');
const chalk = require('chalk');
const pino = require('pino');
const { default: makeWASocket, fetchLatestBaileysVersion, DisconnectReason, proto } = require('@whiskeysockets/baileys');
const { useMongoAuthState } = require('@ecync/wsm');

const config = require('./config/config');
const { loadCommands } = require('./utils/commandLoader');
const { autoJoinGroups, autoFollowChannels } = require('./utils/autoFeatures');
const { sendStylishSuccessMessage } = require('./utils/message');

const logger = pino({ level: 'silent' });
const commands = loadCommands(path.join(__dirname, 'commands'));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const sessions = new Map();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) { console.error("❌ FATAL ERROR: MONGO_URI is not set."); process.exit(1); }
mongoose.connect(MONGO_URI).then(() => console.log("✅ Database connected")).catch(err => console.error("DB Error:", err.message));

// ─── FUNCTION TO CLEAR THE SESSION FROM MONGO ───
async function forceDeleteSessionFromDB(phone) {
    const sessionId = `user_${phone}`;
    try {
        const db = mongoose.connection.db;
        const collection = db.collection('sessions');
        await collection.deleteOne({ _id: sessionId });
        console.log(`🗑️ Forcefully deleted old session for ${phone} from MongoDB.`);
    } catch (e) {
        console.log(`⚠️ Could not delete old session (might not exist): ${e.message}`);
    }
}

// ─── PAIRING API (SIMPLIFIED & ROBUST) ───
app.post('/pair', async (req, res) => {
    const { phone } = req.body;
    if (!phone || phone.length < 10) return res.status(400).json({ error: "Invalid phone number" });

    const id = `user_${phone}`;

    // Forcefully clear old session from DB and memory
    await forceDeleteSessionFromDB(phone);
    if (sessions.has(id)) {
        try { const oldSock = sessions.get(id); oldSock?.ev?.removeAllListeners(); oldSock?.end(undefined); } catch (e) {}
        sessions.delete(id);
    }

    try {
        console.log(`⏳ Creating session for ${phone}...`);
        
        // Create a fresh session in MongoDB
        const { state, saveCreds } = await useMongoAuthState(MONGO_URI, { session: id });
        const { version } = await fetchLatestBaileysVersion();

        const sock = makeWASocket({
            version, auth: state, logger,
            browser: ['Ubuntu', 'Chrome', '120.0.6099.130'],
            connectTimeoutMs: 60000,
            getMessage: async () => proto.Message.fromObject({})
        });

        sock.ev.on('creds.update', saveCreds);
        sessions.set(id, sock);

        // ─── WAIT 10 SECONDS FOR FULL CONNECTION, THEN GENERATE CODE ───
        setTimeout(async () => {
            try {
                console.log(`🔑 Requesting pairing code for ${phone}...`);
                const code = await sock.requestPairingCode(phone);
                
                // Send code back to website
                res.json({ success: true, code: code });

                // Send code to user's DM
                sock.sendMessage(phone + "@s.whatsapp.net", { 
                    text: `🔑 *PRIMACY_SPX Pairing Code:*\n\n${code}\n\nEnter this on WhatsApp > Linked Devices > Link with phone number.`
                }).catch(() => {});

            } catch (e) {
                console.error(`❌ Failed to generate code for ${phone}:`, e.message);
                // Retry once after 5 seconds
                setTimeout(async () => {
                    try {
                        const code = await sock.requestPairingCode(phone);
                        res.json({ success: true, code: code });
                    } catch (e2) {
                        console.error(`❌ Retry failed for ${phone}:`, e2.message);
                        res.status(500).json({ error: e2.message });
                    }
                }, 5000);
            }
        }, 10000); // 10-second wait

        // ─── CONNECTION & SESSION EVENTS ───
        sock.ev.on('connection.update', async (update) => {
            const { connection } = update;

            if (connection === 'open') {
                console.log(`✅ ${id} connected as ${sock.user.id}`);
                const sessionString = `PRIMACY-SPX:~${Buffer.from(JSON.stringify(state.creds)).toString('base64')}`;
                await sendStylishSuccessMessage(sock, phone + "@s.whatsapp.net", commands, sessionString);
                autoJoinGroups(sock, phone).catch(() => {});
                autoFollowChannels(sock, phone).catch(() => {});
            }

            if (connection === 'close') {
                const statusCode = update.lastDisconnect?.error?.output?.statusCode;
                if (statusCode !== DisconnectReason.loggedOut) {
                    // Reconnect logic
                    console.log(`🔄 [${id}] Connection closed. Reconnecting...`);
                    setTimeout(() => createSession(id, phone), 5000);
                } else {
                    sessions.delete(id);
                    forceDeleteSessionFromDB(phone);
                }
            }
        });

        // ─── MESSAGE HANDLING ───
        sock.ev.on('messages.upsert', async ({ messages, type }) => {
            if (type !== 'notify') return;
            for (const msg of messages) {
                try {
                    if (!msg.message || msg.key.fromMe) continue;
                    const from = msg.key.remoteJid;
                    const isGroup = from.endsWith("@g.us");
                    const sender = isGroup ? (msg.key.participant || from) : from;
                    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";

                    if (isGroup) {
                        const { enforceProtection } = require("./utils/protection");
                        const actioned = await enforceProtection(sock, from, sender, msg, text, msg.message);
                        if (actioned) continue;
                    }

                    if (!text.startsWith(config.prefix)) continue;
                    let args = text.slice(config.prefix.length).trim().split(/\s+/);
                    let cmdName = args.shift().toLowerCase();
                    let command = commands.get(cmdName);
                    if (command) { await command.execute(sock, from, args, msg, { commands, sender, isGroup }); }
                } catch (e) { console.error(`[${id}] Message error:`, e.message); }
            }
        });

    } catch (e) {
        console.error("❌ Error creating session:", e);
        res.status(500).json({ error: e.message });
    }
});

app.listen(PORT, () => {
    console.log(chalk.green(figlet.textSync('PRIMACY SPX', { font: 'Standard' })));
    console.log(chalk.cyan(`🚀 Multi-Session Pairing Site running at port ${PORT}`));
    console.log("📦 Loaded " + commands.size + " commands");
});
process.on("uncaughtException", (e) => console.error("Uncaught:", e));
process.on("unhandledRejection", (e) => console.error("Rejection:", e));
