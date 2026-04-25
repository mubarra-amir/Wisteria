const {
  Client,
  GatewayIntentBits,
  Collection,
  EmbedBuilder,
} = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// ─────────────────────────────────────────────
//  Wisteria — The Fun Discord Bot 🌸  v2.0
// ─────────────────────────────────────────────

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
  ],
});

client.commands       = new Collection();
client.emojiReactions = new Map(); // userId → emoji
client.annoyedUsers   = new Map(); // guildId → Map<userId, { timer, activatorId, startTime }>
client.cooldowns      = new Map(); // userId → Map<commandName, lastUsedTime>
client.streaks        = new Map(); // userId → { streak, lastDate }

// ── Cooldown Config (seconds) ──────────────────
const COOLDOWNS = {
  default:    5,
  ask:       15,
  gif:       10,
  trivia:     8,
  guess:      5,
  hol:        5,
  rps:        3,
  dice:       3,
  flip:       3,
  "8ball":    5,
  joke:       8,
  fact:       8,
  compliment: 8,
  roast:     10,
  snake:     10,
  wordle:    20,
  hangman:   15,
  math:       5,
  scramble:  10,
  tictactoe: 10,
  connect4:  15,
  typerace:  30,
  truth:      8,
  dare:       8,
  poll:      30,
  choose:     5,
  avatar:     5,
  coinflip:   3,
  slots:     10,
  uwu:        8,
  pirate:     8,
  reverse:    5,
  mock:       8,
  ship:       8,
  hug:        5,
  highfive:   5,
  pat:        5,
};

const PREFIX = '!';
const WISTERIA_COLOR = 0x9B59B6;

// ── Load Commands ──────────────────────────────
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const exported = require(path.join(commandsPath, file));
  const commands = Array.isArray(exported) ? exported : [exported];
  for (const cmd of commands) {
    if (cmd.name) client.commands.set(cmd.name, cmd);
  }
}

// ── Cooldown Helper ────────────────────────────
function checkCooldown(userId, commandName) {
  if (!client.cooldowns.has(userId)) client.cooldowns.set(userId, new Map());
  const userCooldowns = client.cooldowns.get(userId);
  const now = Date.now();
  const cooldownSeconds = COOLDOWNS[commandName] ?? COOLDOWNS.default;
  const cooldownMs = cooldownSeconds * 1000;
  const lastUsed = userCooldowns.get(commandName) || 0;
  const remaining = cooldownMs - (now - lastUsed);

  if (remaining > 0) {
    return Math.ceil(remaining / 1000);
  }
  userCooldowns.set(commandName, now);
  return 0;
}

// ── Passive chat triggers ──────────────────────
const passiveTriggers = [
  {
    keywords: ['wisteria', 'hey wisteria', 'hi wisteria', 'hello wisteria'],
    responses: [
      "Did someone say my name?? 🌸 I'm HERE!!",
      "YES hello hi hey!! 💜 What do you need?",
      "🌸 Wisteria at your service~",
      "omg you called?? I was just vibing 💜",
      "HEYYYY 🌸 What's up??",
    ],
  },
  {
    keywords: ['gg', 'good game', 'wp'],
    responses: [
      "GG!! 🎮 You're literally so good!",
      "GG EZ!! 🌸 (jk you worked for it fr)",
      "GGGG!! 💜 Rematch? 👀",
    ],
    chance: 0.7,
  },
  {
    keywords: ['lol', 'lmao', 'lmfao', 'hahaha'],
    responses: [
      "😂 LMAOOO",
      "bro why is that actually funny 💀",
      "I'm screaming 😭😭",
      "okay that got me 💜",
    ],
    chance: 0.18,
  },
  {
    keywords: ["i'm bored", 'im bored', 'so bored', 'bored af', 'bored lol'],
    responses: [
      "BORED?? We have games!! Try `!rps`, `!trivia`, `!wordle`, `!hangman`, `!connect4`, or `!mafia start` 🎮🌸",
      "Bored?? Impossible!! Type `!gif hype` and let's GO 💜",
      "okay bored is NOT allowed here 🌸 `!typerace` RIGHT NOW go go go",
    ],
  },
  {
    keywords: ['good morning', 'morning everyone', 'morning all', 'gm'],
    responses: [
      "GOOD MORNING!! ☀️🌸 Hope everyone has an amazing day!",
      "GM GM GM!! 💜 Rise and shine, let's have a great day!",
      "Morning!! ☀️ Don't forget to drink water 💜🌸",
    ],
    chance: 0.6,
  },
  {
    keywords: ['good night', 'goodnight', 'night everyone', 'gn'],
    responses: [
      "Goodnight!! 🌙🌸 Sweet dreams everyone~",
      "GN!! 💜 Sleep well!! Come back tomorrow 🌸",
      "Night night!! 🌙 Rest up!!",
    ],
    chance: 0.6,
  },
  {
    keywords: ['sus', 'impostor', 'imposter', 'among us'],
    responses: [
      "👀 wait who's sus?? I'm watching EVERYONE",
      "omg call a meeting 😭 someone's acting real sus rn",
      "the impostor is... *checks notes* ...you 👀🌸",
    ],
    chance: 0.5,
  },
  {
    keywords: ['i love you', 'love u wisteria', 'ily wisteria'],
    responses: [
      "ILY TOO!! 🥺💜 You literally made my day!!",
      "AWWW 🌸 That's the sweetest thing, I love you back!!",
      "okay you just made me malfunction from the cuteness 💜🌸",
    ],
  },
  {
    keywords: ['skill issue', 'L + ratio', 'touch grass', 'cope'],
    responses: [
      "💀 the audacity",
      "okay the callout was real 🌸",
      "ratio attempted... but not accepted 💜",
    ],
    chance: 0.5,
  },
];

