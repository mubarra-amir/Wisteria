const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require('discord.js');

const choices = ['rock', 'paper', 'scissors'];
const emoji   = { rock: '🪨', paper: '📄', scissors: '✂️' };

function getWinner(p1, p2) {
  if (p1 === p2) return 'tie';
  if (
    (p1 === 'rock'     && p2 === 'scissors') ||
    (p1 === 'paper'    && p2 === 'rock')     ||
    (p1 === 'scissors' && p2 === 'paper')
  ) return 'p1';
  return 'p2';
}

// Active PvP games: messageId → session
const pvpSessions = new Map();

module.exports = {
  name: 'rps',
  description: 'Rock Paper Scissors vs Bot or vs another player! Usage: !rps or !rps @user',

  async execute(message) {
    const opponent = message.mentions.users.first();

    // ── PvP Mode ──
    if (opponent) {
      if (opponent.bot) return message.reply("❌ You can't challenge a bot to PvP! Use `!rps` without a mention to play against me 🌸");
      if (opponent.id === message.author.id) return message.reply("😂 You can't challenge yourself! Use `!rps` to play against me 🌸");

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`rps:pvp:rock:${message.author.id}:${opponent.id}`).setLabel('🪨 Rock').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId(`rps:pvp:paper:${message.author.id}:${opponent.id}`).setLabel('📄 Paper').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`rps:pvp:scissors:${message.author.id}:${opponent.id}`).setLabel('✂️ Scissors').setStyle(ButtonStyle.Danger),
      );

      const embed = new EmbedBuilder()
        .setTitle('🪨📄✂️ Rock Paper Scissors — PvP Challenge!')
        .setColor(0x9B59B6)
        .setDescription(
          `**${message.author.username}** has challenged **${opponent.username}** to a game!\n\n` +
          `Both players: pick your move! Choices are hidden until both have picked.\n\n` +
          `⏳ You have **30 seconds** to choose!`
        )
        .setFooter({ text: '🌸 Wisteria — May the best player win!' });

      const sent = await message.reply({ embeds: [embed], components: [row] });

      pvpSessions.set(sent.id, {
        challenger: message.author.id,
        challenged: opponent.id,
        choices: {},
        messageId: sent.id,
      });

      // Auto-timeout
      setTimeout(() => {
        if (pvpSessions.has(sent.id)) {
          pvpSessions.delete(sent.id);
          const timeoutEmbed = new EmbedBuilder()
            .setTitle('⏰ PvP Timed Out!')
            .setColor(0xFEE75C)
            .setDescription("One or both players didn't choose in time! Game cancelled 😭")
            .setFooter({ text: 'Use !rps @user to try again!' });
          sent.edit({ embeds: [timeoutEmbed], components: [] }).catch(() => {});
        }
      }, 30000);

      return;
    }

    // ── vs Bot Mode ──
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('rps:bot:rock').setLabel('🪨 Rock').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('rps:bot:paper').setLabel('📄 Paper').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('rps:bot:scissors').setLabel('✂️ Scissors').setStyle(ButtonStyle.Danger),
    );

    const embed = new EmbedBuilder()
      .setTitle('🪨📄✂️ Rock Paper Scissors!')
      .setColor(0x5865F2)
      .setDescription('Choose your move!\n\nTip: Use `!rps @user` to challenge another player! 💜')
      .setFooter({ text: `Challenger: ${message.author.username}` });

    await message.reply({ embeds: [embed], components: [row] });
  },

  async handleButton(interaction, data, client) {
    const [mode, ...rest] = data;

    // ── vs Bot ──
    if (mode === 'bot') {
      const playerChoice = rest[0];
      const botChoice    = choices[Math.floor(Math.random() * 3)];
      const result       = getWinner(playerChoice, botChoice);

      const resultText = {
        tie: `😐 It's a **tie**! Both chose ${emoji[playerChoice]}`,
        p1:  `🎉 **You win!** ${emoji[playerChoice]} beats ${emoji[botChoice]}`,
        p2:  `😈 **I win!** ${emoji[botChoice]} beats ${emoji[playerChoice]}`,
      };

      const color = { tie: 0xFFFF00, p1: 0x57F287, p2: 0xED4245 };

      const embed = new EmbedBuilder()
        .setTitle('🪨📄✂️ Rock Paper Scissors — Result!')
        .setColor(color[result])
        .addFields(
          { name: 'Your pick',   value: `${emoji[playerChoice]} ${playerChoice}`, inline: true },
          { name: "Bot's pick",  value: `${emoji[botChoice]} ${botChoice}`,       inline: true },
          { name: 'Result',      value: resultText[result] },
        )
        .setFooter({ text: `Played by ${interaction.user.username} | !rps to play again!` });

      return interaction.update({ embeds: [embed], components: [] });
    }

    // ── PvP ──
    if (mode === 'pvp') {
      const [pick, challengerId, challengedId] = rest;
      const sessionId = interaction.message.id;
      const session   = pvpSessions.get(sessionId);

      if (!session) return interaction.reply({ content: '❌ This game session has expired!', ephemeral: true });

      // Only the two players can pick
      if (interaction.user.id !== challengerId && interaction.user.id !== challengedId) {
        return interaction.reply({ content: "❌ You're not in this game!", ephemeral: true });
      }

      // Prevent double-picking
      if (session.choices[interaction.user.id]) {
        return interaction.reply({ content: `✅ You already picked ${emoji[session.choices[interaction.user.id]]}! Waiting for the other player...`, ephemeral: true });
      }

      session.choices[interaction.user.id] = pick;

      // Acknowledge
      await interaction.reply({ content: `✅ You picked ${emoji[pick]}! Waiting for the other player...`, ephemeral: true });

      // Both have picked — reveal results
      if (Object.keys(session.choices).length === 2) {
        pvpSessions.delete(sessionId);

        const c1 = session.choices[challengerId];
        const c2 = session.choices[challengedId];
        const result = getWinner(c1, c2);

        let challenger, challenged;
        try {
          challenger = await client.users.fetch(challengerId);
          challenged = await client.users.fetch(challengedId);
        } catch {
          return;
        }

        const winnerName = result === 'p1' ? challenger.username
                         : result === 'p2' ? challenged.username
                         : null;

        const resultText = result === 'tie'
          ? `😐 **Tie!** Both picked ${emoji[c1]}`
          : `🏆 **${winnerName} wins!!** ${emoji[result === 'p1' ? c1 : c2]} beats ${emoji[result === 'p1' ? c2 : c1]}`;

        const color = result === 'tie' ? 0xFFFF00 : 0x57F287;

        const embed = new EmbedBuilder()
          .setTitle('🪨📄✂️ PvP Result!')
          .setColor(color)
          .addFields(
            { name: `${challenger.username}`, value: `${emoji[c1]} ${c1}`, inline: true },
            { name: 'VS',                     value: '⚔️',                  inline: true },
            { name: `${challenged.username}`, value: `${emoji[c2]} ${c2}`, inline: true },
            { name: '🏅 Result',              value: resultText },
          )
          .setFooter({ text: 'Use !rps @user to challenge again! | Wisteria 🌸' });

        await interaction.message.edit({ embeds: [embed], components: [] });
      }
    }
  },
};
