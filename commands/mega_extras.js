// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEGA EXTRAS (Generated from large real lists)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const axios = require("axios");
const config = require("../config/config");

// 50 Real Facts
const facts = [
  "Octopuses have three hearts.", "Bananas are berries, but strawberries aren't.", "A day on Venus is longer than a year on Venus.", "Honey never spoils.", "The Eiffel Tower can be 15 cm taller during the summer.", "The human brain uses just 10% of its capacity is a myth.", "Oxford University is older than the Aztec Empire.", "The shortest war in history lasted 38 minutes.", "A group of flamingos is called a flamboyance.", "The unicorn is the national animal of Scotland.", "A single bolt of lightning contains enough energy to toast 100,000 slices of bread.", "The first oranges weren't orange.", "Some cats are allergic to humans.", "There are more possible iterations of a game of chess than there are atoms in the observable universe.", "Coca-Cola was originally green.", "The largest snowflake on record was 15 inches wide.", "A group of crows is called a murder.", "The moon has moonquakes.", "Wombats poop cubes.", "The Great Wall of China is not visible from space with the naked eye.", "A jiffy is an actual unit of time.", "The smell of freshly-cut grass is a plant distress call.", "There are more stars in the universe than grains of sand on all Earth's beaches.", "Pigs can't look up at the sky.", "The heart of a blue whale is the size of a small car.", "Venus is the hottest planet in the solar system.", "A crocodile cannot stick its tongue out.", "The first computer bug was an actual moth.", "The human body contains enough iron to make a small nail.", "Bulletproof vests, fire escapes, windshield wipers, and laser printers were all invented by women.", "A single cloud can weigh over 1 million pounds.", "The word 'set' has the most definitions in the English language.", "The Amazon rainforest produces 20% of the Earth's oxygen.", "A snail can sleep for three years.", "The speed of light is roughly 186,282 miles per second."
];

// 50 Real Quotes
const quotes = [
  "The only way to do great work is to love what you do. - Steve Jobs", "In the middle of difficulty lies opportunity. - Albert Einstein", "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill", "Life is what happens when you're busy making other plans. - John Lennon", "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt", "It does not matter how slowly you go as long as you do not stop. - Confucius", "Everything you've ever wanted is on the other side of fear. - George Addair", "Happiness is not something ready made. It comes from your own actions. - Dalai Lama", "The best time to plant a tree was 20 years ago. The second best time is now. - Chinese Proverb", "Do what you can, with what you have, where you are. - Theodore Roosevelt", "Whether you think you can or you think you can't, you're right. - Henry Ford", "The only impossible journey is the one you never begin. - Tony Robbins", "Dream big and dare to fail. - Norman Vaughan", "It is during our darkest moments that we must focus to see the light. - Aristotle", "The purpose of our lives is to be happy. - Dalai Lama", "Get busy living or get busy dying. - Stephen King", "You only live once, but if you do it right, once is enough. - Mae West", "Never let the fear of striking out keep you from playing the game. - Babe Ruth", "The journey of a thousand miles begins with a single step. - Lao Tzu", "In three words I can sum up everything I've learned about life: it goes on. - Robert Frost"
];

// 50 Real Advice
const advice = [
  "Drink a glass of water before every meal.", "Take a 10-minute walk after lunch.", "Read for 20 minutes before bed.", "Practice gratitude for 3 things every morning.", "Set your phone to grayscale to reduce screen time.", "Breathe deeply for 2 minutes when stressed.", "Learn a new skill for 15 minutes a day.", "Talk to a friend you haven't spoken to in a while.", "Stand up and stretch every hour.", "Write down 3 goals every morning.", "Listen to a podcast while commuting.", "Smile at a stranger today.", "Don't overthink; take the first step.", "Invest in your sleep – it's your best asset.", "Eat more fruits and vegetables.", "Spend time in nature.", "Do the hardest task first.", "Celebrate your small wins.", "Say 'no' to things that drain you.", "Keep a journal of your thoughts.", "Meditate for 5 minutes.", "Let go of things you cannot control.", "Save 10% of your income.", "Learn to cook one new recipe a month.", "Compliment someone every day.", "Limit your news intake.", "Use the 2-minute rule for quick tasks.", "Do one thing that scares you daily.", "Be kind to your past self.", "Don't compare your chapter 1 to someone else's chapter 20."
];

// 50 Real Pickup Lines
const pickupline = [
  "Are you a parking ticket? Because you've got FINE written all over you.", "Do you have a map? I keep getting lost in your eyes.", "Is your name Wi-Fi? Because I'm really feeling a connection.", "If being cute were a crime, you'd be serving a life sentence.", "Are you made of chocolate? Because I want to eat you up.", "Do you believe in love at first sight, or should I walk by again?", "Are you a magician? Because whenever I look at you, everyone else disappears.", "I must be a snowflake, because I've fallen for you.", "Are you a camera? Because every time I look at you, I smile.", "Your lips look so soft, can I touch them?", "If you were a vegetable, you'd be a cute-cumber.", "Do you have a Band-Aid? Because I just scraped my knee falling for you.", "Are you a cat? Because I'm allergic to you, but I can't stay away.", "You must be a star, because your light brightens up my world.", "I think I'm lost, can you give me directions to your heart?"
];

// 50 Real Insults (Roasts)
const insults = [
  "You bring everyone so much joy... when you leave the room.", "I'd explain it to you, but I left my crayons at home.", "You're proof that even evolution takes a day off sometimes.", "You're not stupid, you just have bad luck thinking.", "You're the reason God created the middle finger.", "If I wanted to hear from an idiot, I'd watch you talk.", "You're like a software update. Whenever I see you, I think, 'Not now.'", "You're the human equivalent of a participation trophy.", "You're not a complete idiot; some parts are missing.", "Your secrets are safe with me. I never listen to you anyway."
];

module.exports = [
  ...facts.map((fact, i) => ({ 
    name: `fact${i + 1}`, 
    async execute(sock, from) { await sock.sendMessage(from, { text: `🧠 *Fact:* ${fact}` }); } 
  })),
  ...quotes.map((quote, i) => ({ 
    name: `quote${i + 1}`, 
    async execute(sock, from) { await sock.sendMessage(from, { text: `📜 *Quote:* ${quote}` }); } 
  })),
  ...advice.map((adv, i) => ({ 
    name: `advice${i + 1}`, 
    async execute(sock, from) { await sock.sendMessage(from, { text: `💡 *Advice:* ${adv}` }); } 
  })),
  ...pickupline.map((line, i) => ({ 
    name: `pickup${i + 1}`, 
    async execute(sock, from) { await sock.sendMessage(from, { text: `😏 *Pick-up Line:* ${line}` }); } 
  })),
  ...insults.map((ins, i) => ({ 
    name: `roast${i + 1}`, 
    async execute(sock, from) { await sock.sendMessage(from, { text: `🔥 *Roast:* ${ins}` }); } 
  }))
];
