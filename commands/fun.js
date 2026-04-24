const { EmbedBuilder } = require('discord.js');

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

// ===================== AFFECTION =====================
const hugCmd = {
  name: 'hug',
  description: 'Hug someone!',
  async execute(message) {
    const target = message.mentions.users.first();
    if (!target) return message.reply('❓ Mention someone to hug! e.g. `!hug @friend`');
    const hugs = ['(っ◔◡◔)っ ♥', '(づ ᴗ _ᴗ)づ ♡', '⊂(♡⌂♡)⊃', '(⊃｡•́‿•̀｡)⊃'];
    const embed = new EmbedBuilder()
      .setTitle('🤗 Hug!')
      .setColor(0xFF69B4)
      .setDescription(`**${message.author.username}** hugs **${target.username}**! \n\n${hugs[Math.floor(Math.random() * hugs.length)]}`)
      .setFooter({ text: 'Spread the love! 🌸' });
    message.reply({ embeds: [embed] });
  },
};

const highfiveCmd = {
  name: 'highfive',
  description: 'High five someone!',
  async execute(message) {
    const target = message.mentions.users.first();
    if (!target) return message.reply('❓ Mention someone to high five! e.g. `!highfive @friend`');
    const embed = new EmbedBuilder()
      .setTitle('🙌 High Five!')
      .setColor(0xFEE75C)
      .setDescription(`**${message.author.username}** gives **${target.username}** a huge high five!! 🙌✨\n\nSLAP!! That was a good one!`)
      .setFooter({ text: 'Squad goals! 🌸' });
    message.reply({ embeds: [embed] });
  },
};

const patCmd = {
  name: 'pat',
  description: 'Pat someone on the head!',
  async execute(message) {
    const target = message.mentions.users.first();
    if (!target) return message.reply('❓ Mention someone to pat! e.g. `!pat @friend`');
    const embed = new EmbedBuilder()
      .setTitle('✋ Headpat!')
      .setColor(0xFF69B4)
      .setDescription(`**${message.author.username}** pats **${target.username}** on the head! ✋\n\n*pat pat pat* You\'re doing great sweetie! 🌸`)
      .setFooter({ text: 'So wholesome 💜' });
    message.reply({ embeds: [embed] });
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
];

const dares = [
  "Type a message using only emoji for the next 3 messages!",
  "Change your nickname to 'Wisteria's #1 Fan' for 5 minutes!",
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

const truthCmd = {
  name: 'truth',
  description: 'Get a Truth question!',
  async execute(message) {
    const q = truths[Math.floor(Math.random() * truths.length)];
    const embed = new EmbedBuilder()
      .setTitle('🤔 Truth!')
      .setColor(0x5865F2)
      .setDescription(`**${message.author.username}**, here's your truth:\n\n> ${q}`)
      .setFooter({ text: 'Answer honestly! | Wisteria 🌸' });
    message.reply({ embeds: [embed] });
  },
};

const dareCmd = {
  name: 'dare',
  description: 'Get a Dare!',
  async execute(message) {
    const d = dares[Math.floor(Math.random() * dares.length)];
    const embed = new EmbedBuilder()
      .setTitle('😈 Dare!')
      .setColor(0xED4245)
      .setDescription(`**${message.author.username}**, you dare:\n\n> ${d}`)
      .setFooter({ text: 'No chickening out! | Wisteria 🌸' });
    message.reply({ embeds: [embed] });
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

const WISTERIA_COLOR = 0x9B59B6;

module.exports = [
  eightBallCmd, jokeCmd, flipCmd, factCmd, complimentCmd, roastCmd,
  shipCmd, chooseCmd, avatarCmd, uwuCmd, pirateCmd, reverseCmd, mockCmd,
  hugCmd, highfiveCmd, patCmd, slotsCmd, truthCmd, dareCmd, pollCmd,
];
