const { EmbedBuilder } = require('discord.js');
const WISTERIA_COLOR = 0x9B59B6; 
// ===================== MAGIC 8-BALL =====================
const eightBallResponses = [
  { text: 'It is certain! ✅', color: 0x57F287 },
  { text: 'Without a doubt! ✅', color: 0x57F287 },
  { text: 'Yes, definitely! ✅', color: 0x57F287 },
  { text: 'You may rely on it! ✅', color: 0x57F287 },
  { text: 'Most likely! ✅', color: 0x57F287 },
  { text: 'Outlook is good! ✅', color: 0x57F287 },
  { text: 'Signs point to yes! ✅', color: 0x57F287 },
  { text: 'Absolutely! 100% yes ✅', color: 0x57F287 },
  { text: 'Reply hazy, try again 🔮', color: 0xFEE75C },
  { text: 'Ask again later 🔮', color: 0xFEE75C },
  { text: 'Cannot predict now 🔮', color: 0xFEE75C },
  { text: 'Concentrate and ask again 🔮', color: 0xFEE75C },
  { text: "Don't count on it ❌", color: 0xED4245 },
  { text: 'My reply is no ❌', color: 0xED4245 },
  { text: 'Outlook not so good ❌', color: 0xED4245 },
  { text: 'Very doubtful ❌', color: 0xED4245 },
  { text: 'My sources say no ❌', color: 0xED4245 },
  { text: 'Absolutely not ❌', color: 0xED4245 },
];

const eightBallCmd = {
  name: '8ball',
  description: 'Ask the Magic 8-Ball',
  async execute(message, args) {
    const question = args.join(' ');
    if (!question) return message.reply('❓ You need to ask a question! e.g. `!8ball Will I be rich?`');

    const response = eightBallResponses[Math.floor(Math.random() * eightBallResponses.length)];
    const embed = new EmbedBuilder()
      .setTitle('🎱 Magic 8-Ball')
      .setColor(response.color)
      .addFields(
        { name: '❓ Question', value: question },
        { name: '🎱 Answer', value: response.text }
      )
      .setFooter({ text: `Asked by ${message.author.username}` });

    message.reply({ embeds: [embed] });
  },
};

// ===================== JOKES =====================
const jokes = [
  ['Why don\'t scientists trust atoms?', 'Because they make up everything! 😂'],
  ['Why did the scarecrow win an award?', 'He was outstanding in his field! 🌾'],
  ['I told my wife she was drawing her eyebrows too high.', 'She looked surprised. 😮'],
  ['What do you call a fish without eyes?', 'A fsh! 🐟'],
  ['Why can\'t you give Elsa a balloon?', 'She\'ll let it go! 🎈'],
  ['Did you hear about the mathematician who\'s afraid of negative numbers?', 'He\'ll stop at nothing to avoid them! 🔢'],
  ['Why do cows wear bells?', 'Because their horns don\'t work! 🐄'],
  ['I asked my dog what 2 minus 2 is.', 'He said nothing. 🐶'],
  ['Why don\'t eggs tell jokes?', 'They\'d crack each other up! 🥚'],
  ['What do you call a sleeping dinosaur?', 'A dino-snore! 🦕'],
  ['Why did the math book look sad?', 'Because it had too many problems! 📚'],
  ['What do you call a bear with no teeth?', 'A gummy bear! 🐻'],
  ['Why did the bicycle fall over?', 'Because it was two-tired! 🚲'],
  ['What do you call cheese that isn\'t yours?', 'Nacho cheese! 🧀'],
  ['I would tell you a joke about paper...', 'But it\'s tearable. 📄'],
  ['Why did the golfer bring extra socks?', 'In case he got a hole in one! 🏌️'],
  ['What do you call a fake noodle?', 'An impasta! 🍝'],
  ['Why did the invisible man turn down the job?', 'He couldn\'t see himself doing it! 👻'],
  ['What do you call a dinosaur that crashes their car?', 'Tyrannosaurus wrecks! 🦖'],
  ['How do you organize a space party?', 'You planet! 🪐'],
  ['Why don\'t skeletons fight each other?', 'They don\'t have the guts! 💀'],
  ['What do you call a can opener that doesn\'t work?', 'A can\'t opener! 🥫'],
  ['Why did the coffee file a police report?', 'It got mugged! ☕'],
  ['How does a penguin build its house?', 'Igloos it together! 🐧'],
  ['Why can\'t your nose be 12 inches long?', 'Then it would be a foot! 👃'],
];

const jokeCmd = {
  name: 'joke',
  description: 'Get a random joke',
  async execute(message) {
    const [setup, punchline] = jokes[Math.floor(Math.random() * jokes.length)];
    const embed = new EmbedBuilder()
      .setTitle('😂 Random Joke!')
      .setColor(0xFEE75C)
      .addFields(
        { name: '🎤 Setup', value: setup },
        { name: '🥁 Punchline', value: `||${punchline}||` }
      )
      .setFooter({ text: 'Click the spoiler to reveal the punchline! 😄' });
    message.reply({ embeds: [embed] });
  },
};

// ===================== COIN FLIP =====================
const flipCmd = {
  name: 'flip',
  description: 'Flip a coin',
  async execute(message) {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    const embed = new EmbedBuilder()
      .setTitle('🎰 Coin Flip!')
      .setColor(0xFEE75C)
      .setDescription(`The coin landed on... **${result}!** ${result === 'Heads' ? '😎' : '🌙'}`)
      .setFooter({ text: `Flipped by ${message.author.username}` });
    message.reply({ embeds: [embed] });
  },
};

// ===================== FUN FACTS =====================
const facts = [
  "A group of flamingos is called a 'flamboyance.' 🦩",
  "Honey never expires. Archaeologists found 3000-year-old honey in Egyptian tombs — still edible! 🍯",
  "Octopuses have three hearts and blue blood. 🐙",
  "A day on Venus is longer than a year on Venus. 🌍",
  "The shortest war in history lasted 38–45 minutes (Anglo-Zanzibar War, 1896). ⚔️",
  "Bananas are slightly radioactive due to potassium-40. 🍌",
  "There are more possible iterations of a game of chess than atoms in the observable universe. ♟️",
  "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid. 🛸",
  "A shrimp's heart is in its head. 🦐",
  "You cannot hum while holding your nose closed. Try it! 👃",
  "The average person walks the equivalent of 3 times around Earth in their lifetime. 🌍",
  "Crows can recognize and remember human faces. 🐦",
  "Wombats produce cube-shaped poop — the only animals that do! 🐨",
  "The Eiffel Tower grows by 15 cm in summer due to thermal expansion. 🗼",
  "Sharks are older than trees. They've been around for ~400 million years. 🦈",
  "Butterflies taste with their feet. 🦋",
  "A bolt of lightning is 5 times hotter than the surface of the sun. ⚡",
  "Hippopotamus milk is pink. 🦛",
  "There are more trees on Earth than stars in the Milky Way. 🌲",
  "Sloths can hold their breath longer than dolphins — up to 40 minutes! 🦥",
  "The human eye can distinguish about 10 million different colors. 👁️",
  "A group of owls is called a parliament. 🦉",
  "Hot water can freeze faster than cold water. This is called the Mpemba effect. 🌡️",
  "Polar bears have black skin under their white fur. 🐻‍❄️",
  "The moon is slowly moving away from Earth — about 3.8 cm per year. 🌙",
];

const factCmd = {
  name: 'fact',
  description: 'Get a random fun fact',
  async execute(message) {
    const fact = facts[Math.floor(Math.random() * facts.length)];
    const embed = new EmbedBuilder()
      .setTitle('🐾 Fun Fact!')
      .setColor(0x5865F2)
      .setDescription(fact)
      .setFooter({ text: `Requested by ${message.author.username}` });
    message.reply({ embeds: [embed] });
  },
};

