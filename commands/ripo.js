const config = require("../config/config");
const { animateMessage } = require("../utils/helpers");
const REPO_URL = "https://github.com/Karl-tech665/PRIMACY-SPX-ULTRA";
module.exports = {
    name: "repo", aliases: ["repository", "github"],
    async execute(sock, from) {
        await animateMessage(sock, from, ["🐙 *Connecting...*\n░░░░░░░░░░ 0%", "🐙 *Fetching...*\n██████████ 100%"], 400);
        await sock.sendMessage(from, { text: `🐙 *${config.BOT_NAME}*\n\n🔗 ${REPO_URL}\n⭐ Star and Fork to support!` });
    }
};
