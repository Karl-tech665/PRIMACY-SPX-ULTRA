// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ULTIMATE PACK - REAL, WORKING, NO DUPLICATES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const axios = require("axios");
const crypto = require("crypto");
const config = require("../config/config");
const state = require("../config/runtimeSettings");

function isOwner(sender) {
    return sender.split("@")[0] === config.OWNER_NUMBER;
}
async function isAdmin(sock, from, sender) {
    try {
        const meta = await sock.groupMetadata(from);
        const p = meta.participants.find(x => x.id === sender);
        return p?.admin === "admin" || p?.admin === "superadmin";
    } catch (e) { return false; }
}
function extractTarget(args, msg) {
    return msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || (args[0]?.match(/@?(\d+)/)?.[1] ? args[0].match(/@?(\d+)/)[1] + "@s.whatsapp.net" : null);
}

module.exports = [
    // ── GENERAL & SEARCHING (REAL) ──
    { name: "ping", async execute(sock, from) { const s = Date.now(); await sock.sendMessage(from, { text: "🏓 Pinging..." }); await sock.sendMessage(from, { text: "🏓 Pong! " + (Date.now() - s) + "ms" }); } },
    { name: "alive", async execute(sock, from) { await sock.sendMessage(from, { text: "✅ " + state.botName + " is alive!" }); } },
    { name: "botinfo", async execute(sock, from, args, msg, extra = {}) { const c = Object.keys(extra.commands || {}).length; await sock.sendMessage(from, { text: `🤖 ${state.botName}\n📦 ${c} commands` }); } },
    { name: "time", async execute(sock, from) { await sock.sendMessage(from, { text: "🕐 " + new Date().toLocaleString() }); } },

    // ── GROUP ADMIN & TOOLS (REAL) ──
    { name: "tagall", async execute(sock, from, args, msg) { if (!from.endsWith("@g.us")) return sock.sendMessage(from, { text: "❌ Group only." }); const sender = msg.key.participant || from; if (!(await isAdmin(sock, from, sender))) return sock.sendMessage(from, { text: "❌ Admin only." }); const meta = await sock.groupMetadata(from); let text = "📢 *Attention Everyone!*\n\n"; const mentions = meta.participants.map(p => p.id); meta.participants.forEach(p => { text += "@" + p.id.split("@")[0] + " "; }); await sock.sendMessage(from, { text, mentions }); } },
    { name: "hidetag", async execute(sock, from, args, msg) { if (!from.endsWith("@g.us")) return sock.sendMessage(from, { text: "❌ Group only." }); const sender = msg.key.participant || from; if (!(await isAdmin(sock, from, sender))) return sock.sendMessage(from, { text: "❌ Admin only." }); const meta = await sock.groupMetadata(from); const mentions = meta.participants.map(p => p.id); await sock.sendMessage(from, { text: args.join(" ") || " ", mentions }); } },
    { name: "groupinfo", async execute(sock, from) { if (!from.endsWith("@g.us")) return sock.sendMessage(from, { text: "❌ Group only." }); const meta = await sock.groupMetadata(from); await sock.sendMessage(from, { text: `📛 *${meta.subject}*\n👥 Members: ${meta.participants.length}\n🆔 JID: ${from}` }); } },
    { name: "admins", async execute(sock, from) { if (!from.endsWith("@g.us")) return sock.sendMessage(from, { text: "❌ Group only." }); const meta = await sock.groupMetadata(from); const admins = meta.participants.filter(p => p.admin).map(p => "@" + p.id.split("@")[0]).join(", "); await sock.sendMessage(from, { text: `👑 *Admins:*\n${admins}`, mentions: admins.split(", ") }); } },

    // ── MEDIA & DOWNLOADER (REAL) ──
    { name: "tiktok", async execute(sock, from, args) { if (!args.length) return sock.sendMessage(from, { text: "❌ .tiktok URL" }); try { const { tiktok } = require("@bochilteam/scraper"); const r = await tiktok(args[0]); const v = r.video || r.nowm; if (v) await sock.sendMessage(from, { video: { url: v }, caption: "📱 TikTok" }); else await sock.sendMessage(from, { text: "❌ Failed" }); } catch (e) { await sock.sendMessage(from, { text: "❌ " + e.message }); } } },
    { name: "instagram", aliases: ["ig"], async execute(sock, from, args) { if (!args.length) return sock.sendMessage(from, { text: "❌ .ig URL" }); try { const { instagram } = require("@bochilteam/scraper"); const r = await instagram(args[0]); const m = r.media || r.video; if (m) { const isV = m.includes(".mp4"); await sock.sendMessage(from, { [isV ? "video" : "image"]: { url: m }, caption: "📸 Instagram" }); } else await sock.sendMessage(from, { text: "❌ Failed" }); } catch (e) { await sock.sendMessage(from, { text: "❌ " + e.message }); } } },
    { name: "yts", async execute(sock, from, args) { if (!args.length) return sock.sendMessage(from, { text: "❌ .yts <query>" }); try { const ytSearch = require("yt-search"); const r = await ytSearch(args.join(" ")); if (!r.videos.length) return sock.sendMessage(from, { text: "❌ No results." }); const v = r.videos[0]; await sock.sendMessage(from, { text: `🔍 *${v.title}*\n⏱️ Duration: ${v.timestamp}\n👀 Views: ${v.views}\n🔗 Link: ${v.url}` }); } catch (e) { await sock.sendMessage(from, { text: "❌ " + e.message }); } } },
    { name: "gitclone", async execute(sock, from, args) { if (!args.length) return sock.sendMessage(from, { text: "❌ .gitclone <owner/repo>" }); try { const parts = args[0].replace("https://github.com/", "").split("/"); const owner = parts[0]; const repo = parts[1].replace(".git", ""); const zipUrl = `https://github.com/${owner}/${repo}/archive/refs/heads/main.zip`; await sock.sendMessage(from, { document: { url: zipUrl }, mimetype: "application/zip", fileName: `${repo}.zip` }); } catch (e) { await sock.sendMessage(from, { text: "❌ " + e.message }); } } },
    { name: "lyrics", async execute(sock, from, args) { if (!args.length) return sock.sendMessage(from, { text: "❌ .lyrics artist - song" }); const parts = args.join(" ").split(" - "); if (parts.length < 2) return sock.sendMessage(from, { text: "❌ Format: .lyrics artist - song" }); try { const res = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(parts[0])}/${encodeURIComponent(parts[1])}`); const data = await res.json(); await sock.sendMessage(from, { text: `🎵 *${parts[1]}* — ${parts[0]}\n\n${data.lyrics ? data.lyrics.slice(0, 3500) : "Not found."}` }); } catch (e) { await sock.sendMessage(from, { text: "❌ " + e.message }); } } },

    // ── CONVERTER & IMAGE EDITING (REAL) ──
    { name: "sticker", async execute(sock, from, args, msg) { const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage; const mediaMsg = quoted?.imageMessage || quoted?.videoMessage || null; if (!mediaMsg) return sock.sendMessage(from, { text: "❌ Reply to an image/video." }); try { const { Sticker, StickerTypes } = require("wa-sticker-formatter"); const buffer = await sock.downloadMediaMessage(msg); const sticker = new Sticker(buffer, { pack: state.botName, author: config.OWNER_NAME, type: StickerTypes.FULL, quality: 80 }); await sock.sendMessage(from, { sticker: await sticker.toBuffer() }); } catch (e) { await sock.sendMessage(from, { text: "❌ " + e.message }); } } },
    { name: "blur", async execute(sock, from, args, msg) { const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage; if (!quoted?.imageMessage) return sock.sendMessage(from, { text: "❌ Reply to an image." }); try { const sharp = global.sharp || require("sharp"); const buffer = await sock.downloadMediaMessage(msg); const edited = await sharp(buffer).blur(10).toBuffer(); await sock.sendMessage(from, { image: edited, caption: "Blurred!" }); } catch (e) { await sock.sendMessage(from, { text: "❌ " + e.message }); } } },

    // ── TEXT EFFECTS (PURE JS - REAL) ──
    { name: "reverse", async execute(sock, from, args) { if (!args.length) return sock.sendMessage(from, { text: "❌ .reverse text" }); await sock.sendMessage(from, { text: args.join(" ").split("").reverse().join("") }); } },
    { name: "binary", async execute(sock, from, args) { if (!args.length) return sock.sendMessage(from, { text: "❌ .binary text" }); const out = args.join(" ").split("").map(c => c.charCodeAt(0).toString(2)).join(" "); await sock.sendMessage(from, { text: out }); } },
    { name: "base64", async execute(sock, from, args) { if (!args.length) return sock.sendMessage(from, { text: "❌ .base64 text" }); const out = Buffer.from(args.join(" ")).toString("base64"); await sock.sendMessage(from, { text: out }); } },
    { name: "morse", async execute(sock, from, args) { if (!args.length) return sock.sendMessage(from, { text: "❌ .morse text" }); const M = { A:".-", B:"-...", C:"-.-.", D:"-..", E:".", F:"..-.", G:"--.", H:"....", I:"..", J:".---", K:"-.-", L:".-..", M:"--", N:"-.", O:"---", P:".--.", Q:"--.-", R:".-.", S:"...", T:"-", U:"..-", V:"...-", W:".--", X:"-..-", Y:"-.--", Z:"--..", "0":"-----", "1":".----", "2":"..---", "3":"...--", "4":"....-", "5":".....", "6":"-....", "7":"--...", "8":"---..", "9":"----." }; const out = args.join(" ").toUpperCase().split("").map(c => M[c] || c).join(" "); await sock.sendMessage(from, { text: out }); } },

    // ── GAMES (REAL LOGIC) ──
    { name: "rps", async execute(sock, from, args) { const moves = ['rock', 'paper', 'scissors']; const user = (args[0] || "").toLowerCase(); if (!moves.includes(user)) return sock.sendMessage(from, { text: "❌ .rps rock|paper|scissors" }); const bot = moves[Math.floor(Math.random() * moves.length)]; let result = "🤝 Draw!"; if ((user === 'rock' && bot === 'scissors') || (user === 'paper' && bot === 'rock') || (user === 'scissors' && bot === 'paper')) result = "🎉 You Win!"; else if (user !== bot) result = "🤖 I Win!"; await sock.sendMessage(from, { text: `You: ${user}\nBot: ${bot}\n\n${result}` }); } },

    // ── AI (REAL, requires GEMINI_API_KEY) ──
    { name: "ai", aliases: ["gpt", "gemini"], async execute(sock, from, args) { if (!args.length) return sock.sendMessage(from, { text: "❌ .ai question?" }); const apiKey = process.env.GEMINI_API_KEY; if (!apiKey) return sock.sendMessage(from, { text: "🤖 Set GEMINI_API_KEY in Render." }); try { const res = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, { contents: [{ parts: [{ text: args.join(" ") }] }] }); const reply = res.data?.candidates?.[0]?.content?.parts?.[0]?.text; await sock.sendMessage(from, { text: reply ? "🤖 " + reply : "🤖 No response." }); } catch (e) { await sock.sendMessage(from, { text: "🤖 Error: " + e.message }); } } }
];
