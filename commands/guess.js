const { EmbedBuilder } = require('discord.js');

const activeGames = new Map();

module.exports = {
  name: 'guess',
  description: 'Guess the number! Usage: !guess [1-100] or !guess hard (1-1000)',
  async execute(message, args, client) {
    const userId = message.author.id;

    if (activeGames.has(userId)) {
      return message.reply('⚠️ You already have an active game! Type a number to guess, or `!guess stop` to quit.');
    }

    if (args[0] === 'stop') {
      if (!activeGames.has(userId)) return message.reply("❌ You don't have an active game!");
      const g = activeGames.get(userId);
      activeGames.delete(userId);
      return message.reply(`🛑 Game stopped! The number was **${g.number}** 🌸`);
    }

    const hard   = args[0] === 'hard';
    const maxNum = hard ? 1000 : 100;
    const maxAttempts = hard ? 10 : 7;
    const number = Math.floor(Math.random() * maxNum) + 1;

    activeGames.set(userId, { number, attempts: 0, maxAttempts, maxNum, guesses: [] });

    const embed = new EmbedBuilder()
      .setTitle(`🔢 Number Guessing Game! ${hard ? '🔴 HARD' : ''}`)
      .setColor(0x5865F2)
      .setDescription(
        `I've picked a number between **1 and ${maxNum}**.\n` +
        `You have **${maxAttempts} attempts** to guess it!\n\n` +
        `Type \`!guess stop\` to give up.`
      )
      .setFooter({ text: `Player: ${message.author.username} | !guess hard for harder mode!` });

    await message.reply({ embeds: [embed] });

    const filter = m => m.author.id === userId && !isNaN(m.content.trim()) && !m.content.startsWith('!');
    const collector = message.channel.createMessageCollector({ filter, time: 120000 });

    collector.on('collect', async (m) => {
      const game = activeGames.get(userId);
      if (!game) return collector.stop();

      const guess = parseInt(m.content.trim());
      if (guess < 1 || guess > game.maxNum) {
        return m.reply(`❌ Pick a number between **1 and ${game.maxNum}**!`);
      }

      if (game.guesses.includes(guess)) {
        return m.react('♻️');
      }

      game.attempts++;
      game.guesses.push(guess);

      if (guess === game.number) {
        activeGames.delete(userId);
        collector.stop('won');

        const xpReward = Math.max(20, (game.maxAttempts - game.attempts + 1) * 25);
        const key = `${message.guild.id}-${m.author.id}`;
        if (!client.xpData[key]) client.xpData[key] = { xp: 0, level: 1, username: m.author.username };
        client.xpData[key].xp += xpReward;

        const winEmbed = new EmbedBuilder()
          .setTitle('🎉 Correct!!')
          .setColor(0x57F287)
          .setDescription(`You guessed **${game.number}** in **${game.attempts}/${game.maxAttempts}** attempt(s)!\n+${xpReward} XP earned!\n\nGuesses: ${game.guesses.join(', ')}`)
          .setFooter({ text: 'Type !guess to play again!' });
        return m.channel.send({ embeds: [winEmbed] });
      }

      const remaining = game.maxAttempts - game.attempts;
      if (remaining <= 0) {
        activeGames.delete(userId);
        collector.stop('lost');
        const loseEmbed = new EmbedBuilder()
          .setTitle('💀 Game Over!')
          .setColor(0xED4245)
          .setDescription(`Out of attempts! The number was **${game.number}**.\n\nYour guesses: ${game.guesses.join(', ')}`)
          .setFooter({ text: 'Type !guess to try again!' });
        return m.channel.send({ embeds: [loseEmbed] });
      }

      const diff = Math.abs(guess - game.number);
      let tempHint = '';
      if (diff <= 2) tempHint = ' 🔥 SO CLOSE!!';
      else if (diff <= 5) tempHint = ' 🌡️ Very warm!';
      else if (diff <= 15) tempHint = ' ☀️ Getting warmer!';
      else if (diff <= 30) tempHint = ' 🌤️ Lukewarm...';
      else tempHint = ' ❄️ Ice cold!';

      const hint = guess < game.number ? `⬆️ Too low!${tempHint}` : `⬇️ Too high!${tempHint}`;
      const color = diff <= 5 ? 0xFF6B00 : diff <= 15 ? 0xFEE75C : 0x5865F2;

      const hintEmbed = new EmbedBuilder()
        .setColor(color)
        .setDescription(`${hint} **${remaining} attempt(s)** remaining.\nGuesses so far: ${game.guesses.join(', ')}`);
      m.channel.send({ embeds: [hintEmbed] });
    });

    collector.on('end', (_, reason) => {
      if (reason === 'time' && activeGames.has(userId)) {
        const game = activeGames.get(userId);
        activeGames.delete(userId);
        message.channel.send(`⏰ **${message.author.username}** ran out of time! The number was **${game.number}** 😔`);
      }
    });
  },
};
