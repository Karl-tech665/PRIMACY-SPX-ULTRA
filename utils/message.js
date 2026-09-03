const { formatUptime, getRAMUsage, getSpeed } = require("./helpers");
const config = require("../config/config");

async function sendStylishSuccessMessage(sock, userJid, commands, sessionId) {
    const cmdCount = Object.keys(commands).length;
    const divider = "─────────────────────────";
    let message = `✦ ${config.BOT_NAME} ✦\n*CONNECTED & ACTIVE*\n${divider}\n📱 Connected : ${userJid}\n🤖 Bot Name  : ${config.BOT_NAME}\n📦 Commands  : ${cmdCount}\n⏱️ Uptime    : ${formatUptime()}\n🧠 RAM       : ${getRAMUsage().bar} ${getRAMUsage().percent}%\n⚡ Speed     : ${getSpeed()}\n${divider}\n💾 *SESSION_ID* (save for future deploys):\n` + (sessionId ? "```" + sessionId.slice(0, 50) + "...```\n" : "_(Auto-backup active)_\n") + `${divider}\n✦ 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 ${config.FOOTER_BRAND} ✦`;
    await sock.sendMessage(userJid, { text: message });
}
module.exports = { sendStylishSuccessMessage };