// ===================== COMPLIMENTS =====================
const compliments = [
  'You light up every room you walk into! ✨',
  'Your kindness is absolutely contagious — keep spreading it! 💖',
  'You have the most amazing energy in this server! 😊',
  'You make this server 10x more fun just by being here! 🎉',
  'If there were an award for being awesome, you\'d win it every day! 🏆',
  'You have incredible vibes that lift everyone around you! ⚡',
  'You\'re seriously one of the most talented people I know! 🌟',
  'The world is genuinely a better place because you\'re in it! 🌍',
  'Your humor is absolutely top-tier! 😂',
  'You\'re proof that legends do exist! 👑',
  'Your brain is as beautiful as your heart! 🧠💖',
  'Anyone lucky enough to know you is genuinely blessed! 🍀',
  'You\'re not just cool — you\'re legendary-level cool. 😎',
  'Honestly? You\'re a vibe. A whole entire vibe. 💜',
  'Your presence here makes everything better, facts only! 🌸',
];

const complimentCmd = {
  name: 'compliment',
  description: 'Send a compliment to someone',
  async execute(message) {
    const target = message.mentions.users.first() || message.author;
    const text = compliments[Math.floor(Math.random() * compliments.length)];
    const embed = new EmbedBuilder()
      .setTitle('💬 Compliment Time! 💖')
      .setColor(0xFF69B4)
      .setDescription(`Hey ${target}! ${text}`)
      .setFooter({ text: `Sent by ${message.author.username}` });
    message.reply({ embeds: [embed] });
  },
};

// ===================== ROASTS =====================
const roasts = [
  'You\'re like a cloud — when you disappear, it\'s a beautiful day! ☁️',
  'I\'d roast you harder, but my mom said I\'m not allowed to burn trash. 🗑️',
  'You\'re not stupid. You just have bad luck thinking. 🧠',
  'I\'d agree with you, but then we\'d both be wrong. 🤷',
  'I\'ve seen better comebacks on a boomerang. 🪃',
  'If brains were dynamite, you wouldn\'t have enough to blow your hat off. 💣',
  'You bring everyone so much joy when you leave the room! 😄',
  'You\'re like a software update — whenever I see you, I think "not now." 💻',
  'I would roast you, but I\'m not good at cooking garbage. 🍳',
  'Your secrets are always safe with me — I never pay attention to anything you say. 🙉',
  'You have your entire life to be a knucklehead. Why not take today off? 🛋️',
  'I\'d give you a nasty look, but you already have one. 👀',
  'You\'re so dramatic, even your shadow rolls its eyes. 🎭',
];

const roastCmd = {
  name: 'roast',
  description: 'Roast someone (friendly!)',
  async execute(message) {
    const target = message.mentions.users.first() || message.author;
    const text = roasts[Math.floor(Math.random() * roasts.length)];
    const embed = new EmbedBuilder()
      .setTitle('🔥 Friendly Roast! 🔥')
      .setColor(0xFF6B00)
      .setDescription(`${target} — ${text}`)
      .setFooter({ text: `Roasted by ${message.author.username} | All in good fun! 😄` });
    message.reply({ embeds: [embed] });
  },
};

// ===================== SHIP =====================
const shipCmd = {
  name: 'ship',
  description: 'Ship two people together and get a compatibility score!',
  async execute(message) {
    const mentions = message.mentions.users;
    let user1, user2;

    if (mentions.size >= 2) {
      [user1, user2] = mentions.values();
    } else if (mentions.size === 1) {
      user1 = message.author;
      user2 = mentions.first();
    } else {
      return message.reply('❓ Usage: `!ship @user1 @user2` or `!ship @user`');
    }

    // Deterministic score based on IDs so it's consistent
    const seed = (BigInt(user1.id) + BigInt(user2.id)) % 101n;
    const score = Number(seed);
    const bar = '💜'.repeat(Math.floor(score / 10)) + '🤍'.repeat(10 - Math.floor(score / 10));

    let verdict;
    if (score >= 90) verdict = 'SOULMATES!! 💍 This is written in the stars!!';
    else if (score >= 75) verdict = 'Super compatible!! 💕 Something special is here~';
    else if (score >= 60) verdict = 'Pretty good match! 💜 There\'s definitely something~';
    else if (score >= 45) verdict = 'It could work... with effort! 🌸 Give it a shot?';
    else if (score >= 30) verdict = 'Hmm... opposites attract maybe? 🤔';
    else if (score >= 15) verdict = 'Not looking great... but stranger things have happened! 😬';
    else verdict = 'Certified disaster duo 💀 But hey, chaos is fun!';

    const shipName = user1.username.slice(0, Math.ceil(user1.username.length / 2)) +
                     user2.username.slice(Math.floor(user2.username.length / 2));

    const embed = new EmbedBuilder()
      .setTitle('💘 Ship Calculator!')
      .setColor(0xFF69B4)
      .setDescription(
        `**${user1.username}** 💜 **${user2.username}**\n\n` +
        `Ship name: **${shipName}**\n\n` +
        `${bar}\n\n` +
        `**${score}%** — ${verdict}`
      )
      .setFooter({ text: `Requested by ${message.author.username} | Wisteria 🌸` });

    message.reply({ embeds: [embed] });
  },
};

// ===================== CHOOSE =====================
const chooseCmd = {
  name: 'choose',
  description: 'Let Wisteria choose between options for you',
  async execute(message, args) {
    const options = args.join(' ').split(/,|\bor\b/i).map(o => o.trim()).filter(Boolean);
    if (options.length < 2) return message.reply('❓ Give me at least 2 options! e.g. `!choose pizza, tacos, burgers`');

    const chosen = options[Math.floor(Math.random() * options.length)];
    const embed = new EmbedBuilder()
      .setTitle('🤔 Wisteria Has Decided!')
      .setColor(WISTERIA_COLOR)
      .setDescription(`From **${options.length}** options... I choose:\n\n# ${chosen}`)
      .addFields({ name: '📋 All options', value: options.map((o, i) => `${i + 1}. ${o}`).join('\n') })
      .setFooter({ text: `Asked by ${message.author.username} | No take-backs! 🌸` });

    message.reply({ embeds: [embed] });
  },
};

// ===================== AVATAR =====================
const avatarCmd = {
  name: 'avatar',
  description: 'Get someone\'s avatar',
  async execute(message) {
    const target = message.mentions.users.first() || message.author;
    const embed = new EmbedBuilder()
      .setTitle(`🖼️ ${target.username}'s Avatar`)
      .setColor(WISTERIA_COLOR)
      .setImage(target.displayAvatarURL({ size: 512, dynamic: true }))
      .setFooter({ text: `Requested by ${message.author.username} | Wisteria 🌸` });
    message.reply({ embeds: [embed] });
  },
};

// ===================== UWU TRANSLATOR =====================
const uwuCmd = {
  name: 'uwu',
  description: 'Translate text to UwU speak',
  async execute(message, args) {
    const text = args.join(' ');
    if (!text) return message.reply('❓ Give me some text! e.g. `!uwu Hello everyone`');

    const uwufied = text
      .replace(/r/g, 'w').replace(/R/g, 'W')
      .replace(/l/g, 'w').replace(/L/g, 'W')
      .replace(/n([aeiou])/g, 'ny$1').replace(/N([aeiou])/g, 'Ny$1')
      .replace(/ove/g, 'uv')
      .replace(/!/g, '! OwO')
      .replace(/\?/g, '? uwu')
      .replace(/\./g, '. *nuzzles*');

    const suffixes = [' OwO', ' UwU', ' ~', ' >w<', ' *blushes*'];
    const finalText = uwufied + suffixes[Math.floor(Math.random() * suffixes.length)];

    const embed = new EmbedBuilder()
      .setTitle('✨ UwU Translator!')
      .setColor(0xFF69B4)
      .addFields(
        { name: '📝 Original', value: text.slice(0, 1024) },
        { name: '🌸 UwU Version', value: finalText.slice(0, 1024) }
      )
      .setFooter({ text: `UwUified by ${message.author.username}` });

    message.reply({ embeds: [embed] });
  },
};

