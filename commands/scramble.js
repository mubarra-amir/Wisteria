const { EmbedBuilder } = require('discord.js');

const WORDS = [
  { word: 'discord', hint: 'Popular chat platform 💬' },
  { word: 'gaming', hint: 'A popular hobby 🎮' },
  { word: 'pizza', hint: 'Italian food 🍕' },
  { word: 'rainbow', hint: 'Colorful after rain 🌈' },
  { word: 'python', hint: 'A programming language 🐍' },
  { word: 'sunflower', hint: 'A tall yellow flower 🌻' },
  { word: 'diamond', hint: 'A precious gemstone 💎' },
  { word: 'volcano', hint: 'A mountain that erupts 🌋' },
  { word: 'penguin', hint: 'A bird that can\'t fly 🐧' },
  { word: 'keyboard', hint: 'You type on this ⌨️' },
  { word: 'library', hint: 'Full of books 📚' },
  { word: 'adventure', hint: 'An exciting journey 🗺️' },
  { word: 'butterfly', hint: 'A colorful insect 🦋' },
  { word: 'universe', hint: 'Everything that exists 🌌' },
  { word: 'telescope', hint: 'Used to look at stars 🔭' },
  { word: 'elephant', hint: 'The largest land animal 🐘' },
  { word: 'chocolate', hint: 'A sweet treat 🍫' },
  { word: 'hurricane', hint: 'A powerful storm 🌀' },
  { word: 'invisible', hint: 'Cannot be seen 👻' },
  { word: 'waterfall', hint: 'Water falling from a height 💧' },
  { word: 'astronaut', hint: 'Travels to space 🚀' },
  { word: 'fireworks', hint: 'Colorful explosions in the sky 🎆' },
  { word: 'professor', hint: 'A teacher at university 🎓' },
  { word: 'jellyfish', hint: 'A sea creature without bones 🪼' },
  { word: 'saxophone', hint: 'A musical instrument 🎷' },
];

function scramble(word) {
  let arr = word.split('');
  let attempts = 0;
  do {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    attempts++;
  } while (arr.join('') === word && attempts < 10);
  return arr.join('');
}

const activeSessions = new Map(); // channelId → session

module.exports = {
  name: 'scramble',
  description: 'Unscramble the word! First to guess wins.',
  async execute(message, args, client) {
    const channelId = message.channel.id;

    if (activeSessions.has(channelId)) {
      return message.reply('⚠️ A Scramble game is already active in this channel! Guess the current word first.');
    }

    const entry    = WORDS[Math.floor(Math.random() * WORDS.length)];
    const scrambled = scramble(entry.word);
    activeSessions.set(channelId, entry.word);

    const embed = new EmbedBuilder()
      .setTitle('🔀 Word Scramble!')
      .setColor(0x9B59B6)
      .setDescription(
        `Unscramble this word:\n\n` +
        `# \`${scrambled.toUpperCase()}\`\n\n` +
        `💡 Hint: ${entry.hint}\n\n` +
        `Type the unscrambled word in chat! You have **45 seconds!**`
      )
      .setFooter({ text: `${entry.word.length} letters | Wisteria 🌸` });

    await message.channel.send({ embeds: [embed] });

    const filter = m => !m.author.bot;
    const collector = message.channel.createMessageCollector({ filter, time: 45000 });

    collector.on('collect', async (m) => {
      if (m.content.toLowerCase().trim() === entry.word.toLowerCase()) {
        activeSessions.delete(channelId);
        collector.stop('correct');

        const xpReward = 40;
        const key = `${message.guild.id}-${m.author.id}`;
        if (!client.xpData[key]) client.xpData[key] = { xp: 0, level: 1, username: m.author.username };
        client.xpData[key].xp += xpReward;

        const winEmbed = new EmbedBuilder()
          .setTitle('🎉 Correct!')
          .setColor(0x57F287)
          .setDescription(`**${m.author.username}** unscrambled **\`${scrambled.toUpperCase()}\`** → **${entry.word.toUpperCase()}**! 🌸\n+${xpReward} XP!`)
          .setFooter({ text: 'Type !scramble for another round!' });
        m.channel.send({ embeds: [winEmbed] });
      }
    });

    collector.on('end', (_, reason) => {
      if (reason !== 'correct') {
        activeSessions.delete(channelId);
        const embed = new EmbedBuilder()
          .setTitle('⏰ Time\'s Up!')
          .setColor(0xED4245)
          .setDescription(`Nobody got it! The word was **${entry.word.toUpperCase()}**`)
          .setFooter({ text: 'Type !scramble to try again!' });
        message.channel.send({ embeds: [embed] });
      }
    });
  },
};
