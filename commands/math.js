const { EmbedBuilder } = require('discord.js');

const activeSessions = new Map(); // channelId → session

function generateQuestion(difficulty) {
  const ops = {
    easy:   ['+', '-'],
    medium: ['+', '-', '*'],
    hard:   ['+', '-', '*', '/'],
  };

  const ranges = {
    easy:   [1, 20],
    medium: [2, 50],
    hard:   [2, 100],
  };

  const [min, max] = ranges[difficulty];
  const op = ops[difficulty][Math.floor(Math.random() * ops[difficulty].length)];

  let a = Math.floor(Math.random() * (max - min)) + min;
  let b = Math.floor(Math.random() * (max - min)) + min;
  let answer;

  if (op === '-') {
    // Ensure no negatives on easy
    if (difficulty === 'easy' && a < b) [a, b] = [b, a];
    answer = a - b;
  } else if (op === '*') {
    // Keep manageable
    a = Math.floor(Math.random() * 12) + 2;
    b = Math.floor(Math.random() * 12) + 2;
    answer = a * b;
  } else if (op === '/') {
    // Ensure clean division
    b = Math.floor(Math.random() * 10) + 2;
    answer = Math.floor(Math.random() * 20) + 2;
    a = b * answer;
  } else {
    answer = a + b;
  }

  const xp = { easy: 15, medium: 30, hard: 60 };
  const time = { easy: 15000, medium: 20000, hard: 30000 };

  return { question: `${a} ${op} ${b}`, answer: String(answer), xp: xp[difficulty], time: time[difficulty], difficulty };
}

module.exports = {
  name: 'math',
  description: 'Race to solve a math problem! Usage: !math [easy|medium|hard]',
  async execute(message, args, client) {
    const channelId = message.channel.id;

    if (activeSessions.has(channelId)) {
      return message.reply('⚠️ A math challenge is already active! Answer it first!');
    }

    const diff = ['easy', 'medium', 'hard'].includes(args[0]) ? args[0] : 'medium';
    const q    = generateQuestion(diff);
    activeSessions.set(channelId, q);

    const diffEmoji = { easy: '🟢', medium: '🟡', hard: '🔴' };
    const timeSeconds = q.time / 1000;

    const embed = new EmbedBuilder()
      .setTitle(`🧮 Math Challenge — ${diffEmoji[diff]} ${diff.charAt(0).toUpperCase() + diff.slice(1)}!`)
      .setColor(0x5865F2)
      .setDescription(
        `Solve this as fast as you can!\n\n` +
        `# \`${q.question} = ?\`\n\n` +
        `⏱️ **${timeSeconds}s** | 🏆 **+${q.xp} XP** | Type your answer!`
      )
      .setFooter({ text: 'Wisteria 🌸 | !math easy/medium/hard' });

    await message.channel.send({ embeds: [embed] });

    const filter = m => !m.author.bot && !isNaN(m.content.trim());
    const collector = message.channel.createMessageCollector({ filter, time: q.time });

    const startTime = Date.now();

    collector.on('collect', async (m) => {
      if (m.content.trim() === q.answer) {
        activeSessions.delete(channelId);
        collector.stop('correct');

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        const key = `${message.guild.id}-${m.author.id}`;
        if (!client.xpData[key]) client.xpData[key] = { xp: 0, level: 1, username: m.author.username };
        client.xpData[key].xp += q.xp;

        const embed = new EmbedBuilder()
          .setTitle('✅ Correct!')
          .setColor(0x57F287)
          .setDescription(`🎉 **${m.author.username}** solved it in **${elapsed}s**!\n\n\`${q.question} = ${q.answer}\`\n\n+${q.xp} XP!`)
          .setFooter({ text: 'Type !math to play again!' });
        m.channel.send({ embeds: [embed] });
      }
    });

    collector.on('end', (_, reason) => {
      if (reason !== 'correct') {
        activeSessions.delete(channelId);
        const embed = new EmbedBuilder()
          .setTitle('⏰ Time\'s Up!')
          .setColor(0xED4245)
          .setDescription(`Nobody got it! The answer was \`${q.question} = **${q.answer}**\``)
          .setFooter({ text: 'Type !math to try again!' });
        message.channel.send({ embeds: [embed] });
      }
    });
  },
};
