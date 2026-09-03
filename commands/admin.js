// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ADMIN, PROTECTION, OWNER & PROFILE COMMANDS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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
    return msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
        || (args[0]?.match(/@?(\d+)/)?.[1] ? args[0].match(/@?(\d+)/)[1] + "@s.whatsapp.net" : null);
}

module.exports = [
    // ── OWNER TOOLS ──
    { name: "setprefix", async execute(sock, from, args, msg) { if (!isOwner(msg.key.participant || from)) return sock.sendMessage(from, { text: "❌ Owner only." }); if (!args.length) return sock.sendMessage(from, { text: "❌ .setprefix ." }); state.set('prefix', args[0]); await sock.sendMessage(from, { text: "✅ Prefix set to: " + args[0] }); } },
    { name: "restart", async execute(sock, from, args, msg) { if (!isOwner(msg.key.participant || from)) return sock.sendMessage(from, { text: "❌ Owner only." }); await sock.sendMessage(from, { text: "♻️ Restarting bot..." }); setTimeout(() => process.exit(0), 2000); } },
    { name: "broadcast", async execute(sock, from, args, msg) { const sender = msg.key.participant || from; if (!isOwner(sender)) return sock.sendMessage(from, { text: "❌ Owner only." }); const text = args.join(" "); if (!text) return sock.sendMessage(from, { text: "❌ .broadcast your message" }); try { const chats = await sock.fetchAllChats(); let count = 0; for (const chat of chats) { if (chat.id) { await sock.sendMessage(chat.id, { text }).catch(() => {}); count++; } } await sock.sendMessage(from, { text: "✅ Broadcast sent to " + count + " chats." }); } catch (e) { await sock.sendMessage(from, { text: "❌ Broadcast failed: " + e.message }); } } },
    
    // ── PROXY & REPO ──
    { name: "proxy", async execute(sock, from) { await sock.sendMessage(from, { text: `🌐 Proxy Link:\n${config.PROXY.LINK}\n📱 More Proxies:\n${config.PROXY.WEBSITE}` }); } },
    { name: "repo", async execute(sock, from) { await sock.sendMessage(from, { text: `🐙 Repo:\nhttps://github.com/Karl-tech665/PRIMACY-SPX-ULTRA` }); } },

    // ── PROTECTION TOGGLES ──
    { name: "antibug", async execute(sock, from, args, msg) { if (!isOwner(msg.key.participant || from)) return sock.sendMessage(from, { text: "❌ Owner only." }); state.set('antibug', !state.get('antibug', true)); await sock.sendMessage(from, { text: "🛡️ Antibug: " + (state.get('antibug') ? "ON" : "OFF") }); } },
    { name: "antilink", async execute(sock, from, args, msg) { if (!isOwner(msg.key.participant || from)) return sock.sendMessage(from, { text: "❌ Owner only." }); state.set('antilink', !state.get('antilink', true)); await sock.sendMessage(from, { text: "🛡️ Antilink: " + (state.get('antilink') ? "ON" : "OFF") }); } },
    { name: "antispam", async execute(sock, from, args, msg) { if (!isOwner(msg.key.participant || from)) return sock.sendMessage(from, { text: "❌ Owner only." }); state.set('antispam', !state.get('antispam', true)); await sock.sendMessage(from, { text: "🛡️ Antispam: " + (state.get('antispam') ? "ON" : "OFF") }); } },

    // ── ADMIN (Group Admin Gated) ──
    { name: "promote", async execute(sock, from, args, msg) { if (!from.endsWith("@g.us")) return sock.sendMessage(from, { text: "❌ Group only." }); const sender = msg.key.participant || from; if (!(await isAdmin(sock, from, sender))) return sock.sendMessage(from, { text: "❌ Admin only." }); const t = extractTarget(args, msg); if (!t) return sock.sendMessage(from, { text: "❌ Mention a user." }); await sock.groupParticipantsUpdate(from, [t], "promote"); await sock.sendMessage(from, { text: "✅ " + t + " promoted!" }); } },
    { name: "demote", async execute(sock, from, args, msg) { if (!from.endsWith("@g.us")) return sock.sendMessage(from, { text: "❌ Group only." }); const sender = msg.key.participant || from; if (!(await isAdmin(sock, from, sender))) return sock.sendMessage(from, { text: "❌ Admin only." }); const t = extractTarget(args, msg); if (!t) return sock.sendMessage(from, { text: "❌ Mention a user." }); await sock.groupParticipantsUpdate(from, [t], "demote"); await sock.sendMessage(from, { text: "✅ " + t + " demoted!" }); } },
    { name: "kick", async execute(sock, from, args, msg) { if (!from.endsWith("@g.us")) return sock.sendMessage(from, { text: "❌ Group only." }); const sender = msg.key.participant || from; if (!(await isAdmin(sock, from, sender))) return sock.sendMessage(from, { text: "❌ Admin only." }); const t = extractTarget(args, msg); if (!t) return sock.sendMessage(from, { text: "❌ Mention a user." }); await sock.groupParticipantsUpdate(from, [t], "remove"); await sock.sendMessage(from, { text: "✅ " + t + " kicked!" }); } },
    { name: "tagall", async execute(sock, from, args, msg) { if (!from.endsWith("@g.us")) return sock.sendMessage(from, { text: "❌ Group only." }); const sender = msg.key.participant || from; if (!(await isAdmin(sock, from, sender))) return sock.sendMessage(from, { text: "❌ Admin only." }); const meta = await sock.groupMetadata(from); let text = "📢 *Attention Everyone!*\n\n"; const mentions = meta.participants.map(p => p.id); meta.participants.forEach(p => { text += "@" + p.id.split("@")[0] + " "; }); await sock.sendMessage(from, { text, mentions }); } },
    { name: "hidetag", async execute(sock, from, args, msg) { if (!from.endsWith("@g.us")) return sock.sendMessage(from, { text: "❌ Group only." }); const sender = msg.key.participant || from; if (!(await isAdmin(sock, from, sender))) return sock.sendMessage(from, { text: "❌ Admin only." }); const meta = await sock.groupMetadata(from); const mentions = meta.participants.map(p => p.id); await sock.sendMessage(from, { text: args.join(" ") || " ", mentions }); } },

    // ── PROFILE (Owner) ──
    { name: "getpp", async execute(sock, from, args) { const jid = args[0]?.match(/@?(\d+)/)?.[1] ? args[0].match(/@?(\d+)/)[1] + "@s.whatsapp.net" : from; try { const pp = await sock.profilePictureUrl(jid, "image"); await sock.sendMessage(from, { image: { url: pp }, caption: "Profile Picture" }); } catch (e) { await sock.sendMessage(from, { text: "❌ No profile picture." }); } } },
    { name: "setpp", async execute(sock, from, args, msg) { if (!isOwner(msg.key.participant || from)) return sock.sendMessage(from, { text: "❌ Owner only." }); const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage; if (!quoted?.imageMessage) return sock.sendMessage(from, { text: "❌ Reply to an image." }); try { const buffer = await sock.downloadMediaMessage(msg); await sock.updateProfilePicture(from, buffer); await sock.sendMessage(from, { text: "✅ Profile picture updated." }); } catch (e) { await sock.sendMessage(from, { text: "❌ Error: " + e.message }); } } },
    { name: "block", async execute(sock, from, args, msg) { if (!isOwner(msg.key.participant || from)) return sock.sendMessage(from, { text: "❌ Owner only." }); const t = extractTarget(args, msg); if (!t) return sock.sendMessage(from, { text: "❌ Mention a user." }); await sock.updateBlockStatus(t, "block"); await sock.sendMessage(from, { text: "✅ Blocked " + t }); } },
    { name: "unblock", async execute(sock, from, args, msg) { if (!isOwner(msg.key.participant || from)) return sock.sendMessage(from, { text: "❌ Owner only." }); const t = extractTarget(args, msg); if (!t) return sock.sendMessage(from, { text: "❌ Mention a user." }); await sock.updateBlockStatus(t, "unblock"); await sock.sendMessage(from, { text: "✅ Unblocked " + t }); } }
];