// ── Annoy: Auto-timeout after 2 minutes ───────
function scheduleAnnoyTimeout(guildId, targetId, targetName, activatorName, channel) {
  const ANNOY_DURATION = 2 * 60 * 1000; // 2 minutes

  const timer = setTimeout(async () => {
    const guildMap = client.annoyedUsers.get(guildId);
    if (!guildMap || !guildMap.has(targetId)) return;

    guildMap.delete(targetId);
    if (guildMap.size === 0) client.annoyedUsers.delete(guildId);

    try {
      const embed = new EmbedBuilder()
        .setTitle('⏰ Annoy Mode Expired!')
        .setColor(0xFEE75C)
        .setDescription(`The 2-minute annoy timer for **${targetName}** has ended!\n**${targetName}** can now send messages freely again 🌸\n\n*(Annoy mode automatically expires after 2 minutes to keep things fair)*`)
        .setFooter({ text: `Originally activated by ${activatorName} | Wisteria 🌸` });

      await channel.send({ embeds: [embed] });
    } catch { /* channel may be gone */ }
  }, ANNOY_DURATION);

  return timer;
}

// ── Ready ──────────────────────────────────────
client.once('ready', () => {
  console.log(`🌸 Wisteria v2.0 is online as ${client.user.tag}`);
  const activities = [
    { name: '!help | 🌸 Wisteria', type: 0 },
    { name: 'Wordle with friends 🟩', type: 0 },
    { name: '!trivia | Test your brain!', type: 0 },
    { name: 'games with friends 🎮', type: 0 },
  ];
  let i = 0;
  client.user.setActivity(activities[0].name, { type: activities[0].type });
  setInterval(() => {
    i = (i + 1) % activities.length;
    client.user.setActivity(activities[i].name, { type: activities[i].type });
  }, 30000);
});

// ── Message Handler ────────────────────────────
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const guildId = message.guild?.id;

  // ── Annoy system: delete messages ──
  if (guildId && client.annoyedUsers.has(guildId)) {
    const guildMap = client.annoyedUsers.get(guildId);
    if (guildMap.has(message.author.id)) {
      try { await message.delete(); } catch { /* no perms or already deleted */ }
      return;
    }
  }

  // ── Emoji reactions on user mention ──
  if (message.mentions.users.size > 0 && client.emojiReactions.size > 0) {
    for (const [userId, emoji] of client.emojiReactions.entries()) {
      if (message.mentions.users.has(userId)) {
        try {
          const customMatch = emoji.match(/^<a?:(\w+):(\d+)>$/);
          if (customMatch) {
            await message.react(customMatch[2]);
          } else {
            await message.react(emoji);
          }
        } catch (err) {
          console.warn(`[REACT] Failed to react with ${emoji}:`, err.message);
        }
      }
    }
  }

  // ── Passive chat personality ──
  if (!message.content.startsWith(PREFIX)) {
    const lowerContent = message.content.toLowerCase();
    for (const trigger of passiveTriggers) {
      const matches = trigger.keywords.some(k => lowerContent.includes(k));
      if (matches) {
        const chance = trigger.chance ?? 1;
        if (Math.random() < chance) {
          const response = trigger.responses[Math.floor(Math.random() * trigger.responses.length)];
          await message.channel.send(response);
          break;
        }
      }
    }
    return;
  }

  // ── Commands ──
  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);
  if (!command) return;

  // ── Cooldown Check ──
  const remaining = checkCooldown(message.author.id, commandName);
  if (remaining > 0) {
    const cd = await message.reply(`⏳ Slow down! You can use \`!${commandName}\` again in **${remaining}s** 🌸`);
    setTimeout(() => cd.delete().catch(() => {}), 5000);
    return;
  }

  try {
    await command.execute(message, args, client);
  } catch (err) {
    console.error(`[CMD:${commandName}]`, err);
    message.reply('❌ Oops! Something went wrong 😭 Try again in a sec!');
  }
});

// ── Button + Select Menu Interactions ─────────
client.on('interactionCreate', async (interaction) => {
  if (interaction.isButton()) {
    const [action, ...data] = interaction.customId.split(':');

    const buttonHandlers = ['rps', 'hol', 'mafia', 'tictactoe', 'connect4', 'poll', 'typerace'];
    if (buttonHandlers.includes(action)) {
      const cmd = client.commands.get(action);
      if (cmd?.handleButton) await cmd.handleButton(interaction, data, client).catch(console.error);
    }
  }

  if (interaction.isStringSelectMenu()) {
    const [action, ...data] = interaction.customId.split(':');
    const cmd = client.commands.get(action);
    if (cmd?.handleSelect) await cmd.handleSelect(interaction, data, client).catch(console.error);
  }
});

// ── Export helpers so commands can use them ──
client.scheduleAnnoyTimeout = scheduleAnnoyTimeout;

client.login(process.env.DISCORD_TOKEN);