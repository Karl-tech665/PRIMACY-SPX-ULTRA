// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GENERAL & AI COMMANDS (in a new file)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const axios = require("axios");
const config = require("../config/config");
const state = require("../config/runtimeSettings");

module.exports = [
    // ── BASIC ──
    { name: "ping", async execute(sock, from) { const s = Date.now(); await sock.sendMessage(from, { text: "🏓 Pinging..." }); await sock.sendMessage(from, { text: "🏓 Pong! " + (Date.now() - s) + "ms" }); } },
    { name: "alive", async execute(sock, from) { await sock.sendMessage(from, { text: "✅ " + state.botName + " is alive and well!" }); } },
    { name: "owner", async execute(sock, from) { await sock.sendMessage(from, { text: "👑 " + config.OWNER_NUMBER }); } },
    { name: "say", async execute(sock, from, args) { if (!args.length) return sock.sendMessage(from, { text: "❌ .say something" }); await sock.sendMessage(from, { text: args.join(" ") }); } },
    { name: "calc", async execute(sock, from, args) { if (!args.length) return sock.sendMessage(from, { text: "❌ .calc 2+2" }); try { const exp = args.join(" ").replace(/[^0-9+\-*/().% ]/g, ""); const r = Function('"use strict"; return (' + exp + ')')(); await sock.sendMessage(from, { text: "🧮 " + exp + " = " + r }); } catch (e) { await sock.sendMessage(from, { text: "❌ Invalid expression." }); } } },

    // ── FUN (Real APIs) ──
    { name: "joke", async execute(sock, from) { const j = ["Why do programmers prefer dark mode? Light attracts bugs!", "What do you call a fake noodle? An impasta!", "Why did the scarecrow win an award? Outstanding in his field!"]; await sock.sendMessage(from, { text: "😂 " + j[Math.floor(Math.random() * j.length)] }); } },
    { name: "meme", async execute(sock, from) { try { const r = await axios.get("https://meme-api.com/gimme"); await sock.sendMessage(from, { image: { url: r.data.url }, caption: "😂 " + r.data.title }); } catch (e) { await sock.sendMessage(from, { text: "❌ Meme fetch failed." }); } } },

    // ── ANIMATED MENU ──
    { name: "menu", aliases: ["help", "cmds"], async execute(sock, from, args, msg, extra = {}) {
        const commands = extra.commands || {};
        const cmdCount = Object.keys(commands).length;

        const buildFrame = (pct, status) => {
            const barLength = 20;
            const filled = Math.round((pct / 100) * barLength);
            const bar = "█".repeat(filled) + "░".repeat(barLength - filled);
            return `🔄 *LOADING MENU...*\n\n✦ ${state.botName} ✦\n\n${bar} ${pct}%\n${status}`;
        };

        const frames = [
            buildFrame(15, "⚡ Initializing System..."),
            buildFrame(40, "📂 Loading Command Modules..."),
            buildFrame(65, "🛡️ Loading Protection System..."),
            buildFrame(90, "🎨 Generating Interface..."),
            buildFrame(100, "✅ Menu Loaded!"),
        ];

        let { key } = await sock.sendMessage(from, { text: frames[0] });
        for (let i = 1; i < frames.length; i++) {
            await new Promise(r => setTimeout(r, 500));
            await sock.sendMessage(from, { text: frames[i], edit: key });
        }

        const finalMenu = `✦ ${state.botName} ✦\n───────────────────────\n📌 Prefix : ${config.PREFIX}\n👑 Owner : ${config.OWNER_NUMBER}\n📦 Commands : ${cmdCount}\n───────────────────────\n🌐 *PROXY*: .proxy\n🧠 *AI*: .ai, .prime\n🎮 *FUN*: joke, fact, quote, meme\n🐙 *REPO*: repo\n───────────────────────\n✦ 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 ${state.botName} ✦`;

        try {
            await sock.sendMessage(from, { image: { url: config.MENU_IMAGE }, caption: finalMenu });
        } catch (e) {
            console.log("❌ Menu: " + e.message);
        }
    } },

    // ── AI & PRIME (Real Gemini API) ──
    { name: "ai", async execute(sock, from, args) {
        if (!args.length) return sock.sendMessage(from, { text: "❌ .ai What is AI?" });
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return sock.sendMessage(from, { text: "🤖 Set GEMINI_API_KEY in Render > Environment." });
        try {
            const res = await axios.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey, { contents: [{ parts: [{ text: args.join(" ") }] }] });
            const reply = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
            await sock.sendMessage(from, { text: reply ? "🤖 " + reply : "🤖 No response." });
        } catch (e) { await sock.sendMessage(from, { text: "🤖 Error: " + e.message }); }
    } },

    { name: "prime", aliases: ["void"], async execute(sock, from, args, msg, extra = {}) {
        if (!args.length) return sock.sendMessage(from, { text: "🐞 *Prime*\nAsk me anything!\nExample: .prime what commands do you have?" });
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return sock.sendMessage(from, { text: "🐞 Prime needs GEMINI_API_KEY set in your host's Environment settings to work." });
        
        const cmdCount = Object.keys(extra.commands || {}).length;
        const prompt = `You are Prime 🐞, the AI assistant built into the WhatsApp bot "${state.botName}".\nKnown facts:\n- Prefix: ${config.PREFIX}\n- Owner: ${config.OWNER_NUMBER}\n- Loaded commands: ${cmdCount}\n- Proxy: ${config.PROXY.LINK}\n- Menu command: type ${config.PREFIX}menu\n\nUser's message: ` + args.join(" ");

        try {
            const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const data = await res.json();
            const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            await sock.sendMessage(from, { text: reply ? "🐞 " + reply : "🐞 No response from Prime right now." });
        } catch (e) { await sock.sendMessage(from, { text: "🐞 Prime error: " + e.message }); }
    } }
];