// ===================== PIRATE TRANSLATOR =====================
const pirateMap = {
  'my': 'me', 'is': "be", 'are': 'be', 'you': 'ye', 'your': 'yer', 'yes': 'aye',
  'no': 'nay', 'hello': 'ahoy', 'hi': 'ahoy', 'the': 'th\'', 'friend': 'matey',
  'friends': 'mateys', 'I am': 'I be', 'he is': 'he be', 'she is': 'she be',
  'we are': 'we be', 'they are': 'they be', 'money': 'gold', 'treasure': 'booty',
  'going': "sailin'", 'looking': "lookin'", 'thinking': "thinkin'", 'doing': "doin'",
};

const pirateCmd = {
  name: 'pirate',
  description: 'Translate text to pirate speak! Arrrr!',
  async execute(message, args) {
    const text = args.join(' ');
    if (!text) return message.reply('❓ Give me some text! e.g. `!pirate Hello friend, how are you?`');

    let pirated = text;
    for (const [word, replacement] of Object.entries(pirateMap)) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      pirated = pirated.replace(regex, replacement);
    }
    pirated += ' Arrr!! ⚓';

    const embed = new EmbedBuilder()
      .setTitle('🏴‍☠️ Pirate Translator! Arrr!')
      .setColor(0x8B4513)
      .addFields(
        { name: '📝 Original', value: text.slice(0, 1024) },
        { name: '⚓ Pirate Version', value: pirated.slice(0, 1024) }
      )
      .setFooter({ text: `Pirated by ${message.author.username} | Shiver me timbers!` });

    message.reply({ embeds: [embed] });
  },
};

// ===================== REVERSE =====================
const reverseCmd = {
  name: 'reverse',
  description: 'Reverse a message',
  async execute(message, args) {
    const text = args.join(' ');
    if (!text) return message.reply('❓ Give me something to reverse! e.g. `!reverse Hello World`');
    const reversed = text.split('').reverse().join('');
    const embed = new EmbedBuilder()
      .setTitle('🔄 Reversed!')
      .setColor(WISTERIA_COLOR)
      .addFields(
        { name: '📝 Original', value: text.slice(0, 1024) },
        { name: '🔄 Reversed', value: reversed.slice(0, 1024) }
      )
      .setFooter({ text: `Reversed by ${message.author.username}` });
    message.reply({ embeds: [embed] });
  },
};

// ===================== MOCK =====================
const mockCmd = {
  name: 'mock',
  description: 'Mock someone\'s text (SpOnGeBoB mocking meme)',
  async execute(message, args) {
    const text = args.join(' ');
    if (!text) return message.reply('❓ Give me some text! e.g. `!mock i can do whatever i want`');
    let mocked = '';
    let upper = false;
    for (const char of text) {
      mocked += upper ? char.toUpperCase() : char.toLowerCase();
      if (/[a-z]/i.test(char)) upper = !upper;
    }
    const embed = new EmbedBuilder()
      .setTitle('🐦 SpongeBob Mocking Meme')
      .setColor(0xFEE75C)
      .addFields(
        { name: '📝 Original', value: text.slice(0, 1024) },
        { name: '🐦 Mocked', value: mocked.slice(0, 1024) }
      )
      .setFooter({ text: `Mocked by ${message.author.username}` });
    message.reply({ embeds: [embed] });
  },
};

// ===================== GIF HELPER =====================
async function fetchGif(query) {
  const apiKey = process.env.TENOR_API_KEY;
  if (!apiKey) return null;
  try {
    const encoded = encodeURIComponent(query);
    const url = `https://tenor.googleapis.com/v2/search?q=${encoded}&key=${apiKey}&limit=20&contentfilter=medium`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.results || data.results.length === 0) return null;
    const item = data.results[Math.floor(Math.random() * data.results.length)];
    return item.media_formats?.gif?.url || item.media_formats?.tinygif?.url || null;
  } catch { return null; }
}

function buildIE({ title, color, description, gifUrl, footer }) {
  const embed = new EmbedBuilder()
    .setTitle(title).setColor(color).setDescription(description).setFooter({ text: footer });
  if (gifUrl) embed.setImage(gifUrl);
  return embed;
}

// ===================== INTERACTION COMMANDS =====================

const hugCmd = {
  name: 'hug',
  description: 'Hug someone!',
  async execute(message) {
    const target = message.mentions.users.first();
    if (!target) return message.reply('❓ Mention someone to hug! e.g. `!hug @friend`');
    const queries = ['anime hug wholesome', 'cute hug friends anime', 'warm hug anime'];
    const gifUrl = await fetchGif(queries[Math.floor(Math.random() * queries.length)]);
    const msgs = [
      `**${message.author.username}** wraps **${target.username}** in the warmest hug!! 🤗💜`,
      `**${message.author.username}** squeezes **${target.username}** tight!! 💕`,
      `**${message.author.username}** gives **${target.username}** a big ol' bear hug!! 🐻💜`,
    ];
    message.reply({ embeds: [buildIE({ title: '🤗 Hug!', color: 0xFF69B4, description: msgs[Math.floor(Math.random() * msgs.length)], gifUrl, footer: 'Spread the love! 🌸' })] });
  },
};

const patCmd = {
  name: 'pat',
  description: 'Pat someone on the head!',
  async execute(message) {
    const target = message.mentions.users.first();
    if (!target) return message.reply('❓ Mention someone to pat! e.g. `!pat @friend`');
    const queries = ['anime headpat', 'pat on head cute anime', 'headpat wholesome'];
    const gifUrl = await fetchGif(queries[Math.floor(Math.random() * queries.length)]);
    const msgs = [
      `**${message.author.username}** pats **${target.username}** on the head! ✋\n*pat pat* You're doing great sweetie! 🌸`,
      `**${message.author.username}** gives **${target.username}** the gentlest headpats! 🌸`,
      `**${message.author.username}** *pat pat pat* — **${target.username}** you are loved!! 💜`,
    ];
    message.reply({ embeds: [buildIE({ title: '✋ Headpat!', color: 0xFF69B4, description: msgs[Math.floor(Math.random() * msgs.length)], gifUrl, footer: 'So wholesome 💜' })] });
  },
};

const highfiveCmd = {
  name: 'highfive',
  description: 'High five someone!',
  async execute(message) {
    const target = message.mentions.users.first();
    if (!target) return message.reply('❓ Mention someone to high five! e.g. `!highfive @friend`');
    const queries = ['high five anime', 'high five celebration', 'high five friends'];
    const gifUrl = await fetchGif(queries[Math.floor(Math.random() * queries.length)]);
    const msgs = [
      `**${message.author.username}** gives **${target.username}** a MASSIVE high five!! 🙌✨`,
      `**${message.author.username}** and **${target.username}** — SLAP!! What a team!! 🙌`,
      `**${message.author.username}** launches a high five at **${target.username}**!! Don't leave them hanging! 🙌`,
    ];
    message.reply({ embeds: [buildIE({ title: '🙌 High Five!', color: 0xFEE75C, description: msgs[Math.floor(Math.random() * msgs.length)], gifUrl, footer: 'Squad goals! 🌸' })] });
  },
};

