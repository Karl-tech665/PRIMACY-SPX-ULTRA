const { getGroupSettings } = require("./groupSettings");
const { addWarn, resetWarns, MAX_WARNS } = require("./warnStore");
const config = require("../config/config");

const LINK_REGEX = /(https?:\/\/|www\.|chat\.whatsapp\.com|t\.me|wa\.me)/i;
const MAX_TEXT_LENGTH = 3000;
const MAX_MENTIONS = 30;
const recentMessages = {};

async function isSenderAdmin(sock, groupId, senderId) {
    try { const meta = await sock.groupMetadata(groupId); const p = meta.participants.find(x => x.id === senderId); return !!(p && (p.admin === "admin" || p.admin === "superadmin")); }
    catch (e) { return false; }
}
async function deleteMessage(sock, groupId, msg) { try { await sock.sendMessage(groupId, { delete: msg.key }); } catch (e) {} }

async function enforceProtection(sock, groupId, sender, msg, body, content) {
    const settings = getGroupSettings(groupId);
    if (!Object.values(settings).some(Boolean)) return false;
    if (await isSenderAdmin(sock, groupId, sender)) return false;

    if (settings.antibug && body && body.length > MAX_TEXT_LENGTH) { await deleteMessage(sock, groupId, msg); await sock.sendMessage(groupId, { text: `🛡️ Oversized text blocked! @${sender.split("@")[0]}`, mentions: [sender] }); return true; }

    if (settings.antilink && body && LINK_REGEX.test(body)) {
        await deleteMessage(sock, groupId, msg);
        const count = addWarn(groupId, sender);
        if (count >= MAX_WARNS) {
            resetWarns(groupId, sender);
            await sock.groupParticipantsUpdate(groupId, [sender], "remove").catch(() => {});
            await sock.sendMessage(groupId, { text: `🚫 @${sender.split("@")[0]} removed after ${MAX_WARNS} warnings.`, mentions: [sender] });
        } else {
            await sock.sendMessage(groupId, { text: `🔗 Link detected. @${sender.split("@")[0]} warned (${count}/${MAX_WARNS}).`, mentions: [sender] });
        }
        return true;
    }

    const mentioned = content?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (settings.antitag && mentioned.length >= 5) { await deleteMessage(sock, groupId, msg); await sock.sendMessage(groupId, { text: `🚫 Mass tag blocked! @${sender.split("@")[0]}`, mentions: [sender] }); return true; }

    if (settings.antispam) {
        const now = Date.now();
        recentMessages[groupId] = recentMessages[groupId] || {};
        const arr = (recentMessages[groupId][sender] || []).filter(t => now - t < 6000);
        arr.push(now);
        recentMessages[groupId][sender] = arr;
        if (arr.length > 4) { await deleteMessage(sock, groupId, msg); await sock.sendMessage(groupId, { text: `⚠️ Spam detected! @${sender.split("@")[0]}`, mentions: [sender] }); return true; }
    }
    return false;
}
module.exports = { enforceProtection };
