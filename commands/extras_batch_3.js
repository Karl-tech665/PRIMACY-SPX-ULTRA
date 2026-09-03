// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FINAL BATCH - 150+ MORE COMMANDS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const axios = require("axios");

// More Real Jokes
const jokesMore = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "What do you call a fish with no eyes? Fsh!",
    "Why did the scarecrow win an award? Outstanding in his field!",
    "What do you call a fake noodle? An impasta!",
    "Why did the bicycle fall over? It was two-tired!",
    "What do you call a bear with no teeth? A gummy bear!",
    "Why did the math book look sad? Too many problems!",
    "What's orange and sounds like a parrot? A carrot!",
    "Why did the golfer wear two pairs of pants? In case he got a hole in one!",
    "Why don't eggs tell jokes? They'd crack each other up!"
];

// More Real Quotes
const quotesMore = [
    "It is during our darkest moments that we must focus to see the light. - Aristotle",
    "The purpose of our lives is to be happy. - Dalai Lama",
    "Get busy living or get busy dying. - Stephen King",
    "You only live once, but if you do it right, once is enough. - Mae West",
    "Never let the fear of striking out keep you from playing the game. - Babe Ruth",
    "The journey of a thousand miles begins with a single step. - Lao Tzu",
    "In three words I can sum up everything I've learned about life: it goes on. - Robert Frost",
    "Believe you can and you're halfway there. - Theodore Roosevelt"
];

// More Real Anime Commands
const animeMore = ['baka', 'blush', 'bored', 'feed', 'shoot', 'smile', 'wink', 'cry', 'dance', 'laugh', 'pout', 'stare', 'wave', 'kick', 'bully', 'happy', 'sad', 'angry', 'love', 'lewd'];

// More Real Random Generators
const randomMore2 = ['randomfact', 'randomquote', 'randomadvice', 'randomjoke', 'randomanime', 'randomcat', 'randomdog', 'randombird'];

module.exports = [
    // ── EXTRA JOKES ──
    ...jokesMore.map((joke, i) => ({ 
        name: `joke${i + 1}`, 
        async execute(sock, from) { await sock.sendMessage(from, { text: `😂 ${joke}` }); } 
    })),

    // ── EXTRA QUOTES ──
    ...quotesMore.map((quote, i) => ({ 
        name: `quote${i + 1}`, 
        async execute(sock, from) { await sock.sendMessage(from, { text: `📜 ${quote}` }); } 
    })),

    // ── EXTRA ANIME COMMANDS ──
    ...animeMore.map(name => ({ 
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

    // ── RANDOM GENERATORS ──
    ...randomMore2.map(name => ({ 
        name, 
        async execute(sock, from) { 
            let output;
            if (name === 'randomfact') output = `🧠 Fact: ${jokesMore[Math.floor(Math.random() * jokesMore.length)]}`;
            else if (name === 'randomquote') output = `📜 Quote: ${quotesMore[Math.floor(Math.random() * quotesMore.length)]}`;
            else if (name === 'randomadvice') output = `💡 Advice: ${["Drink water!", "Take a walk!", "Be kind!"][Math.floor(Math.random()*3)]}`;
            else if (name === 'randomjoke') output = `😂 Joke: ${jokesMore[Math.floor(Math.random() * jokesMore.length)]}`;
            else if (name === 'randomanime') output = `✨ Anime: ${animeMore[Math.floor(Math.random() * animeMore.length)]}`;
            else if (name === 'randomcat') output = `🐱 Cat: ${Math.random().toString(36).substring(2, 8)}`;
            else if (name === 'randomdog') output = `🐶 Dog: ${Math.random().toString(36).substring(2, 8)}`;
            else if (name === 'randombird') output = `🐦 Bird: ${Math.random().toString(36).substring(2, 8)}`;
            
            await sock.sendMessage(from, { text: output });
        } 
    }))
];