const slapCmd = {
  name: 'slap',
  description: 'Slap someone!',
  async execute(message) {
    const target = message.mentions.users.first();
    if (!target) return message.reply('❓ Mention someone to slap! e.g. `!slap @friend`');
    const queries = ['anime slap funny', 'slap reaction anime', 'slap meme anime'];
    const gifUrl = await fetchGif(queries[Math.floor(Math.random() * queries.length)]);
    const msgs = [
      `**${message.author.username}** SLAPS **${target.username}** across the face!! 👋💥`,
      `**${message.author.username}** sends **${target.username}** flying with a slap!! 👋😤`,
      `**${message.author.username}** delivers a thunderous slap to **${target.username}**!! 👋`,
    ];
    message.reply({ embeds: [buildIE({ title: '👋 SLAP!!', color: 0xED4245, description: msgs[Math.floor(Math.random() * msgs.length)], gifUrl, footer: 'Ouch! All in good fun 😄 | Wisteria 🌸' })] });
  },
};

const hitCmd = {
  name: 'hit',
  description: 'Hit someone!',
  async execute(message) {
    const target = message.mentions.users.first();
    if (!target) return message.reply('❓ Mention someone to hit! e.g. `!hit @friend`');
    const queries = ['anime bonk hit funny', 'bonk anime meme', 'hit anime funny'];
    const gifUrl = await fetchGif(queries[Math.floor(Math.random() * queries.length)]);
    const msgs = [
      `**${message.author.username}** hits **${target.username}** with maximum force!! 💥`,
      `**${message.author.username}** BONKS **${target.username}** on the head!! 🔨`,
      `**${message.author.username}** takes a swing at **${target.username}**!! 💢`,
    ];
    message.reply({ embeds: [buildIE({ title: '💥 HIT!!', color: 0xFF6B00, description: msgs[Math.floor(Math.random() * msgs.length)], gifUrl, footer: 'Bonk! | Wisteria 🌸' })] });
  },
};

const punchCmd = {
  name: 'punch',
  description: 'Punch someone!',
  async execute(message) {
    const target = message.mentions.users.first();
    if (!target) return message.reply('❓ Mention someone to punch! e.g. `!punch @friend`');
    const queries = ['anime punch action', 'punch meme funny anime', 'anime fist punch'];
    const gifUrl = await fetchGif(queries[Math.floor(Math.random() * queries.length)]);
    const msgs = [
      `**${message.author.username}** punches **${target.username}** straight into the stratosphere!! 👊💥`,
      `**${message.author.username}** delivers a DEVASTATING punch to **${target.username}**!! 👊`,
      `**${message.author.username}** winds up and DECKS **${target.username}**!! 👊💢`,
    ];
    message.reply({ embeds: [buildIE({ title: '👊 PUNCH!!', color: 0xED4245, description: msgs[Math.floor(Math.random() * msgs.length)], gifUrl, footer: 'BOOM! | Wisteria 🌸' })] });
  },
};

const kickfunCmd = {
  name: 'kickfun',
  description: 'Kick someone (fun, not moderation)! Use !kickfun @user',
  async execute(message) {
    const target = message.mentions.users.first();
    if (!target) return message.reply('❓ Mention someone to kick! e.g. `!kickfun @friend`');
    const queries = ['anime kick action', 'roundhouse kick anime', 'kick flying anime'];
    const gifUrl = await fetchGif(queries[Math.floor(Math.random() * queries.length)]);
    const msgs = [
      `**${message.author.username}** delivers a flying kick to **${target.username}**!! 🦵💨`,
      `**${message.author.username}** kicks **${target.username}** into next week!! 🦵`,
      `**${message.author.username}** launches a roundhouse kick at **${target.username}**!! 🦵💥`,
    ];
    message.reply({ embeds: [buildIE({ title: '🦵 KICK!!', color: 0xFF6B00, description: msgs[Math.floor(Math.random() * msgs.length)], gifUrl, footer: 'POW! | Wisteria 🌸' })] });
  },
};

const meowCmd = {
  name: 'meow',
  description: 'Meow at someone!',
  async execute(message) {
    const target = message.mentions.users.first();
    const queries = ['cat meow cute', 'anime cat meow', 'cute cat gif'];
    const gifUrl = await fetchGif(queries[Math.floor(Math.random() * queries.length)]);
    const msgs = target ? [
      `**${message.author.username}** meows at **${target.username}**!! 🐱 *mrrrow~*`,
      `**${message.author.username}** 🐱 MEOW!! **${target.username}** notices! UwU`,
      `**${message.author.username}** demands attention from **${target.username}** via meow!! 🐾`,
    ] : [
      `**${message.author.username}** just meowed at the entire server!! 🐱`,
      `MEOW!! **${message.author.username}** has activated cat mode 🐾`,
      `**${message.author.username}**: *mrrrow~* 🐱`,
    ];
    message.reply({ embeds: [buildIE({ title: '🐱 MEOW!!', color: 0xFF69B4, description: msgs[Math.floor(Math.random() * msgs.length)], gifUrl, footer: 'Nyaa~ 🐾 | Wisteria 🌸' })] });
  },
};

const clapCmd = {
  name: 'clap',
  description: 'Clap for someone!',
  async execute(message) {
    const target = message.mentions.users.first();
    const queries = ['clapping applause anime', 'slow clap meme', 'applause standing ovation'];
    const gifUrl = await fetchGif(queries[Math.floor(Math.random() * queries.length)]);
    const desc = target
      ? `**${message.author.username}** claps enthusiastically for **${target.username}**!! 👏✨`
      : `**${message.author.username}** starts a standing ovation!! 👏`;
    message.reply({ embeds: [buildIE({ title: '👏 CLAP CLAP CLAP!!', color: 0xFEE75C, description: desc, gifUrl, footer: 'Bravo!! 🌸' })] });
  },
};

const insultLines = [
  "You're the human equivalent of a participation trophy. 🏆",
  "I'd explain it to you, but I left my crayons at home. 🖍️",
  "You're not stupid — you just have really bad luck thinking. 🧠",
  "You're like a software update — whenever I see you, I think 'not now.' 💻",
  "Your birth certificate is an apology letter from the hospital. 📃",
  "I'd roast you, but I'm not good at cooking garbage. 🍳",
  "You have the energy of a damp paper towel. 🪣",
  "You're proof that even evolution makes mistakes sometimes. 🦕",
  "Your IQ test results came back — negative. 📊",
  "You're like a Monday — nobody actually wants you. 📅",
  "You're so slow, you could be overtaken by a parked car. 🚗",
  "I've seen better comebacks on a boomerang. 🪃",
  "You bring everyone so much joy when you leave the room. 😄",
  "I would roast you, but my mom said I'm not allowed to burn trash. 🗑️",
  "If brains were dynamite, you wouldn't have enough to blow your hat off. 💣",
];

const insultCmd = {
  name: 'insult',
  description: 'Roast/insult someone (all in good fun!)',
  async execute(message) {
    const target = message.mentions.users.first() || message.author;
    const queries = ['roast burn reaction anime', 'oh no reaction anime', 'oof reaction meme'];
    const gifUrl = await fetchGif(queries[Math.floor(Math.random() * queries.length)]);
    const insult = insultLines[Math.floor(Math.random() * insultLines.length)];
    message.reply({ embeds: [buildIE({ title: '🔥 Ooh, That Hurt!!', color: 0xFF6B00, description: `${target} — ${insult}`, gifUrl, footer: `Roasted by ${message.author.username} | All in good fun 😄 | Wisteria 🌸` })] });
  },
};

const waveCmd = {
  name: 'wave',
  description: 'Wave at someone!',
  async execute(message) {
    const target = message.mentions.users.first();
    const queries = ['anime wave hello', 'waving hand anime cute', 'wave hi anime'];
    const gifUrl = await fetchGif(queries[Math.floor(Math.random() * queries.length)]);
    const desc = target
      ? `**${message.author.username}** waves hello at **${target.username}**!! 👋😊`
      : `**${message.author.username}** waves at the whole server!! 👋`;
    message.reply({ embeds: [buildIE({ title: '👋 WAVE!!', color: 0x57F287, description: desc, gifUrl, footer: 'Heyy!! 🌸' })] });
  },
};

