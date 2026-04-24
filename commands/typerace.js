const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const SENTENCES = [
  "The quick brown fox jumps over the lazy dog.",
  "Wisteria blooms in clusters of purple and white flowers every spring.",
  "Playing games with friends makes every Discord server come alive.",
  "The stars above us shine brightest on the darkest nights.",
  "Champions are made from something deep inside them, a desire and a dream.",
  "In the middle of every difficulty lies opportunity and growth.",
  "Life is like a video game, you just have to figure out the controls.",
  "Not all those who wander are lost, some are just exploring new paths.",
  "The only way to do great work is to love what you do.",
  "Adventure awaits those who are brave enough to seek it.",
  "Every expert was once a beginner who refused to give up.",
  "The best time to plant a tree was twenty years ago, the second best time is now.",
  "Do not watch the clock, do what it does and keep going.",
  "Believe you can and you are halfway there to your goal.",
  "Creativity is intelligence having fun and making the world better.",
];

const activeSessions = new Map(); // channelId → session

module.exports = {
  name: 'typerace',
  aliases: ['typing', 'race'],
  description: 'Race to type a sentence the fastest! Usage: !typerace',
  async execute(message, args, client) {
    const channelId = message.channel.id;

    if (activeSessions.has(channelId)) {
      return message.reply('⚠️ A typing race is already happening! Wait for it to finish.');
    }

    const sentence  = SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
    const wordCount = sentence.split(' ').length;

    const countdownEmbed = new EmbedBuilder()
      .setTitle('⌨️ Typing Race — Get Ready!')
      .setColor(0xFEE75C)
      .setDescription('Starting in **3 seconds...** Get your fingers ready! 🌸')
      .setFooter({ text: 'Type the sentence EXACTLY as shown! | Wisteria 🌸' });

    await message.channel.send({ embeds: [countdownEmbed] });

    await new Promise(r => setTimeout(r, 3000));

    const startTime = Date.now();
    activeSessions.set(channelId, { sentence, startTime, finished: [] });

    const goEmbed = new EmbedBuilder()
      .setTitle('⌨️ Typing Race — GO!!! 🏁')
      .setColor(0x57F287)
      .setDescription(
        `**Type this sentence as fast as you can:**\n\n> ${sentence}\n\n` +
        `⏱️ Race ends in **30 seconds**!\n📊 ~${wordCount} words`
      )
      .setFooter({ text: 'Copy is disabled — type it manually! | Wisteria 🌸' });

    await message.channel.send({ embeds: [goEmbed] });

    const filter = m => !m.author.bot;
    const collector = message.channel.createMessageCollector({ filter, time: 30000 });

    collector.on('collect', async (m) => {
      const session = activeSessions.get(channelId);
      if (!session) return collector.stop();

      const typed = m.content.trim();
      const accuracy = calculateAccuracy(sentence, typed);

      if (accuracy >= 90) {
        // Valid finish
        const elapsed = (Date.now() - session.startTime) / 1000;
        const wpm = Math.round((wordCount / elapsed) * 60);
        const alreadyFinished = session.finished.some(f => f.userId === m.author.id);
        if (!alreadyFinished) {
          session.finished.push({
            userId: m.author.id,
            username: m.author.username,
            time: elapsed,
            wpm,
            accuracy,
          });
          const xp = Math.round(wpm * 0.5 + (accuracy - 90) * 2);
          const key = `${message.guild.id}-${m.author.id}`;
          if (!client.xpData[key]) client.xpData[key] = { xp: 0, level: 1, username: m.author.username };
          client.xpData[key].xp += xp;

          const place = session.finished.length;
          const medal = ['🥇', '🥈', '🥉'][place - 1] || `${place}th`;
          await m.reply(`${medal} **${m.author.username}** finished! **${wpm} WPM** | **${accuracy}%** accuracy | +${xp} XP`);
        }
      } else if (accuracy < 90 && typed.length >= sentence.length * 0.8) {
        await m.react('❌');
      }
    });

    collector.on('end', async () => {
      const session = activeSessions.get(channelId);
      activeSessions.delete(channelId);
      if (!session) return;

      if (session.finished.length === 0) {
        const embed = new EmbedBuilder()
          .setTitle('⏰ Typing Race — Time\'s Up!')
          .setColor(0xED4245)
          .setDescription(`Nobody finished in time! 😭\n\nThe sentence was:\n> ${sentence}`)
          .setFooter({ text: 'Type !typerace to try again!' });
        return message.channel.send({ embeds: [embed] });
      }

      const leaderboard = session.finished
        .sort((a, b) => a.time - b.time)
        .map((f, i) => {
          const medal = ['🥇', '🥈', '🥉'][i] || `${i + 1}.`;
          return `${medal} **${f.username}** — ${f.wpm} WPM | ${f.accuracy}% accuracy | ${f.time.toFixed(2)}s`;
        })
        .join('\n');

      const embed = new EmbedBuilder()
        .setTitle('🏁 Typing Race — Results!')
        .setColor(0x57F287)
        .setDescription(`${leaderboard}\n\n**Sentence:**\n> ${sentence}`)
        .setFooter({ text: 'Type !typerace for another round! | Wisteria 🌸' });

      message.channel.send({ embeds: [embed] });
    });
  },
};

function calculateAccuracy(target, typed) {
  const targetWords = target.toLowerCase().split(' ');
  const typedWords  = typed.toLowerCase().split(' ');
  let correct = 0;
  for (let i = 0; i < Math.min(targetWords.length, typedWords.length); i++) {
    if (targetWords[i] === typedWords[i]) correct++;
  }
  return Math.round((correct / targetWords.length) * 100);
}
