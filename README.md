# 🌸 Wisteria v2.0 — The Ultimate Fun Discord Bot

A fun, professional Discord bot packed with games, entertainment, and social features for your server!

---

## ✨ What's New in v2.0

- **16+ Commands added** — Wordle, Hangman, Tic-Tac-Toe, Connect 4, Scramble, Math, Type Race, and more!
- **Annoy Auto-Timeout** — Annoy mode now automatically expires after **2 minutes** (per your request)
- **Cooldown System** — Each command has a per-user cooldown to prevent spamming
- **PvP RPS** — Rock Paper Scissors now supports challenging other players
- **XP Leaderboard** — `!leaderboard` shows the top 10 players
- **Trivia Difficulty** — Easy / Medium / Hard with different XP rewards and timers
- **Text Transformers** — UwU, Pirate, Reverse, Mock translators
- **Social Commands** — Ship, Hug, High Five, Pat, Poll, Choose
- **Slots Machine** — Spin and win XP!
- **Truth or Dare** — For server entertainment
- **Enhanced Passive Personality** — More triggers and responses

---

## 🚀 Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Copy `.env.example` to `.env` and fill in your tokens:
```bash
cp .env.example .env
```

```env
DISCORD_TOKEN=your_discord_token_here
TENOR_API_KEY=your_tenor_key_here       # Optional — for !gif
ANTHROPIC_API_KEY=your_anthropic_key    # Optional — for AI-powered !ask
```

### 3. Run
```bash
npm start
# or for development with auto-restart:
npm run dev
```

---

## 🎮 Full Command List

### 🎮 Games
| Command | Description |
|---------|-------------|
| `!rps [@user]` | Rock Paper Scissors — vs Bot or challenge a friend! |
| `!guess [hard]` | Guess the number (1-100, or hard mode 1-1000) |
| `!trivia [easy\|medium\|hard]` | Trivia questions with 3 difficulty levels |
| `!wordle` | Guess the 5-letter word in 6 tries (like the NYT game!) |
| `!hangman` | Classic letter-guessing Hangman |
| `!tictactoe [@user]` | Tic-Tac-Toe vs Bot or another player |
| `!connect4 @user` | Connect 4 — drop pieces and get 4 in a row! |
| `!scramble` | Unscramble the word — first to guess wins |
| `!math [easy\|medium\|hard]` | Race to solve a math problem |
| `!typerace` | Competitive typing race — fastest WPM wins! |
| `!snake [word]` | Word chain game (collaborative) |
| `!hol` | Higher or Lower card game |
| `!mafia start` | Full Mafia party game (4+ players) |

### 🎲 Quick Fun
| Command | Description |
|---------|-------------|
| `!8ball [question]` | Magic 8-Ball |
| `!joke` | Random joke |
| `!fact` | Random fun fact |
| `!flip` | Coin flip |
| `!dice [sides]` | Roll a dice |
| `!slots` | Slot machine — win XP! |
| `!truth` | Truth question for Truth or Dare |
| `!dare` | Dare challenge |
| `!poll Question\|A\|B\|C` | Create a reaction poll |
| `!choose A, B, C` | Let Wisteria decide for you |

### 😂 Social & Reactions
| Command | Description |
|---------|-------------|
| `!compliment [@user]` | Send a compliment 💖 |
| `!roast [@user]` | Friendly roast |
| `!hug @user` | Hug someone |
| `!highfive @user` | High five |
| `!pat @user` | Head pat |
| `!ship [@u1] [@u2]` | Ship two people together |
| `!gif [search]` | Send a GIF |
| `!avatar [@user]` | Get someone's avatar |

### ✨ Text Transformers
| Command | Description |
|---------|-------------|
| `!uwu [text]` | UwU translator |
| `!pirate [text]` | Pirate speak |
| `!reverse [text]` | Reverse text |
| `!mock [text]` | SpongeBob mocking meme |

### 📈 Profile & XP
| Command | Description |
|---------|-------------|
| `!xp [@user]` | View XP and level |
| `!leaderboard` | Server XP leaderboard |
| `!ask [question]` | Ask Wisteria anything |

### 😈 Silly Stuff
| Command | Description |
|---------|-------------|
| `!annoy @user` | Delete someone's messages for **up to 2 minutes** |
| `!stopannoy @user` | Stop annoy mode early |
| `!annoylist` | See who's being annoyed and time remaining |
| `!nickname` | Nickname management |
| `!reactions` | Auto-reaction on mentions |

---

## ⚙️ Annoy Mode Rules

- Any user can use `!annoy @user`
- Annoy mode **automatically expires after exactly 2 minutes** — no need to manually stop
- The countdown is displayed in the activation message
- `!stopannoy @user` stops it early
- `!annoylist` shows remaining time for all active annoys
- Cannot annoy yourself or the bot

---

## 🏆 XP System

- Earn **5-15 XP** per message (60-second cooldown per user to prevent spam)
- Earn **bonus XP** from games:
  - Trivia Easy: +30, Medium: +50, Hard: +100
  - Wordle: up to +250 depending on guesses
  - Slots jackpot: +500
  - Math: +15-60 depending on difficulty
  - Scramble: +40
  - Type Race: based on WPM
- Level up milestone ranks:
  - Level 5: 🌸 Petal Collector
  - Level 10: 💜 Wisteria Friend
  - Level 25: ⭐ Server Star
  - Level 50: 👑 Wisteria Legend

---

## 💜 Bot Permissions Needed

- Read/Send Messages
- Manage Messages (for `!annoy` message deletion)
- Add Reactions
- Embed Links
- Use External Emojis
- Read Message History

---

## 📦 Tech Stack

- **Node.js** ≥ 16.11
- **discord.js** v14
- **dotenv** for environment config
- Optional: **Tenor API** for GIFs
- Optional: **Anthropic API** for AI-powered `!ask`