const pokeCmd = {
  name: 'poke',
  description: 'Poke someone!',
  async execute(message) {
    const target = message.mentions.users.first();
    if (!target) return message.reply('❓ Mention someone to poke! e.g. `!poke @friend`');
    const queries = ['anime poke funny', 'poke reaction anime', 'finger poke anime'];
    const gifUrl = await fetchGif(queries[Math.floor(Math.random() * queries.length)]);
    const msgs = [
      `**${message.author.username}** pokes **${target.username}**!! 👉 *boop*`,
      `**${message.author.username}** keeps poking **${target.username}**... relentlessly 👉👉`,
      `**${message.author.username}** gives **${target.username}** the most annoying poke!! 👉`,
    ];
    message.reply({ embeds: [buildIE({ title: '👉 POKE!!', color: 0xFEE75C, description: msgs[Math.floor(Math.random() * msgs.length)], gifUrl, footer: '*boop* | Wisteria 🌸' })] });
  },
};

const boopCmd = {
  name: 'boop',
  description: 'Boop someone on the nose!',
  async execute(message) {
    const target = message.mentions.users.first();
    if (!target) return message.reply('❓ Mention someone to boop! e.g. `!boop @friend`');
    const queries = ['boop nose anime cute', 'nose boop cat', 'anime boop cute'];
    const gifUrl = await fetchGif(queries[Math.floor(Math.random() * queries.length)]);
    message.reply({ embeds: [buildIE({ title: '👆 BOOP!!', color: 0xFF69B4, description: `**${message.author.username}** boops **${target.username}** right on the nose!! 👆✨\n*boop!*`, gifUrl, footer: 'Gotcha! 🌸' })] });
  },
};

const cuddleCmd = {
  name: 'cuddle',
  description: 'Cuddle someone!',
  async execute(message) {
    const target = message.mentions.users.first();
    if (!target) return message.reply('❓ Mention someone to cuddle! e.g. `!cuddle @friend`');
    const queries = ['anime cuddle wholesome', 'cuddle cute anime', 'snuggle anime'];
    const gifUrl = await fetchGif(queries[Math.floor(Math.random() * queries.length)]);
    const msgs = [
      `**${message.author.username}** snuggles up to **${target.username}** 🥺💜`,
      `**${message.author.username}** curls up and cuddles **${target.username}**!! So wholesome 💕`,
      `**${message.author.username}** and **${target.username}** — cuddle time!! 🌸`,
    ];
    message.reply({ embeds: [buildIE({ title: '🥺 Cuddle Time!!', color: 0xFF69B4, description: msgs[Math.floor(Math.random() * msgs.length)], gifUrl, footer: 'Wholesome 100 💜 | Wisteria 🌸' })] });
  },
};

const biteCmd = {
  name: 'bite',
  description: 'Bite someone!',
  async execute(message) {
    const target = message.mentions.users.first();
    if (!target) return message.reply('❓ Mention someone to bite! e.g. `!bite @friend`');
    const queries = ['anime bite funny', 'nom nom bite anime', 'playful bite anime'];
    const gifUrl = await fetchGif(queries[Math.floor(Math.random() * queries.length)]);
    const msgs = [
      `**${message.author.username}** bites **${target.username}**!! NOM NOM 😤`,
      `**${message.author.username}** chomps down on **${target.username}**!! 🦷`,
      `**${message.author.username}** takes a big bite of **${target.username}**!! 😬`,
    ];
    message.reply({ embeds: [buildIE({ title: '😤 CHOMP!!', color: 0xED4245, description: msgs[Math.floor(Math.random() * msgs.length)], gifUrl, footer: 'NOM! | Wisteria 🌸' })] });
  },
};

const lickCmd = {
  name: 'lick',
  description: 'Lick someone (weird but funny)!',
  async execute(message) {
    const target = message.mentions.users.first();
    if (!target) return message.reply('❓ Mention someone to lick! e.g. `!lick @friend`');
    const queries = ['anime lick funny', 'lick reaction anime', 'cat lick anime'];
    const gifUrl = await fetchGif(queries[Math.floor(Math.random() * queries.length)]);
    const msgs = [
      `**${message.author.username}** licks **${target.username}**... why tho 👅`,
      `**${message.author.username}** just straight up licked **${target.username}**. Iconic 👅`,
      `**${message.author.username}** licks **${target.username}** like a cat 😼`,
    ];
    message.reply({ embeds: [buildIE({ title: '👅 LICK!!', color: 0xFF69B4, description: msgs[Math.floor(Math.random() * msgs.length)], gifUrl, footer: 'Why are you like this 😭 | Wisteria 🌸' })] });
  },
};

const stareCmd = {
  name: 'stare',
  description: 'Stare at someone intensely!',
  async execute(message) {
    const target = message.mentions.users.first();
    const queries = ['anime intense stare', 'staring meme anime', 'creepy stare anime'];
    const gifUrl = await fetchGif(queries[Math.floor(Math.random() * queries.length)]);
    const desc = target
      ? `**${message.author.username}** stares INTENSELY at **${target.username}**... 👀`
      : `**${message.author.username}** stares into the void... 👀`;
    message.reply({ embeds: [buildIE({ title: '👀 STARING!!', color: 0x5865F2, description: desc, gifUrl, footer: '...👀... | Wisteria 🌸' })] });
  },
};

const cryCmd = {
  name: 'cry',
  description: 'Cry dramatically!',
  async execute(message) {
    const target = message.mentions.users.first();
    const queries = ['anime crying dramatic', 'sobbing anime', 'cry tears anime'];
    const gifUrl = await fetchGif(queries[Math.floor(Math.random() * queries.length)]);
    const desc = target
      ? `**${message.author.username}** cries because of **${target.username}** 😭💔`
      : `**${message.author.username}** is sobbing uncontrollably 😭`;
    message.reply({ embeds: [buildIE({ title: '😭 CRYING!!', color: 0x5865F2, description: desc, gifUrl, footer: "It's okay to cry 💜 | Wisteria 🌸" })] });
  },
};

const blushCmd = {
  name: 'blush',
  description: 'Blush at someone!',
  async execute(message) {
    const target = message.mentions.users.first();
    const queries = ['anime blush embarrassed', 'blushing anime cute', 'embarrassed blush anime'];
    const gifUrl = await fetchGif(queries[Math.floor(Math.random() * queries.length)]);
    const desc = target
      ? `**${message.author.username}** blushes when looking at **${target.username}**!! 😳💕`
      : `**${message.author.username}** is blushing really hard right now 😳`;
    message.reply({ embeds: [buildIE({ title: '😳 BLUSH!!', color: 0xFF69B4, description: desc, gifUrl, footer: 'Awww 💜 | Wisteria 🌸' })] });
  },
};

const danceCmd = {
  name: 'dance',
  description: 'Dance with someone or alone!',
  async execute(message) {
    const target = message.mentions.users.first();
    const queries = ['anime dance happy', 'dance celebration anime', 'cute dance anime'];
    const gifUrl = await fetchGif(queries[Math.floor(Math.random() * queries.length)]);
    const desc = target
      ? `**${message.author.username}** grabs **${target.username}** and they start dancing!! 💃🕺`
      : `**${message.author.username}** busts out the most incredible dance moves!! 💃`;
    message.reply({ embeds: [buildIE({ title: '💃 DANCE PARTY!!', color: 0x9B59B6, description: desc, gifUrl, footer: 'Get it!! 🌸' })] });
  },
};

