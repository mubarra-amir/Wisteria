const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const questions = {
  easy: [
    { q: 'What planet is known as the Red Planet?', a: 'mars', hint: 'Our neighbor in the solar system' },
    { q: 'How many sides does a hexagon have?', a: '6', hint: '"Hex" = 6 in Greek' },
    { q: 'What is the capital of France?', a: 'paris', hint: 'City of Love 💕' },
    { q: 'What gas do plants absorb from the atmosphere?', a: 'carbon dioxide', hint: 'Also written as CO2' },
    { q: 'Who painted the Mona Lisa?', a: 'leonardo da vinci', hint: 'Also invented many things' },
    { q: 'What is the largest ocean on Earth?', a: 'pacific', hint: 'It covers more than 30% of Earth' },
    { q: 'What is 12 × 12?', a: '144', hint: 'A dozen dozens' },
    { q: 'What animal is the fastest on land?', a: 'cheetah', hint: 'It can reach 70 mph!' },
    { q: 'How many colors are in a rainbow?', a: '7', hint: 'ROY G BIV' },
    { q: 'What is the largest planet in our solar system?', a: 'jupiter', hint: 'It has a famous giant storm' },
    { q: 'How many days are in a leap year?', a: '366', hint: 'One more than a normal year' },
    { q: 'What is the closest star to Earth?', a: 'sun', hint: 'You see it every day' },
    { q: 'What do bees produce?', a: 'honey', hint: 'Sweet and golden' },
    { q: 'What is the tallest mountain on Earth?', a: 'mount everest', hint: 'In the Himalayas' },
    { q: 'How many legs does a spider have?', a: '8', hint: 'More than insects' },
  ],
  medium: [
    { q: 'What is the chemical symbol for gold?', a: 'au', hint: 'From the Latin "aurum"' },
    { q: 'What is the smallest country in the world?', a: 'vatican city', hint: "It's inside Rome, Italy" },
    { q: 'What language has the most native speakers?', a: 'mandarin', hint: 'Spoken primarily in China' },
    { q: 'How many bones are in the adult human body?', a: '206', hint: 'Between 200 and 210' },
    { q: 'What year did World War II end?', a: '1945', hint: 'Mid-1940s' },
    { q: 'What is the speed of light (approx km/s)?', a: '300000', hint: '3 × 10^5 km/s' },
    { q: 'What currency does Japan use?', a: 'yen', hint: 'Symbol: ¥' },
    { q: 'Which element has the symbol O?', a: 'oxygen', hint: 'We breathe it' },
    { q: 'What is the largest continent?', a: 'asia', hint: 'Home to over 4 billion people' },
    { q: 'Who wrote Romeo and Juliet?', a: 'shakespeare', hint: 'Also wrote Hamlet' },
    { q: 'What is the square root of 144?', a: '12', hint: '12 × 12 = 144' },
    { q: 'In what year did the Titanic sink?', a: '1912', hint: 'Early 20th century' },
    { q: 'What is the hardest natural substance?', a: 'diamond', hint: 'Rates 10 on the Mohs scale' },
    { q: 'How many strings does a standard guitar have?', a: '6', hint: 'EADGBE' },
    { q: 'What is the longest river in the world?', a: 'nile', hint: 'Located in Africa' },
  ],
  hard: [
    { q: 'What is the atomic number of Carbon?', a: '6', hint: 'Think of the periodic table row' },
    { q: 'Who developed the theory of general relativity?', a: 'einstein', hint: 'E = mc²' },
    { q: 'What is the capital of Kazakhstan?', a: 'astana', hint: 'Also known as Nur-Sultan' },
    { q: 'What year was the first iPhone released?', a: '2007', hint: 'Steve Jobs unveiled it' },
    { q: 'How many moons does Mars have?', a: '2', hint: 'Phobos and Deimos' },
    { q: 'What is the smallest bone in the human body?', a: 'stapes', hint: "It's in your ear" },
    { q: 'What programming language was created by Guido van Rossum?', a: 'python', hint: 'Named after a comedy show' },
    { q: 'What is Pi to 5 decimal places?', a: '3.14159', hint: 'Starts with 3.14...' },
    { q: 'Which element has the highest melting point?', a: 'tungsten', hint: 'Symbol: W' },
    { q: 'In what year was the World Wide Web invented?', a: '1989', hint: 'Tim Berners-Lee created it' },
    { q: 'What is the rarest blood type?', a: 'ab negative', hint: 'Only ~0.6% of people have it' },
    { q: 'What is the name of the longest bone in the body?', a: 'femur', hint: 'In your thigh' },
  ],
};

