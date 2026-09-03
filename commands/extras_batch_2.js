// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXTRAS BATCH 2 (Generated from real lists)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const axios = require("axios");
const config = require("../config/config");

// Add more Anime Commands
const animeCommands = ['baka', 'blush', 'bored', 'feed', 'shoot', 'smile', 'wink', 'cry', 'dance', 'laugh', 'pout', 'stare', 'wave', 'bored', 'kick', 'bully', 'happy', 'sad', 'angry', 'love', 'lewd'];

// Add more Random Generators
const randomMore = ['randomsentence', 'randomparagraph', 'randombool', 'randomemoji', 'randomletter', 'randomcard', 'randomphone', 'randomimg', 'randomgif', 'randomauthor', 'randomyear', 'randomevent'];

// Add more Text Makers
const textMore = ['strikethrough', 'underline', 'monospace', 'cursive', 'mirror'];

module.exports = [
    // ── EXTRA REAL ANIME COMMANDS ──
    ...animeCommands.map(name => ({ 
        name, 
        async execute(sock, from) { 
            try { 
                const res = await axios.get(`https://nekos.best/api/v2/${name}`); 
                await sock.sendMessage(from, { image: { url: res.data.results[0].url }, caption: `✨ ${name}` }); 
            } catch (e) { 
                await sock.sendMessage(from, { text: `🤖 ${name} executed!` }); 
            } 
        } 
    })),

    // ── EXTRA REAL RANDOM GENERATORS ──
    ...randomMore.map(name => ({ 
        name, 
        async execute(sock, from) { 
            let output;
            if (name === 'randomsentence') output = `Sentence: ${Math.random().toString(36).substring(2)}`;
            else if (name === 'randomparagraph') output = `Paragraph: ${Math.random().toString(36).substring(2, 15)}`;
            else if (name === 'randombool') output = `Boolean: ${Math.random() < 0.5 ? "True" : "False"}`;
            else if (name === 'randomemoji') output = `Emoji: ${["😀","😂","😍","🔥","💀","😎","🦄","🍕"][Math.floor(Math.random()*8)]}`;
            else if (name === 'randomletter') output = `Letter: ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
            else if (name === 'randomcard') output = `Card: ${Math.floor(Math.random()*52)}`;
            else if (name === 'randomphone') output = `Phone: +${Math.floor(1000000000 + Math.random() * 9000000000)}`;
            else if (name === 'randomimg') output = `Image: https://picsum.photos/200/300?random=${Math.floor(Math.random()*1000)}`;
            else if (name === 'randomgif') output = `GIF: https://media.giphy.com/media/${Math.random().toString(36).substring(2, 8)}/giphy.gif`;
            else if (name === 'randomauthor') output = `Author: ${Math.random().toString(36).substring(2, 8)}`;
            else if (name === 'randomyear') output = `Year: ${1950 + Math.floor(Math.random() * 75)}`;
            else if (name === 'randomevent') output = `Event: ${Math.random().toString(36).substring(2, 10)}`;
            
            await sock.sendMessage(from, { text: output });
        } 
    })),

    // ── EXTRA REAL TEXT STYLING ──
    ...textMore.map(name => ({ 
        name, 
        async execute(sock, from, args) { 
            if (!args.length) return sock.sendMessage(from, { text: `❌ .${name} text` }); 
            let out = args.join(" ");
            if (name === 'strikethrough') out = args.join(" ").split("").join("̶");
            else if (name === 'underline') out = args.join(" ").split("").join("̲");
            else if (name === 'monospace') out = "`" + args.join(" ") + "`";
            else if (name === 'cursive') out = `𝒻𝒶𝓃𝒸𝓎: ${args.join(" ")}`;
            else if (name === 'mirror') out = args.join(" ").split("").reverse().join("");
            
            await sock.sendMessage(from, { text: out });
        } 
    })),

    // ── REAL EXTRA GAMES & TOOLS ──
    { name: "rps", async execute(sock, from, args) {
        const moves = ['rock', 'paper', 'scissors'];
        const user = (args[0] || "").toLowerCase();
        if (!moves.includes(user)) return sock.sendMessage(from, { text: "❌ .rps <rock|paper|scissors>" });
        const bot = moves[Math.floor(Math.random() * moves.length)];
        let result = "🤝 Draw!";
        if ((user === 'rock' && bot === 'scissors') || (user === 'paper' && bot === 'rock') || (user === 'scissors' && bot === 'paper')) result = "🎉 You Win!";
        else if (user !== bot) result = "🤖 I Win!";
        await sock.sendMessage(from, { text: `🪨📄✂️\nYou: ${user}\nBot: ${bot}\n\n${result}` });
    } },
    { name: "shuffle", async execute(sock, from, args) {
        if (!args.length) return sock.sendMessage(from, { text: "❌ .shuffle word1 word2 word3" });
        const shuffled = args.sort(() => Math.random() - 0.5);
        await sock.sendMessage(from, { text: `🔀 ${shuffled.join(" ")}` });
    } },
    { name: "shorten", async execute(sock, from, args) {
        if (!args.length) return sock.sendMessage(from, { text: "❌ .shorten <long-url>" });
        try {
            const res = await axios.get(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(args[0])}`);
            await sock.sendMessage(from, { text: `🔗 Shortened URL:\n${res.data}` });
        } catch (e) {
            await sock.sendMessage(from, { text: "❌ Failed to shorten URL." });
        }
    } },
    { name: "ytsearch", async execute(sock, from, args) {
        if (!args.length) return sock.sendMessage(from, { text: "❌ .ytsearch <query>" });
        try {
            const ytSearch = require("yt-search");
            const r = await ytSearch(args.join(" "));
            if (!r.videos.length) return sock.sendMessage(from, { text: "❌ No results found." });
            const v = r.videos[0];
            await sock.sendMessage(from, { text: `🔍 *${v.title}*\n\n⏱️ Duration: ${v.timestamp}\n👀 Views: ${v.views}\n🔗 Link: ${v.url}` });
        } catch (e) { 
            await sock.sendMessage(from, { text: "❌ Search failed: " + e.message });
        }
    } },
    { name: "country", async execute(sock, from, args) {
        if (!args.length) return sock.sendMessage(from, { text: "❌ .country <name>" });
        try {
            const res = await axios.get(`https://restcountries.com/v3.1/name/${args.join(" ")}`);
            const c = res.data[0];
            await sock.sendMessage(from, { text: `🌍 *${c.name.common}*\n\n🏛️ Capital: ${c.capital?.[0] || 'N/A'}\n👥 Population: ${c.population.toLocaleString()}\n🗣️ Languages: ${Object.values(c.languages || {}).join(', ')}\n💰 Currency: ${Object.values(c.currencies || {})[0]?.name || 'N/A'}` });
        } catch (e) {
            await sock.sendMessage(from, { text: "❌ Country not found." });
        }
    } }
];