const winkCmd = {
  name: 'wink',
  description: 'Wink at someone!',
  async execute(message) {
    const target = message.mentions.users.first();
    const queries = ['anime wink cute', 'wink reaction anime', 'smirk wink anime'];
    const gifUrl = await fetchGif(queries[Math.floor(Math.random() * queries.length)]);
    const desc = target
      ? `**${message.author.username}** winks at **${target.username}** 😉💜`
      : `**${message.author.username}** winks mysteriously 😉`;
    message.reply({ embeds: [buildIE({ title: '😉 WINK!!', color: 0xFEE75C, description: desc, gifUrl, footer: '😉 | Wisteria 🌸' })] });
  },
};

const smugCmd = {
  name: 'smug',
  description: 'Make a smug face!',
  async execute(message) {
    const queries = ['anime smug face', 'smug expression anime', 'anime smirk smug'];
    const gifUrl = await fetchGif(queries[Math.floor(Math.random() * queries.length)]);
    const msgs = [
      `**${message.author.username}** puts on the smuggest face imaginable 😏`,
      `**${message.author.username}** is feeling VERY smug right now 😏✨`,
      `**${message.author.username}** 😏 they know something you don't`,
    ];
    message.reply({ embeds: [buildIE({ title: '😏 SMUG MODE!!', color: 0x9B59B6, description: msgs[Math.floor(Math.random() * msgs.length)], gifUrl, footer: '😏 | Wisteria 🌸' })] });
  },
};

const facepalmCmd = {
  name: 'facepalm',
  description: 'Facepalm at someone!',
  async execute(message) {
    const target = message.mentions.users.first();
    const queries = ['anime facepalm reaction', 'facepalm disappointed anime', 'oh no facepalm'];
    const gifUrl = await fetchGif(queries[Math.floor(Math.random() * queries.length)]);
    const desc = target
      ? `**${message.author.username}** facepalms because of **${target.username}** 🤦`
      : `**${message.author.username}** facepalms at everything 🤦`;
    message.reply({ embeds: [buildIE({ title: '🤦 FACEPALM!!', color: 0xED4245, description: desc, gifUrl, footer: 'Why... | Wisteria 🌸' })] });
  },
};

const throwCmd = {
  name: 'throw',
  description: 'Throw something at someone!',
  async execute(message) {
    const target = message.mentions.users.first();
    if (!target) return message.reply('❓ Mention someone to throw at! e.g. `!throw @friend`');
    const items = ['🍅 a tomato', '🧸 a teddy bear', '🍕 a pizza slice', '🎸 a guitar', '🧊 an ice cube', '🎂 a cake', '🥾 a boot', '🪣 a bucket of water', '🥚 an egg', '🎃 a pumpkin'];
    const item = items[Math.floor(Math.random() * items.length)];
    const queries = ['anime throw funny', 'throwing object anime', 'yeet throw anime'];
    const gifUrl = await fetchGif(queries[Math.floor(Math.random() * queries.length)]);
    message.reply({ embeds: [buildIE({ title: '🎯 YEET!!', color: 0xFF6B00, description: `**${message.author.username}** throws ${item} at **${target.username}**!! YEET!! 🎯`, gifUrl, footer: 'YEETED! | Wisteria 🌸' })] });
  },
};

const shrugCmd = {
  name: 'shrug',
  description: 'Shrug!',
  async execute(message) {
    const queries = ['anime shrug whatever', 'shrug reaction anime', 'whatever shrug anime'];
    const gifUrl = await fetchGif(queries[Math.floor(Math.random() * queries.length)]);
    const msgs = [
      `**${message.author.username}** shrugs. ¯\\_(ツ)_/¯`,
      `**${message.author.username}**: "idk lol" 🤷`,
      `**${message.author.username}** doesn't know, doesn't care 🤷`,
    ];
    message.reply({ embeds: [buildIE({ title: '🤷 SHRUG!!', color: WISTERIA_COLOR, description: msgs[Math.floor(Math.random() * msgs.length)], gifUrl, footer: '¯\\_(ツ)_/¯ | Wisteria 🌸' })] });
  },
};

const screamCmd = {
  name: 'scream',
  description: 'SCREAM!!',
  async execute(message) {
    const queries = ['anime scream reaction', 'screaming anime funny', 'loud scream anime'];
    const gifUrl = await fetchGif(queries[Math.floor(Math.random() * queries.length)]);
    const msgs = [
      `**${message.author.username}** is SCREAMING into the void!! AAAAAAAAAA 😱`,
      `**${message.author.username}**: AAAAAAAAAAAAAAAA 😱💀`,
      `**${message.author.username}** lets out an INHUMAN scream 😱`,
    ];
    message.reply({ embeds: [buildIE({ title: '😱 AAAAAAAAA!!', color: 0xED4245, description: msgs[Math.floor(Math.random() * msgs.length)], gifUrl, footer: 'AAAAA | Wisteria 🌸' })] });
  },
};

const confusedCmd = {
  name: 'confused',
  description: 'React with confusion!',
  async execute(message) {
    const queries = ['anime confused reaction', 'confused math meme', 'what confused anime'];
    const gifUrl = await fetchGif(queries[Math.floor(Math.random() * queries.length)]);
    const msgs = [
      `**${message.author.username}** has absolutely no idea what's going on 😵`,
      `**${message.author.username}**: "Wait... what??" 😕`,
      `**${message.author.username}** is completely and utterly confused rn 🤔`,
    ];
    message.reply({ embeds: [buildIE({ title: '😵 CONFUSED!!', color: 0xFEE75C, description: msgs[Math.floor(Math.random() * msgs.length)], gifUrl, footer: 'What is happening | Wisteria 🌸' })] });
  },
};

const shockedCmd = {
  name: 'shocked',
  description: 'React with shock!',
  async execute(message) {
    const queries = ['anime shocked reaction', 'omg shocked anime', 'gasp shocked anime'];
    const gifUrl = await fetchGif(queries[Math.floor(Math.random() * queries.length)]);
    const msgs = [
      `**${message.author.username}** is absolutely SHOCKED!! 😱`,
      `**${message.author.username}**: *GASP* 😱`,
      `**${message.author.username}** cannot believe what just happened!! 😱`,
    ];
    message.reply({ embeds: [buildIE({ title: '😱 SHOCKED!!', color: 0xED4245, description: msgs[Math.floor(Math.random() * msgs.length)], gifUrl, footer: 'OMG!! | Wisteria 🌸' })] });
  },
};

const laughCmd = {
  name: 'laugh',
  description: 'Laugh at something!',
  async execute(message) {
    const target = message.mentions.users.first();
    const queries = ['laughing anime lol', 'lmao laugh anime', 'anime laughing funny'];
    const gifUrl = await fetchGif(queries[Math.floor(Math.random() * queries.length)]);
    const desc = target
      ? `**${message.author.username}** is DYING of laughter at **${target.username}**!! 😂💀`
      : `**${message.author.username}** is cackling uncontrollably!! 😂💀`;
    message.reply({ embeds: [buildIE({ title: '😂 LMAOOO!!', color: 0xFEE75C, description: desc, gifUrl, footer: 'Crying laughing 💀 | Wisteria 🌸' })] });
  },
};

const celebrateCmd = {
  name: 'celebrate',
  description: 'Celebrate!',
  async execute(message) {
    const target = message.mentions.users.first();
    const queries = ['anime celebrate confetti', 'celebration party anime', 'congrats celebrate anime'];
    const gifUrl = await fetchGif(queries[Math.floor(Math.random() * queries.length)]);
    const desc = target
      ? `**${message.author.username}** celebrates **${target.username}**!! 🎉🎊 LET'S GOOO!!`
      : `**${message.author.username}** is CELEBRATING!! 🎉🎊`;
    message.reply({ embeds: [buildIE({ title: '🎉 CELEBRATE!!', color: 0xFFD700, description: desc, gifUrl, footer: "LET'S GOOO 🌸" })] });
  },
};