const DIFFICULTY_CONFIG = {
  easy:   { color: 0x57F287, emoji: '🟢', time: 30000, xp: 30 },
  medium: { color: 0xFEE75C, emoji: '🟡', time: 25000, xp: 50 },
  hard:   { color: 0xED4245, emoji: '🔴', time: 20000, xp: 100 },
};

// Active sessions per channel
const activeSessions = new Map();

module.exports = {
  name: 'trivia',
  description: 'Answer a trivia question! Usage: !trivia [easy|medium|hard]',
  async execute(message, args, client) {
    const channelId = message.channel.id;

    if (activeSessions.has(channelId)) {
      return message.reply('⚠️ A trivia question is already active in this channel! Answer it first, or wait for time to run out.');
    }

    const diffArg = (args[0] || 'medium').toLowerCase();
    const diff = ['easy', 'medium', 'hard'].includes(diffArg) ? diffArg : 'medium';
    const config = DIFFICULTY_CONFIG[diff];
    const pool = questions[diff];

    const q = pool[Math.floor(Math.random() * pool.length)];
    activeSessions.set(channelId, q);

    const timeSeconds = config.time / 1000;

    const embed = new EmbedBuilder()
      .setTitle(`${config.emoji} Trivia — ${diff.charAt(0).toUpperCase() + diff.slice(1)}!`)
      .setColor(config.color)
      .setDescription(`**${q.q}**`)
      .addFields(
        { name: '💡 Hint', value: `||${q.hint}||`, inline: true },
        { name: '⏱️ Time', value: `${timeSeconds}s`, inline: true },
        { name: '🏆 XP Reward', value: `+${config.xp} XP`, inline: true },
      )
      .setFooter({ text: 'Type your answer in chat! Use !trivia easy/medium/hard to choose difficulty.' });

    await message.channel.send({ embeds: [embed] });

    const filter = m => !m.author.bot;
    const collector = message.channel.createMessageCollector({ filter, time: config.time });

    collector.on('collect', async (m) => {
      if (m.content.toLowerCase().trim() === q.a.toLowerCase()) {
        activeSessions.delete(channelId);
        collector.stop('correct');

        // Give bonus XP for trivia
        const key = `${message.guild.id}-${m.author.id}`;
        if (!client.xpData[key]) client.xpData[key] = { xp: 0, level: 1, username: m.author.username };
        client.xpData[key].xp += config.xp;

        const winEmbed = new EmbedBuilder()
          .setTitle('✅ Correct Answer!')
          .setColor(0x57F287)
          .setDescription(`🎉 **${m.author.username}** got it right!\n\nThe answer was: **${q.a}**\n+${config.xp} XP earned!`)
          .setFooter({ text: 'Type !trivia [easy|medium|hard] to play again!' });

        await m.channel.send({ embeds: [winEmbed] });
      }
    });

    collector.on('end', (_, reason) => {
      if (reason !== 'correct') {
        activeSessions.delete(channelId);
        const timeEmbed = new EmbedBuilder()
          .setTitle('⏰ Time\'s Up!')
          .setColor(0xED4245)
          .setDescription(`Nobody got it! The answer was: **${q.a}**`)
          .setFooter({ text: 'Type !trivia to try a new question!' });
        message.channel.send({ embeds: [timeEmbed] });
      }
    });
  },
};
