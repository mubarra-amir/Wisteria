const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const WISTERIA_COLOR = 0x9B59B6;

const categories = {
  '🎮 Games': {
    color: 0x5865F2,
    commands: [
      { name: '!rps [@user]',       desc: 'Rock Paper Scissors — vs Bot or challenge a friend!' },
      { name: '!guess [hard]',      desc: 'Guess the number (1-100 or hard mode 1-1000)' },
      { name: '!trivia [diff]',     desc: 'Trivia questions! easy / medium / hard' },
      { name: '!wordle',            desc: 'Guess the 5-letter word in 6 tries 🟩' },
      { name: '!hangman',           desc: 'Classic letter-guessing Hangman game 💀' },
      { name: '!tictactoe [@user]', desc: 'Tic-Tac-Toe! vs Bot or vs another player' },
      { name: '!connect4 @user',    desc: 'Drop pieces and connect 4 in a row! 🔴🟡' },
      { name: '!scramble',          desc: 'Unscramble the word — first to guess wins!' },
      { name: '!math [diff]',       desc: 'Race to solve a math problem! easy/medium/hard' },
      { name: '!typerace',          desc: 'Compete to type a sentence the fastest! ⌨️' },
      { name: '!snake [word]',      desc: 'Word chain game — each word starts with last letter' },
      { name: '!hol',               desc: 'Higher or Lower card game' },
      { name: '!mafia start',       desc: '🎭 Start a Mafia party game (4+ players)' },
    ],
  },
  '🎲 Quick Fun': {
    color: 0xFEE75C,
    commands: [
      { name: '!8ball [question]',     desc: 'Ask the Magic 8-Ball anything 🎱' },
      { name: '!joke',                 desc: 'Get a random joke 😂' },
      { name: '!fact',                 desc: 'Get a random fun fact 🐾' },
      { name: '!flip',                 desc: 'Flip a coin! Heads or Tails?' },
      { name: '!dice [sides]',         desc: 'Roll a dice — default d6, up to d1000' },
      { name: '!slots',                desc: 'Spin the slot machine! 🎰' },
      { name: '!truth',                desc: 'Get a truth question 🤔' },
      { name: '!dare',                 desc: 'Get a dare challenge 😈' },
      { name: '!poll Question|A|B|C',  desc: 'Create a reaction poll (up to 9 options) 📊' },
      { name: '!choose A, B, C',       desc: 'Can\'t decide? Let Wisteria choose for you!' },
    ],
  },
  '😂 Reactions & Social': {
    color: 0xFF69B4,
    commands: [
      { name: '!compliment [@user]',  desc: 'Send a compliment 💖' },
      { name: '!roast [@user]',       desc: 'Friendly roast someone 🔥' },
      { name: '!insult [@user]',      desc: 'Savage (but fun) insult with GIF 💀' },
      { name: '!hug @user',           desc: 'Hug someone! 🤗' },
      { name: '!highfive @user',      desc: 'High five someone! 🙌' },
      { name: '!pat @user',           desc: 'Pat someone on the head! ✋' },
      { name: '!slap @user',          desc: 'Slap someone! 👋' },
      { name: '!punch @user',         desc: 'Punch someone! 👊' },
      { name: '!hit @user',           desc: 'Bonk someone! 💥' },
      { name: '!kickfun @user',       desc: 'Kick someone (fun, not mod)! 🦵' },
      { name: '!poke @user',          desc: 'Poke someone! 👉' },
      { name: '!boop @user',          desc: 'Boop someone on the nose! 👆' },
      { name: '!cuddle @user',        desc: 'Cuddle someone! 🥺' },
      { name: '!bite @user',          desc: 'Bite someone! NOM 😤' },
      { name: '!lick @user',          desc: 'Lick someone (why tho 😭)' },
      { name: '!throw @user',         desc: 'Throw something at someone! 🎯' },
      { name: '!wave [@user]',        desc: 'Wave hello! 👋' },
      { name: '!clap [@user]',        desc: 'Clap for someone! 👏' },
      { name: '!meow [@user]',        desc: 'Meow at someone! 🐱' },
      { name: '!ship [@u1] [@u2]',    desc: 'Check compatibility between two people 💘' },
      { name: '!gif [search]',        desc: 'Send a GIF! 🎬' },
      { name: '!avatar [@user]',      desc: 'Get someone\'s avatar 🖼️' },
    ],
  },
  '🎭 Expressions': {
    color: 0xFF69B4,
    commands: [
      { name: '!stare [@user]',   desc: 'Stare intensely 👀' },
      { name: '!cry [@user]',     desc: 'Cry dramatically 😭' },
      { name: '!blush [@user]',   desc: 'Blush! 😳' },
      { name: '!dance [@user]',   desc: 'Dance! 💃' },
      { name: '!wink [@user]',    desc: 'Wink! 😉' },
      { name: '!smug',            desc: 'Smug face 😏' },
      { name: '!facepalm [@u]',   desc: 'Facepalm 🤦' },
      { name: '!shrug',           desc: 'Shrug ¯\\_(ツ)_/¯ 🤷' },
      { name: '!scream',          desc: 'AAAAAAA 😱' },
      { name: '!confused',        desc: 'React with confusion 😵' },
      { name: '!shocked',         desc: 'React with shock 😱' },
      { name: '!laugh [@user]',   desc: 'Laugh at something 😂' },
      { name: '!celebrate [@u]',  desc: 'CELEBRATE!! 🎉' },
    ],
  },
  '✨ Text Magic': {
    color: 0x57F287,
    commands: [
      { name: '!uwu [text]',       desc: 'Translate text to UwU speak 🌸' },
      { name: '!pirate [text]',    desc: 'Translate text to pirate speak ⚓' },
      { name: '!reverse [text]',   desc: 'Reverse a message 🔄' },
      { name: '!mock [text]',      desc: 'SpongeBob mocking meme text 🐦' },
    ],
  },
  '📈 Profile & XP': {
    color: 0x9B59B6,
    commands: [
      { name: '!xp [@user]',   desc: 'Check your XP and level 📊' },
      { name: '!ask [question]', desc: 'Ask Wisteria anything 🌸' },
    ],
  },
  '😈 Silly Stuff': {
    color: 0xED4245,
    commands: [
      { name: '!annoy @user',  desc: 'Delete someone\'s messages for up to 2 min 🔇' },
      { name: '!stopannoy @u', desc: 'Stop annoy mode early ✅' },
      { name: '!annoylist',    desc: 'See who\'s being annoyed 👀' },
      { name: '!nickname ...', desc: 'Nickname management' },
      { name: '!reactions ...',desc: 'Set auto-reactions on mentions' },
    ],
  },
};

