module.exports = [
    {
        name: "ping",
        async execute(sock, from, args, msg, extra) {
            await sock.sendMessage(from, { text: "🏓 Pong! System is working perfectly." });
        }
    },
    {
        name: "alive",
        async execute(sock, from, args, msg, extra) {
            await sock.sendMessage(from, { text: "✅ PRIMACY_SPX_ULTRA is alive and well!" });
        }
    }
];
