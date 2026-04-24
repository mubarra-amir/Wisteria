const { EmbedBuilder } = require('discord.js');

const WORDS = [
  // Animals
  'elephant', 'giraffe', 'penguin', 'dolphin', 'kangaroo', 'cheetah', 'gorilla', 'flamingo',
  // Food
  'pizza', 'spaghetti', 'chocolate', 'avocado', 'waffle', 'burrito', 'pancake', 'broccoli',
  // Tech
  'javascript', 'keyboard', 'discord', 'internet', 'software', 'database', 'algorithm',
  // Fun
  'rainbow', 'sunflower', 'butterfly', 'telescope', 'adventure', 'fireworks', 'universe',
  // General
  'library', 'journey', 'mystery', 'blanket', 'umbrella', 'battery', 'bicycle', 'diamond',
  'mountain', 'horizon', 'glacier', 'volcano', 'tornado', 'crystal', 'whisper', 'thunder',
];

const HANGMAN_STAGES = [
  '```\n  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========```',
  '```\n  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========```',
  '```\n  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========```',
  '```\n  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========```',
  '```\n  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========```',
  '```\n  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========```',
  '```\n  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n=========```',
];

const activeGames = new Map(); // channelId → game

function buildDisplay(word, guessed) {
  return word.split('').map(l => (guessed.has(l) ? `**${l.toUpperCase()}**` : '\\_')).join(' ');
}

module.exports = {
  name: 'hangman',
  description: 'Play Hangman! Guess letters to save the person!',
  async execute(message) {
    const channelId = message.channel.id;

    if (activeGames.has(channelId)) {
      const game = activeGames.get(channelId);
      const display = buildDisplay(game.word, game.guessed);
      const wrongLetters = [...game.guessed].filter(l => !game.word.includes(l));
      const embed = new EmbedBuilder()
        .setTitle('💀 Hangman — Game in Progress!')
        .setColor(0xFEE75C)
        .setDescription(
          `${HANGMAN_STAGES[game.wrong]}\n\n${display}\n\n` +
          `Wrong guesses (${game.wrong}/6): ${wrongLetters.length ? wrongLetters.join(', ').toUpperCase() : '*none yet*'}`
        )
        .setFooter({ text: 'Type a letter in chat to guess! | !hangman stop to end' });
      return message.reply({ embeds: [embed] });
    }

    if (message.content.toLowerCase().includes('stop')) {
      if (!activeGames.has(channelId)) return message.reply("❌ No active Hangman game!");
      const game = activeGames.get(channelId);
      activeGames.delete(channelId);
      return message.reply(`🛑 Hangman stopped! The word was **${game.word.toUpperCase()}** 🌸`);
    }

    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    const game = { word, guessed: new Set(), wrong: 0, startedBy: message.author.id };
    activeGames.set(channelId, game);

    const display = buildDisplay(word, game.guessed);

    const embed = new EmbedBuilder()
      .setTitle('💀 Hangman!')
      .setColor(0x57F287)
      .setDescription(
        `${HANGMAN_STAGES[0]}\n\n${display}\n\n` +
        `Word length: **${word.length} letters**\n6 wrong guesses allowed!\n\nType a **single letter** to guess!`
      )
      .setFooter({ text: `Started by ${message.author.username} | !hangman stop to quit | Wisteria 🌸` });

    await message.channel.send({ embeds: [embed] });

    const filter = m => !m.author.bot && /^[a-zA-Z]$/.test(m.content.trim());
    const collector = message.channel.createMessageCollector({ filter, time: 180000 }); // 3 min

    collector.on('collect', async (m) => {
      const g = activeGames.get(channelId);
      if (!g) return collector.stop();

      const letter = m.content.trim().toLowerCase();

      if (g.guessed.has(letter)) {
        await m.react('♻️');
        return;
      }

      g.guessed.add(letter);
      await m.react(g.word.includes(letter) ? '✅' : '❌');

      if (!g.word.includes(letter)) g.wrong++;

      const display = buildDisplay(g.word, g.guessed);
      const allGuessed = g.word.split('').every(l => g.guessed.has(l));
      const wrongLetters = [...g.guessed].filter(l => !g.word.includes(l));

      if (allGuessed) {
        activeGames.delete(channelId);
        collector.stop('won');
        const embed = new EmbedBuilder()
          .setTitle('🎉 Hangman — You Won!!')
          .setColor(0x57F287)
          .setDescription(`${HANGMAN_STAGES[g.wrong]}\n\n**${g.word.toUpperCase()}**\n\n✅ **${m.author.username}** saved the person! The word was **${g.word.toUpperCase()}**!`)
          .setFooter({ text: 'Type !hangman to play again! | Wisteria 🌸' });
        return m.channel.send({ embeds: [embed] });
      }

      if (g.wrong >= 6) {
        activeGames.delete(channelId);
        collector.stop('lost');
        const embed = new EmbedBuilder()
          .setTitle('💀 Hangman — Game Over!')
          .setColor(0xED4245)
          .setDescription(`${HANGMAN_STAGES[6]}\n\n❌ The person was hanged! The word was **${g.word.toUpperCase()}**`)
          .setFooter({ text: 'Type !hangman to try again! | Wisteria 🌸' });
        return m.channel.send({ embeds: [embed] });
      }

      const embed = new EmbedBuilder()
        .setTitle(`💀 Hangman — ${g.wrong}/6 Wrong`)
        .setColor(g.wrong >= 4 ? 0xED4245 : 0xFEE75C)
        .setDescription(
          `${HANGMAN_STAGES[g.wrong]}\n\n${display}\n\n` +
          `Wrong guesses: ${wrongLetters.length ? wrongLetters.join(', ').toUpperCase() : '*none*'}`
        )
        .setFooter({ text: 'Type a letter to guess!' });
      m.channel.send({ embeds: [embed] });
    });

    collector.on('end', (_, reason) => {
      if (reason === 'time' && activeGames.has(channelId)) {
        const g = activeGames.get(channelId);
        activeGames.delete(channelId);
        message.channel.send(`⏰ Hangman timed out! The word was **${g.word.toUpperCase()}** 😔`);
      }
    });
  },
};
