// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RANDOM GENERATORS & EXTRA FUN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const crypto = require("crypto");
const config = require("../config/config");

module.exports = [
    // ── RANDOM GENERATORS ──
    { name: "randomname", async execute(sock, from) { await sock.sendMessage(from, { text: `Name: ${Math.random().toString(36).substring(2, 8)}` }); } },
    { name: "randomnumber", async execute(sock, from) { await sock.sendMessage(from, { text: `Number: ${Math.floor(Math.random() * 1000000)}` }); } },
    { name: "randomhex", async execute(sock, from) { await sock.sendMessage(from, { text: `Hex: #${Math.floor(Math.random() * 16777215).toString(16)}` }); } },
    { name: "randomuuid", async execute(sock, from) { await sock.sendMessage(from, { text: `UUID: ${crypto.randomUUID()}` }); } },
    { name: "randomip", async execute(sock, from) { await sock.sendMessage(from, { text: `IP: ${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` }); } },
    { name: "randomcolor", async execute(sock, from) { await sock.sendMessage(from, { text: `Color: #${Math.floor(Math.random() * 16777215).toString(16)}` }); } },
    { name: "randompassword", async execute(sock, from) { const len = Math.min(Math.max(parseInt(args[0], 10) || 12, 6), 64); const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"; let out = ""; for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)]; await sock.sendMessage(from, { text: `🔐 ${out}` }); } },

    // ── EXTRA FUN COMMANDS ──
    { name: "wouldyourather", async execute(sock, from) { const options = ["Eat a bug or eat a spider?", "Never use the internet again or never eat pizza again?", "Be able to fly or be invisible?", "Live without music or live without TV?"]; await sock.sendMessage(from, { text: `🤔 Would you rather: ${options[Math.floor(Math.random() * options.length)]}` }); } },
    { name: "dadjoke", async execute(sock, from) { const jokes = ["Why don't scientists trust atoms? Because they make up everything!", "What do you call a fish with no eyes? Fsh!", "Why did the scarecrow win an award? Outstanding in his field!"]; await sock.sendMessage(from, { text: `😆 Dad Joke: ${jokes[Math.floor(Math.random() * jokes.length)]}` }); } },
    { name: "devjoke", async execute(sock, from) { const jokes = ["Why do programmers prefer dark mode? Light attracts bugs!", "There are only 10 types of people in the world: those who understand binary, and those who don't.", "A SQL query walks into a bar, sees two tables and asks: 'Can I join you?'"]; await sock.sendMessage(from, { text: `💻 Dev Joke: ${jokes[Math.floor(Math.random() * jokes.length)]}` }); } },
    { name: "motivation", async execute(sock, from) { const quotes = ["Believe you can and you're halfway there.", "It does not matter how slowly you go as long as you do not stop.", "The only way to do great work is to love what you do.", "Push yourself, because no one else is going to do it for you."]; await sock.sendMessage(from, { text: `💪 Motivation: ${quotes[Math.floor(Math.random() * quotes.length)]}` }); } },
    { name: "affirmation", async execute(sock, from) { const quotes = ["I am worthy of love and respect.", "I am in control of my happiness.", "I am strong and capable.", "I choose to be positive today."]; await sock.sendMessage(from, { text: `✨ Affirmation: ${quotes[Math.floor(Math.random() * quotes.length)]}` }); } },
    { name: "choose", async execute(sock, from, args) { if (args.length < 2) return sock.sendMessage(from, { text: "❌ .choose option1 option2 option3..." }); await sock.sendMessage(from, { text: "👉 " + args[Math.floor(Math.random() * args.length)] }); } },
    { name: "randomnum", aliases: ["rng"], async execute(sock, from, args) { const min = parseInt(args[0], 10) || 1; const max = parseInt(args[1], 10) || 100; await sock.sendMessage(from, { text: `🎲 ${Math.floor(Math.random() * (max - min + 1)) + min}` }); } }
];