// ===================== SLOTS MACHINE =====================
const SLOT_SYMBOLS = ['🍒', '🍋', '🍊', '⭐', '💎', '7️⃣', '🌸', '💜'];
const SLOT_PAYOUTS = {
  '💎💎💎': { name: 'JACKPOT!!!', xp: 500, msg: 'YOU HIT THE JACKPOT!!! 💰💰💰' },
  '7️⃣7️⃣7️⃣': { name: 'LUCKY SEVENS!!', xp: 300, msg: 'LUCKY SEVENS!! 🎰🎰🎰' },
  '🌸🌸🌸': { name: 'Wisteria Special!!', xp: 200, msg: 'THE WISTERIA SPECIAL!! 🌸🌸🌸' },
  '💜💜💜': { name: 'Purple Power!', xp: 150, msg: 'PURPLE POWER!! 💜💜💜' },
  '⭐⭐⭐': { name: 'Star Struck!', xp: 100, msg: 'STAR STRUCK!! ⭐⭐⭐' },
};

const slotsCmd = {
  name: 'slots',
  description: 'Spin the slot machine!',
  async execute(message, args, client) {
    // Spin animation
    const spinMsg = await message.reply('🎰 **Spinning...** [ 🔄 | 🔄 | 🔄 ]');

    await new Promise(r => setTimeout(r, 1000));

    const s1 = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
    const s2 = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
    const s3 = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
    const combo = `${s1}${s2}${s3}`;
    const result = combo;

    const payout = SLOT_PAYOUTS[result];
    const allSame = s1 === s2 && s2 === s3;
    const twoSame = s1 === s2 || s2 === s3 || s1 === s3;

    let xpReward = 0;
    let resultMsg;
    let color = 0xED4245;

    if (payout) {
      xpReward = payout.xp;
      resultMsg = `🎉 ${payout.msg} **+${xpReward} XP!!**`;
      color = 0xFFD700;
    } else if (allSame) {
      xpReward = 75;
      resultMsg = `🎊 THREE OF A KIND! **+${xpReward} XP!**`;
      color = 0x57F287;
    } else if (twoSame) {
      xpReward = 25;
      resultMsg = `👍 Two matching! **+${xpReward} XP**`;
      color = 0xFEE75C;
    } else {
      resultMsg = '😞 No match... Try again!';
    }

    if (xpReward > 0) {
      const key = `${message.guild.id}-${message.author.id}`;
      if (!client.xpData[key]) client.xpData[key] = { xp: 0, level: 1, username: message.author.username };
      client.xpData[key].xp += xpReward;
    }

    const embed = new EmbedBuilder()
      .setTitle('🎰 Slot Machine!')
      .setColor(color)
      .setDescription(`[ ${s1} | ${s2} | ${s3} ]\n\n${resultMsg}`)
      .setFooter({ text: `Spun by ${message.author.username} | Use !slots to try again!` });

    await spinMsg.edit({ content: '', embeds: [embed] });
  },
};

// ===================== TRUTH OR DARE =====================
const truths = [
  "What's the most embarrassing thing you've done on Discord?",
  "What's a weird food combination you secretly enjoy?",
  "Have you ever laughed at something so hard you cried?",
  "What's your most used emoji and why?",
  "What's a TV show you're ashamed to admit you love?",
  "What's the weirdest dream you've ever had?",
  "What's the last lie you told?",
  "If you could only eat one food forever, what would it be?",
  "What's your most embarrassing autocorrect fail?",
  "Have you ever accidentally sent a message to the wrong person?",
  "What's the dumbest thing you've googled?",
  "What's a totally useless talent you have?",
  "What's the most awkward nickname you've been given?",
  "If you were invisible for a day, what would you do?",
  "What's your strangest habit?",
  "Have you ever walked into a glass door or wall in public?",
  "What's the most childish thing you still do?",
  "Have you ever pretended to be busy to avoid someone?",
  "What's the worst grade you ever got and what was the subject?",
  "Have you ever sniffed your own armpits in public?",
];

// Regular dares (text-only, low consequence)
const regularDares = [
  "Type a message using only emoji for the next 3 messages!",
  "Say something nice about the last 3 people who typed in this channel!",
  "Write a 3-line poem about your favorite food right now!",
  "Type everything in ALL CAPS for the next 2 minutes!",
  "Use a different language for your next message!",
  "Send the most chaotic GIF you can find!",
  "React to the last 5 messages in this channel with the 🌸 emoji!",
  "Write a mini story (3 sentences) about a potato who becomes a king!",
  "Compliment every member who talks in the next 2 minutes!",
  "Type backwards for your next message!",
  "Describe your current mood using only 3 emojis!",
  "Pretend to be a news anchor reporting on what's happening in this chat!",
  "Make up a new word and define it in chat!",
  "Write a haiku about Wisteria bot!",
];

// Embarrassing dares — refusing these triggers nickname punishment
const embarrassingDares = [
  { text: "Change your nickname to '🐔 Chicken Lord 🐔' for 5 minutes!", nickname: '🐔 Chicken Lord 🐔' },
  { text: "Change your nickname to 'I Lost a Dare 😭' for 5 minutes!", nickname: 'I Lost a Dare 😭' },
  { text: "Change your nickname to 'Professional Loser 🏆' for 5 minutes!", nickname: 'Professional Loser 🏆' },
  { text: "Change your nickname to '🍌 Banana Boy/Girl 🍌' for 5 minutes!", nickname: '🍌 Banana Boy/Girl 🍌' },
  { text: "Change your nickname to 'Wisteria's #1 Fan 🌸' for 5 minutes!", nickname: "Wisteria's #1 Fan 🌸" },
  { text: "Change your nickname to '🤡 Clown of the Server 🤡' for 5 minutes!", nickname: '🤡 Clown of the Server 🤡' },
  { text: "Change your nickname to 'Toast Enthusiast 🍞' for 5 minutes!", nickname: 'Toast Enthusiast 🍞' },
  { text: "Change your nickname to '😤 I Lost a Dare' for 5 minutes!", nickname: '😤 I Lost a Dare' },
];

// Pick a dare: 40% chance of embarrassing dare, 60% regular
function pickDare() {
  if (Math.random() < 0.4) {
    const d = embarrassingDares[Math.floor(Math.random() * embarrassingDares.length)];
    return { text: d.text, isEmbarrassing: true, nickname: d.nickname };
  }
  const t = regularDares[Math.floor(Math.random() * regularDares.length)];
  return { text: t, isEmbarrassing: false, nickname: null };
}

const truthCmd = {
  name: 'truth',
  description: 'Get a Truth question!',
  async execute(message) {
    const q = truths[Math.floor(Math.random() * truths.length)];
    const embed = new EmbedBuilder()
      .setTitle('🤔 Truth!')
      .setColor(0x5865F2)
      .setDescription(`**${message.author.username}**, here's your truth:\n\n> ${q}`)
      .setFooter({ text: 'Answer honestly! React ✅ if you answered, ❌ if you skipped! | Wisteria 🌸' });
    const sent = await message.reply({ embeds: [embed] });
    await sent.react('✅');
    await sent.react('❌');

    // Wait up to 60 seconds for the user to react
    const filter = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
    try {
      const collected = await sent.awaitReactions({ filter, max: 1, time: 60_000, errors: ['time'] });
      const reaction = collected.first();
      if (reaction.emoji.name === '✅') {
        const successEmbed = new EmbedBuilder()
          .setTitle('✅ Truth Completed!')
          .setColor(0x57F287)
          .setDescription(`**${message.author.username}** answered the truth! Well done! 🎉`)
          .setFooter({ text: 'Honesty is the best policy | Wisteria 🌸' });
        message.channel.send({ embeds: [successEmbed] });
      } else {
        const failPenalties = [
          'You must sing a full verse of a song of the group\'s choosing!',
          'You have to do 15 push-ups right now!',
          'You must share an embarrassing photo!',
          'You owe everyone a compliment — one for each person in the chat!',
          'You have to speak in a funny accent for the next 5 minutes!',
        ];
        const penalty = failPenalties[Math.floor(Math.random() * failPenalties.length)];
        const failEmbed = new EmbedBuilder()
          .setTitle('❌ Truth Skipped — Penalty Time!')
          .setColor(0xED4245)
          .setDescription(`**${message.author.username}** chickened out on the truth! 😱\n\n**Penalty:** ${penalty}`)
          .setFooter({ text: 'No pain, no gain! | Wisteria 🌸' });
        message.channel.send({ embeds: [failEmbed] });
      }
    } catch {
      // Timed out — no reaction
      const timeoutEmbed = new EmbedBuilder()
        .setTitle('⏰ Time\'s Up — Penalty Time!')
        .setColor(0xFEE75C)
        .setDescription(`**${message.author.username}** took too long to answer the truth! 😬\n\n**Penalty:** Do 10 jumping jacks right now!`)
        .setFooter({ text: 'Silence is not an answer! | Wisteria 🌸' });
      message.channel.send({ embeds: [timeoutEmbed] });
    }
  },
};

