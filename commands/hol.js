const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const suits = ['♠️', '♥️', '♦️', '♣️'];
const ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];

function randomCard() {
  return {
    rank: ranks[Math.floor(Math.random() * ranks.length)],
    suit: suits[Math.floor(Math.random() * suits.length)],
    value: Math.floor(Math.random() * ranks.length),
  };
}

// sessions keyed by userId
const sessions = new Map();

module.exports = {
  name: 'hol',
  description: 'Higher or Lower card game',
  async execute(message) {
    const userId = message.author.id;
    const card = randomCard();
    sessions.set(userId, { card, score: 0, userId, username: message.author.username });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`hol:higher:${userId}`).setLabel('⬆️ Higher').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId(`hol:lower:${userId}`).setLabel('⬇️ Lower').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId(`hol:cashout:${userId}`).setLabel('💰 Cash Out').setStyle(ButtonStyle.Secondary),
    );

    const embed = new EmbedBuilder()
      .setTitle('🃏 Higher or Lower!')
      .setColor(0xFEE75C)
      .setDescription(`Current card: **${card.rank}${card.suit}**\n\nWill the next card be higher or lower?`)
      .addFields({ name: '⭐ Score', value: `${sessions.get(userId).score}`, inline: true })
      .setFooter({ text: `Player: ${message.author.username}` });

    await message.reply({ embeds: [embed], components: [row] });
  },

  async handleButton(interaction, data) {
    const [choice, userId] = data;

    if (interaction.user.id !== userId) {
      return interaction.reply({ content: '❌ This is not your game!', ephemeral: true });
    }

    const session = sessions.get(userId);
    if (!session) return interaction.reply({ content: '❌ No active game found.', ephemeral: true });

    if (choice === 'cashout') {
      sessions.delete(userId);
      const embed = new EmbedBuilder()
        .setTitle('💰 Cashed Out!')
        .setColor(0x57F287)
        .setDescription(`You cashed out with a score of **${session.score}**! Nice play!`);
      return interaction.update({ embeds: [embed], components: [] });
    }

    const newCard = randomCard();
    const correct =
      (choice === 'higher' && newCard.value >= session.card.value) ||
      (choice === 'lower' && newCard.value <= session.card.value);

    if (correct) {
      session.score += 1;
      session.card = newCard;

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`hol:higher:${userId}`).setLabel('⬆️ Higher').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`hol:lower:${userId}`).setLabel('⬇️ Lower').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`hol:cashout:${userId}`).setLabel('💰 Cash Out').setStyle(ButtonStyle.Secondary),
      );

      const embed = new EmbedBuilder()
        .setTitle('✅ Correct! Keep going?')
        .setColor(0x57F287)
        .setDescription(`New card: **${newCard.rank}${newCard.suit}**\n\nWill the next card be higher or lower?`)
        .addFields({ name: '⭐ Score', value: `${session.score}`, inline: true });

      return interaction.update({ embeds: [embed], components: [row] });
    } else {
      sessions.delete(userId);
      const embed = new EmbedBuilder()
        .setTitle('❌ Wrong!')
        .setColor(0xED4245)
        .setDescription(`The card was **${newCard.rank}${newCard.suit}**.\nYou scored **${session.score}** point(s). Better luck next time!`);

      return interaction.update({ embeds: [embed], components: [] });
    }
  },
};
