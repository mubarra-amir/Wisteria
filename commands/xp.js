const { EmbedBuilder } = require('discord.js');

const WISTERIA_COLOR = 0x9B59B6;

function getProgressBar(xp, level) {
  const needed = level * 100;
  const pct    = Math.floor((xp / needed) * 20);
  return '█'.repeat(pct) + '░'.repeat(20 - pct);
}

function getRank(level) {
  if (level >= 50) return '👑 Wisteria Legend';
  if (level >= 25) return '⭐ Server Star';
  if (level >= 10) return '💜 Wisteria Friend';
  if (level >= 5)  return '🌸 Petal Collector';
  return '🌱 Sprout';
}

const xpCmd = {
  name: 'xp',
  description: "Check your XP and level, or check someone else's",
  async execute(message, args, client) {
    const target  = message.mentions.users.first() || message.author;
    const guildId = message.guild?.id;
    if (!guildId) return;

    const key  = `${guildId}-${target.id}`;
    const data = client.xpData[key];

    if (!data) {
      if (target.id === message.author.id) {
        return message.reply("You don't have any XP yet! Start chatting or playing games to earn some! 🌸");
      } else {
        return message.reply(`**${target.username}** doesn't have any XP yet!`);
      }
    }

    const progressBar = getProgressBar(data.xp, data.level);
    const rank        = getRank(data.level);

    const embed = new EmbedBuilder()
      .setColor(WISTERIA_COLOR)
      .setTitle(`📊 ${target.username}'s Profile`)
      .setThumbnail(target.displayAvatarURL())
      .addFields(
        { name: '🏅 Rank',     value: rank,                          inline: true },
        { name: '⭐ Level',    value: `**${data.level}**`,            inline: true },
        { name: '✨ XP',       value: `**${data.xp}** / ${data.level * 100}`, inline: true },
        { name: '📈 Progress', value: `\`${progressBar}\`` },
      )
      .setFooter({ text: 'Keep chatting & playing games to level up! | Wisteria 🌸' });

    message.reply({ embeds: [embed] });
  },
};

const leaderboardCmd = {
  name: 'leaderboard',
  description: 'See the server XP leaderboard!',
  async execute(message, args, client) {
    const guildId = message.guild?.id;
    if (!guildId) return;

    const entries = Object.entries(client.xpData)
      .filter(([key]) => key.startsWith(guildId) && !key.includes('xp-'))
      .map(([key, data]) => ({ ...data, userId: key.replace(`${guildId}-`, '') }))
      .sort((a, b) => b.level !== a.level ? b.level - a.level : b.xp - a.xp)
      .slice(0, 10);

    if (entries.length === 0) {
      return message.reply("No XP data yet! Start chatting to earn XP 🌸");
    }

    const medals = ['🥇', '🥈', '🥉'];
    const lines  = entries.map((e, i) => {
      const medal = medals[i] || `${i + 1}.`;
      return `${medal} **${e.username || 'Unknown'}** — Level **${e.level}** (${e.xp} XP) ${getRank(e.level)}`;
    });

    const embed = new EmbedBuilder()
      .setColor(WISTERIA_COLOR)
      .setTitle('🏆 Server XP Leaderboard')
      .setDescription(lines.join('\n'))
      .setFooter({ text: 'Earn XP by chatting & playing games! | Wisteria 🌸' });

    message.reply({ embeds: [embed] });
  },
};

module.exports = [xpCmd, leaderboardCmd];