// Helper: change a member's nickname and revert after a delay
async function applyNicknamePunishment(message, nicknameTxt) {
  const guild = message.guild;
  const member = await guild.members.fetch(message.author.id).catch(() => null);
  if (!member) return;

  const me = guild.members.me;
  // Bot needs ManageNicknames and must be higher than target
  if (!me.permissions.has('ManageNicknames')) return;
  if (me.roles.highest.position <= member.roles.highest.position) return;

  const originalNick = member.nickname;
  try {
    await member.setNickname(nicknameTxt, 'Dare punishment');

    // Announce it
    const nickEmbed = new EmbedBuilder()
      .setTitle('😈 Nickname Punishment!')
      .setColor(0xED4245)
      .setDescription(`**${message.author.username}** refused the dare, so their nickname has been changed to **${nicknameTxt}** for 5 minutes! They can't change it back! 😂`)
      .setFooter({ text: 'Should\'ve done the dare! | Wisteria 🌸' });
    message.channel.send({ embeds: [nickEmbed] });

    // Revert after 5 minutes
    setTimeout(async () => {
      try {
        const freshMember = await guild.members.fetch(message.author.id).catch(() => null);
        if (!freshMember) return;
        // Only revert if nickname is still the punishment nickname
        if (freshMember.nickname === nicknameTxt) {
          await freshMember.setNickname(originalNick, 'Dare punishment expired');
          const revertEmbed = new EmbedBuilder()
            .setTitle('✅ Nickname Punishment Expired!')
            .setColor(0x57F287)
            .setDescription(`**${message.author.username}**'s nickname punishment is over. They're free... for now. 😏`)
            .setFooter({ text: 'Wisteria 🌸' });
          message.channel.send({ embeds: [revertEmbed] });
        }
      } catch {}
    }, 5 * 60 * 1000);
  } catch {}
}

const dareCmd = {
  name: 'dare',
  description: 'Get a Dare! (Some dares are embarrassing — refuse and face nickname punishment!)',
  async execute(message) {
    const dare = pickDare();
    const warningText = dare.isEmbarrassing
      ? '\n\n⚠️ **This is an embarrassing dare!** If you refuse (❌), your nickname will be forcibly changed for 5 minutes!'
      : '';

    const embed = new EmbedBuilder()
      .setTitle(dare.isEmbarrassing ? '😈 Embarrassing Dare!' : '😈 Dare!')
      .setColor(dare.isEmbarrassing ? 0xFF6B00 : 0xED4245)
      .setDescription(`**${message.author.username}**, your dare:\n\n> ${dare.text}${warningText}`)
      .setFooter({ text: 'No chickening out! React ✅ when done, ❌ if you refuse! | Wisteria 🌸' });
    const sent = await message.reply({ embeds: [embed] });
    await sent.react('✅');
    await sent.react('❌');

    // Wait up to 120 seconds for the user to react
    const filter = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
    try {
      const collected = await sent.awaitReactions({ filter, max: 1, time: 120_000, errors: ['time'] });
      const reaction = collected.first();
      if (reaction.emoji.name === '✅') {
        const successEmbed = new EmbedBuilder()
          .setTitle('✅ Dare Completed!')
          .setColor(0x57F287)
          .setDescription(`**${message.author.username}** completed the dare! Absolute legend! 🔥`)
          .setFooter({ text: 'Brave soul! | Wisteria 🌸' });
        message.channel.send({ embeds: [successEmbed] });
      } else {
        if (dare.isEmbarrassing && dare.nickname) {
          // Nickname punishment for embarrassing dare refusal
          await applyNicknamePunishment(message, dare.nickname);
        } else {
          // Regular penalty for normal dare refusal
          const failPenalties = [
            'You must let the group change your profile picture for 24 hours!',
            'You have to post an embarrassing status/story!',
            'You owe everyone a 30-second dance performance!',
            'You must send a voice message singing a nursery rhyme!',
            'You have to let someone go through your photos for 30 seconds!',
          ];
          const penalty = failPenalties[Math.floor(Math.random() * failPenalties.length)];
          const failEmbed = new EmbedBuilder()
            .setTitle('❌ Dare Refused — Penalty Time!')
            .setColor(0xED4245)
            .setDescription(`**${message.author.username}** refused the dare! Coward! 🐔\n\n**Penalty:** ${penalty}`)
            .setFooter({ text: 'Courage is a choice! | Wisteria 🌸' });
          message.channel.send({ embeds: [failEmbed] });
        }
      }
    } catch {
      // Timed out
      const timeoutEmbed = new EmbedBuilder()
        .setTitle('⏰ Time\'s Up — Penalty Time!')
        .setColor(0xFEE75C)
        .setDescription(`**${message.author.username}** didn't react to the dare in time! 👀\n\n**Penalty:** You must send a voice message saying "I am a chicken" three times!`)
        .setFooter({ text: 'Time waits for no one! | Wisteria 🌸' });
      message.channel.send({ embeds: [timeoutEmbed] });
    }
  },
};

// ===================== POLL =====================
const pollCmd = {
  name: 'poll',
  description: 'Create a quick poll with reactions',
  async execute(message, args) {
    const text = args.join(' ');
    const parts = text.split('|').map(s => s.trim()).filter(Boolean);

    if (parts.length < 2) {
      return message.reply([
        '❓ Usage: `!poll Question | Option1 | Option2 | Option3...`',
        'Example: `!poll Best pizza? | Pepperoni | Cheese | Hawaiian`',
        'You can have up to 9 options!',
      ].join('\n'));
    }

    const [question, ...options] = parts;
    if (options.length > 9) return message.reply('❌ Maximum 9 options!');

    const numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
    const fields = options.map((opt, i) => ({ name: `${numberEmojis[i]} Option ${i + 1}`, value: opt, inline: true }));

    const embed = new EmbedBuilder()
      .setTitle(`📊 Poll: ${question}`)
      .setColor(WISTERIA_COLOR)
      .addFields(fields)
      .setFooter({ text: `Poll by ${message.author.username} | React to vote! | Wisteria 🌸` });

    const pollMsg = await message.channel.send({ embeds: [embed] });
    for (let i = 0; i < options.length; i++) {
      await pollMsg.react(numberEmojis[i]);
    }
    try { await message.delete(); } catch { /* no perms */ }
  },
};


module.exports = [
  eightBallCmd, jokeCmd, flipCmd, factCmd, complimentCmd, roastCmd,
  shipCmd, chooseCmd, avatarCmd, uwuCmd, pirateCmd, reverseCmd, mockCmd,
  hugCmd, highfiveCmd, patCmd, slotsCmd, truthCmd, dareCmd, pollCmd,
];