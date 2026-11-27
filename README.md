<div align="center">

  <img src="https://i.imgur.com/C3irQ1X.jpeg" alt="PRIMACY_SPX_ULTRA Banner" width="100%">

  <h1>✦ 𝐏𝐑𝐈𝐌𝐀𝐂𝐘_𝐒𝐏𝐗_𝐔𝐋𝐓𝐑𝐀 ✦</h1>

  <p><strong>Multi-session WhatsApp bot with 150+ commands, built on Baileys</strong></p>

  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.demolab.com?font=Black+Ops+One&size=35&pause=1000&color=9b59b6&center=true&width=800&height=80&lines=PRIMACY+SPX+ULTRA;MULTI+DEVICE+WHATSAPP+BOT;SCRIPTED+BY+SUPREME+PRIME;FORK+AND+STAR+THE+REPO" alt="Typing SVG" />
  </a>

  <br>

  <a href="https://github.com/Karl-tech665/PRIMACY-SPX-ULTRA">
    <img src="https://img.shields.io/github/stars/Karl-tech665/PRIMACY-SPX-ULTRA?style=for-the-badge&color=purple">
  </a>
  <a href="https://github.com/Karl-tech665/PRIMACY-SPX-ULTRA/fork">
    <img src="https://img.shields.io/github/forks/Karl-tech665/PRIMACY-SPX-ULTRA?style=for-the-badge&color=blue">
  </a>
  <a href="https://github.com/Karl-tech665/PRIMACY-SPX-ULTRA/issues">
    <img src="https://img.shields.io/github/issues/Karl-tech665/PRIMACY-SPX-ULTRA?style=for-the-badge&color=red">
  </a>

  <br>

  <img src="https://img.shields.io/badge/Node.js-20%2B-brightgreen?style=flat-square&logo=node.js">
  <img src="https://img.shields.io/badge/Baileys-6.x-blue?style=flat-square">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square">
  <img src="https://img.shields.io/badge/Commands-150%2B-brightgreen?style=flat-square">
  <img src="https://img.shields.io/badge/Protection-MAX-red?style=flat-square">

</div>

---

## 🤖 ABOUT THE BOT

**PRIMACY_SPX_ULTRA** is a **premium, multi-session WhatsApp bot** designed to give you **ultimate control, maximum protection, and endless entertainment**. 

It features a built-in web pairing site, meaning anyone can pair their own number without needing to scan a QR code. It is fully optimized to run on free hosting platforms like Render.

### 💎 Features

- **🌐 Multi-session pairing site.** Anyone can open your website, type their number, and link their own WhatsApp with a pairing code.
- **🔥 150+ commands in 12 sections.** AI, fun, anime, tools, downloaders, converters, group management, admin and more.
- **🧠 AI that works.** `.ai` and `.prime` use Google Gemini (picks a working model automatically) and fall back to a free AI if Gemini is unavailable. `.prime` remembers the conversation.
- **🎙️ Text to speech.** `.say hello` reads your text aloud, in many languages.
- **🛡️ Group tools.** Welcome and goodbye messages, antilink, antispam, tag everyone, polls, promote, demote, kick and more.
- **⚙️ Public or private mode.** `.mode private` makes the bot answer only its owner.
- **🔐 Session ID.** After pairing, the bot sends you a session ID so you can bring the number back online after a redeploy.

---

## 📦 COMMAND SECTIONS

| Section | Examples |
|---------|----------|
| **BASIC** | `.ping` `.alive` `.botinfo` `.uptime` `.time` |
| **GENERAL** | `.owner` `.say` `.calc` `.id` |
| **AI** | `.ai` `.prime` `.imagine` `.summarize` `.grammar` `.rephrase` `.explain` `.code` |
| **FUN** | `.joke` `.fact` `.quote` `.meme` `.trivia` `.riddle` `.8ball` `.ship` `.slot` |
| **ANIME** | `.waifu` `.neko` `.hug` `.pat` `.slap` `.dance` |
| **TOOLS** | `.weather` `.define` `.wiki` `.translate` `.currency` `.crypto` `.qr` `.shorten` `.ssweb` `.tts` `.password` |
| **DOWNLOADER** | `.play` `.ytvideo` `.yts` `.tiktok` `.instagram` `.facebook` `.gitclone` |
| **CONVERTER** | `.sticker` `.toimg` `.blur` `.grayscale` `.vv` `.tourl` |
| **GROUP** | `.tagall` `.hidetag` `.link` `.mute` `.unmute` `.add` `.poll` `.welcome` `.goodbye` |
| **ADMIN** | `.mode` `.settings` `.autoread` `.alwaysonline` `.antilink` `.promote` `.kick` `.block` |
| **REPO** | `.repo` |

> 💡 Type `.menu` to see every command, `.menu list` to see the sections, or `.menu ai` to see just one section.

<div align="center">
  <img src="https://i.imgur.com/C3irQ1X.jpeg" alt="Repo banner" width="400">
</div>

---

## 🚀 DEPLOY ON RENDER

1. **Fork** or upload this repository to your own GitHub account.
2. On [Render](https://render.com), create a **Web Service** from the repository.
3. Use these settings:
   - **Build command:** `npm install`
   - **Start command:** `npm start`
4. Open the **Environment** tab and add the variables below.
5. Deploy. Open your service address, type a WhatsApp number with its country code (no plus sign), and press **Get Pairing Code**.
6. On the phone, open WhatsApp, go to **Linked devices**, tap **Link a device**, then **Link with phone number instead**, and type the code.

### ⚙️ Environment Variables

| Name | Required | What it does |
|------|----------|--------------|
| `OWNER_NUMBER` | **Yes** | Your WhatsApp number with country code, no plus sign (for example `2547XXXXXXXX`) |
| `OWNER_NAME` | No | Name shown on the menu |
| `PREFIX` | No | Command prefix. Default is `.` |
| `GEMINI_API_KEY` | No | Free key from Google AI Studio. Without it the AI uses a slower free fallback |
| `GEMINI_MODEL` | No | Forces one Gemini model. Normally leave it empty |
| `TIMEZONE` | No | For example `Africa/Nairobi`. Used by the menu and `.time` |
| `SESSION_ID` | No | A session ID from the bot, to bring a number back online after a redeploy |
| `NODE_VERSION` | No | Set to `20` if the default Node version causes problems |

---

## ⚠️ FREE HOSTING NOTES

- **Sessions reset on every deploy and restart.** Render's free disk is wiped, so numbers must be paired again, or restored with `SESSION_ID`.
- **The free instance sleeps** after about 15 minutes without visits. A free monitor such as [UptimeRobot](https://uptimerobot.com/) that opens `https://your-app.onrender.com/health` every 5 minutes keeps it awake.
- **The session ID is like a password.** Anyone who has it can control the WhatsApp account. Never share it.

---

## 💻 RUN ON YOUR OWN COMPUTER

```bash
npm install
npm start
