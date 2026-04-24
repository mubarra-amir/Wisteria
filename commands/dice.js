const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'dice',
  description: 'Roll a dice',
  async execute(message, args) {
    const sides = parseInt(args[0]) || 6;
    if (sides < 2 || sides > 1000) return message.reply('❌ Sides must be between 2 and 1000!');

    const result = Math.floor(Math.random() * sides) + 1;

    const embed = new EmbedBuilder()
      .setTitle('🎲 Dice Roll!')
      .setColor(0xFF6B6B)
      .setDescription(`You rolled a **d${sides}** and got...`)
      .addFields({ name: '🎯 Result', value: `**${result}**`, inline: true })
      .setFooter({ text: `Rolled by ${message.author.username}` });

    message.reply({ embeds: [embed] });
  },
};