module.exports = {
  name: 'help',
  description: 'Show all Wisteria commands',
  async execute(message, args) {
    // Category-specific help
    if (args[0]) {
      const query = args.join(' ').toLowerCase();
      for (const [cat, data] of Object.entries(categories)) {
        const match = data.commands.find(c => c.name.toLowerCase().includes(query));
        if (match) {
          const embed = new EmbedBuilder()
            .setColor(data.color)
            .setTitle(`📖 Help: ${match.name}`)
            .setDescription(match.desc)
            .setFooter({ text: 'Wisteria 🌸 | !help for full list' });
          return message.reply({ embeds: [embed] });
        }
      }
    }

    // Main help embed
    const embed = new EmbedBuilder()
      .setColor(WISTERIA_COLOR)
      .setTitle('🌸 Wisteria — Command List')
      .setDescription(
        `Hey **${message.author.username}**! 💜 Here's everything I can do!\n` +
        `Prefix: \`!\` | e.g. \`!trivia\`, \`!wordle\`, \`!rps\`\n` +
        `Tip: Use \`!help <command>\` for details on a specific command!`
      )
      .setThumbnail(message.client.user.displayAvatarURL());

    for (const [catName, data] of Object.entries(categories)) {
      const value = data.commands.map(c => `\`${c.name}\` — ${c.desc}`).join('\n');
      embed.addFields({ name: catName, value: value.slice(0, 1024) });
    }

    embed.addFields({
      name: '💡 Pro Tips',
      value: [
        '• Most commands have **cooldowns** to keep things fair!',
        '• Earn **XP** by chatting & playing games — check `!xp`!',
        '• Annoy mode **auto-expires after 2 minutes** 🌸',
        '• Use `!trivia hard` or `!guess hard` for more XP!',
        '• Use `!dare` and refuse to get a nickname punishment 😈',
        '• Interaction commands like `!hug`, `!slap`, `!dance` use GIFs from Tenor!',
      ].join('\n'),
    });

    embed.setFooter({ text: 'Wisteria v2.0 🌸 | Made with 💜 | !help <command> for details' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('🎮 Games').setCustomId('help:games').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setLabel('🎲 Quick Fun').setCustomId('help:fun').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setLabel('📈 My XP').setCustomId('help:xp').setStyle(ButtonStyle.Secondary),
    );

    message.reply({ embeds: [embed], components: [row] });
  },
};