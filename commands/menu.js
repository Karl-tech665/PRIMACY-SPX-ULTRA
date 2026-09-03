const { formatUptime, getRAMUsage, getSpeed, animateMessage } = require("../utils/helpers");
const config = require("../config/config");
module.exports = {
    name: "menu", aliases: ["help", "cmds"],
    async execute(sock, from, args, msg, extra = {}) {
        const commands = extra.commands || {};
        const cmdCount = Object.keys(commands).length;
        const frames = [
            "🔄 *LOADING MENU...*\n░░░░░░░░░░ 0%",
            "📂 *Loading Commands...*\n████░░░░░░ 40%",
            "🛡️ *Loading Protection...*\n███████░░░ 70%",
            "✅ *Menu Ready!*\n██████████ 100%",
        ];
        await animateMessage(sock, from, frames, 400);
        const finalMenu = `✦ ${config.BOT_NAME} ✦\n───────────────────────\n📌 Prefix : ${config.PREFIX}\n👑 Owner : ${config.OWNER_NAME}\n📦 Commands : ${cmdCount}\n⏱️ Uptime : ${formatUptime()}\n🧠 RAM : ${getRAMUsage().bar}\n───────────────────────\n🌐 .proxy\n🛡️ .antilink on/off\n📥 .tiktok .ig .yt\n🎮 .rps .ttt\n🧠 .ai .prime\n🐙 .repo\n───────────────────────\n✦ 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 ${config.FOOTER_BRAND} ✦`;
        try { await sock.sendMessage(from, { image: { url: config.MENU_IMAGE }, caption: finalMenu }); } catch (e) {}
    }
};
