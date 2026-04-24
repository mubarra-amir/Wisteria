const { EmbedBuilder } = require('discord.js');

// Active snake games per channel
const games = new Map();

module.exports = {
  name: 'snake',
  description: 'Word Snake — chain words where each starts with last letter of previous',
  async execute(message, args) {
    const channelId = message.channel.id;

    if (games.has(channelId)) {
      return message.reply('⚠️ A Word Snake game is already running! Use `!snake stop` to end it.');
    }

    if (args[0] === 'stop') {
      if (!games.has(channelId)) return message.reply('No active game to stop!');
      const g = games.get(channelId);
      games.delete(channelId);
      return message.reply(`🛑 Word Snake stopped! Chain length: **${g.chain.length}**`);
    }

    const startWord = (args[0] || 'snake').toLowerCase();

    games.set(channelId, {
      chain: [startWord],
      usedWords: new Set([startWord]),
      lastLetter: startWord[startWord.length - 1],
      lastPlayer: null,
    });

    const embed = new EmbedBuilder()
      .setTitle('🐍 Word Snake Started!')
      .setColor(0x57F287)
      .setDescription([
        `Starting word: **${startWord}**`,
        `Next word must start with: **${startWord[startWord.length - 1].toUpperCase()}**`,
        '',
        '**Rules:**',
        '• Each word must start with the last letter of the previous word',
        '• No repeating words!',
        '• No two consecutive guesses by same player',
        '• Type `!snake stop` to end the game',
      ].join('\n'))
      .setFooter({ text: 'Just type a valid word in chat!' });

    await message.channel.send({ embeds: [embed] });

    const filter = m => !m.author.bot && !m.content.startsWith('!') && /^[a-zA-Z]+$/.test(m.content.trim());
    const collector = message.channel.createMessageCollector({ filter, time: 300000 }); // 5 min

    collector.on('collect', async (m) => {
      const game = games.get(channelId);
      if (!game) return collector.stop();

      const word = m.content.trim().toLowerCase();

      if (m.author.id === game.lastPlayer) {
        return m.react('🚫');
      }

      if (word[0] !== game.lastLetter) {
        return m.react('❌');
      }

      if (game.usedWords.has(word)) {
        return m.react('♻️');
      }

      // Valid word!
      game.chain.push(word);
      game.usedWords.add(word);
      game.lastLetter = word[word.length - 1];
      game.lastPlayer = m.author.id;

      await m.react('✅');

      if (game.chain.length % 10 === 0) {
        const milestone = new EmbedBuilder()
          .setColor(0xFEE75C)
          .setDescription(`🎉 **${game.chain.length} words** in the chain! Next: **${game.lastLetter.toUpperCase()}**`);
        m.channel.send({ embeds: [milestone] });
      }
    });

    collector.on('end', () => {
      const game = games.get(channelId);
      if (game) {
        games.delete(channelId);
        message.channel.send(`⏰ Word Snake ended! Final chain length: **${game.chain.length}**\nChain: ${game.chain.slice(-10).join(' → ')}${game.chain.length > 10 ? ' (last 10)' : ''}`);
      }
    });
  },
};
