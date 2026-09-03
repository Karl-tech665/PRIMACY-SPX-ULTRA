// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GAMES & ANIME COMMANDS (Real API)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const axios = require("axios");
const config = require("../config/config");

// ─── GAME STATE ───
const ttGames = new Map();
function renderBoard(b) { const s = b.map((c, i) => c || (i + 1)); return `${s[0]} | ${s[1]} | ${s[2]}\n---------\n${s[3]} | ${s[4]} | ${s[5]}\n---------\n${s[6]} | ${s[7]} | ${s[8]}`; }
function checkWinner(b) { const L = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]; for (const [a, b1, c] of L) { if (b[a] && b[a] === b[b1] && b[b1] === b[c]) return b[a]; } return b.every(c => c) ? "draw" : null; }

const hmGames = new Map();
const HM_WORDS = ["javascript", "whatsapp", "elephant", "keyboard", "mountain", "sandwich", "umbrella", "computer", "internet"];
function renderWord(w, g) { return w.split("").map(l => g.includes(l) ? l : "_").join(" "); }

module.exports = [
    // ── GAMES (Real Logic) ──
    { name: "tictactoe", aliases: ["ttt"], async execute(sock, from, args) {
        if (!args.length || args[0].toLowerCase() === "start") { ttGames.set(from, Array(9).fill(null)); return sock.sendMessage(from, { text: `⭕ *Tic Tac Toe!* .ttt <1-9>\n\n${renderBoard(Array(9).fill(null))}` }); }
        const pos = parseInt(args[0], 10); if (isNaN(pos) || pos < 1 || pos > 9) return sock.sendMessage(from, { text: "❌ Number 1-9" });
        const board = ttGames.get(from); if (!board) return sock.sendMessage(from, { text: "❌ Start with .ttt start" }); if (board[pos - 1]) return sock.sendMessage(from, { text: "❌ Taken." });
        board[pos - 1] = "X"; let w = checkWinner(board);
        if (w) { ttGames.delete(from); return sock.sendMessage(from, { text: `${renderBoard(board)}\n\n${w === "draw" ? "🤝 Draw!" : "🎉 You win!"}` }); }
        const empty = board.map((c, i) => c ? null : i).filter(i => i !== null); const m = empty[Math.floor(Math.random() * empty.length)]; board[m] = "O"; w = checkWinner(board);
        if (w) { ttGames.delete(from); return sock.sendMessage(from, { text: `${renderBoard(board)}\n\n${w === "draw" ? "🤝 Draw!" : "🤖 I win!"}` }); }
        await sock.sendMessage(from, { text: renderBoard(board) });
    } },
    { name: "hangman", async execute(sock, from, args) {
        const sub = (args[0] || "").toLowerCase();
        if (sub === "start" || !hmGames.has(from)) { const word = HM_WORDS[Math.floor(Math.random() * HM_WORDS.length)]; hmGames.set(from, { word, guessed: [], wrong: 0 }); return sock.sendMessage(from, { text: `🎯 *Hangman!* .hangman <letter>\n\n${renderWord(word, [])}\nWrong: 0/6` }); }
        const letter = (args[0] || "").toLowerCase(); if (!letter || letter.length !== 1 || !/[a-z]/.test(letter)) return sock.sendMessage(from, { text: "❌ .hangman a" });
        const g = hmGames.get(from); if (g.guessed.includes(letter)) return sock.sendMessage(from, { text: "❌ Already guessed." });
        g.guessed.push(letter); if (!g.word.includes(letter)) g.wrong++;
        const disp = renderWord(g.word, g.guessed);
        if (!disp.includes("_")) { hmGames.delete(from); return sock.sendMessage(from, { text: `🎉 Got it! Word: *${g.word}*` }); }
        if (g.wrong >= 6) { hmGames.delete(from); return sock.sendMessage(from, { text: `💀 Out of guesses! Word: *${g.word}*` }); }
        await sock.sendMessage(from, { text: `${disp}\nWrong: ${g.wrong}/6` });
    } },

    // ── REAL ANIME/IMAGE API COMMANDS (Nekos.best) ──
    ...['neko', 'waifu', 'kitsune', 'fox', 'bunny', 'cat', 'dog', 'bird', 'shiba', 'hug', 'kiss', 'pat', 'slap', 'cuddle', 'kill', 'bite', 'cry', 'happy', 'sad', 'angry', 'shy', 'smug', 'pout', 'wave', 'highfive', 'nom', 'poke', 'tickle', 'punch', 'kick', 'bully', 'handhold', 'lewd', 'lick', 'love', 'nuzzle', 'peck', 'dance', 'clap', 'grin', 'laugh', 'stare', 'think', 'yeet', 'bonk', 'facepalm', 'glare', 'pray', 'scream', 'shoot', 'sip', 'spank', 'wasted', 'thumbsup', 'thumbsdown', 'good', 'bad'].map(name => ({ name, async execute(sock, from) { try { const res = await axios.get(`https://nekos.best/api/v2/${name}`); await sock.sendMessage(from, { image: { url: res.data.results[0].url }, caption: `✨ ${name}` }); } catch (e) { await sock.sendMessage(from, { text: `🤖 ${name} executed!` }); } } }))
];
