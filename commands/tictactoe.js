const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

const activeSessions = new Map(); // messageId → session

function buildBoard(cells) {
  const display = { '': '⬜', 'X': '❌', 'O': '⭕' };
  return [0, 3, 6].map(row =>
    cells.slice(row, row + 3).map(c => display[c]).join('')
  ).join('\n');
}

function checkWinner(cells) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];
  for (const [a,b,c] of lines) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) return cells[a];
  }
  return cells.every(c => c) ? 'draw' : null;
}

function getBotMove(cells) {
  // Simple AI: try to win, then block, then center, then random
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

  // Check win/block
  for (const mark of ['O', 'X']) {
    for (const [a,b,c] of lines) {
      const arr = [cells[a], cells[b], cells[c]];
      if (arr.filter(v => v === mark).length === 2 && arr.includes('')) {
        const idx = [a,b,c][arr.indexOf('')];
        if (cells[idx] === '') return idx;
      }
    }
  }
  // Center
  if (cells[4] === '') return 4;
  // Corners
  const corners = [0,2,6,8].filter(i => cells[i] === '');
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
  // Any empty
  const empty = cells.map((v,i) => v === '' ? i : -1).filter(i => i !== -1);
  return empty[Math.floor(Math.random() * empty.length)];
}

function buildRows(cells, sessionId, disabled = false) {
  const rows = [];
  for (let r = 0; r < 3; r++) {
    const row = new ActionRowBuilder();
    for (let c = 0; c < 3; c++) {
      const i = r * 3 + c;
      const mark = cells[i];
      const style = mark === 'X' ? ButtonStyle.Danger
                  : mark === 'O' ? ButtonStyle.Success
                  : ButtonStyle.Secondary;
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`tictactoe:${sessionId}:${i}`)
          .setLabel(mark || '·')
          .setStyle(style)
          .setDisabled(disabled || mark !== '')
      );
    }
    rows.push(row);
  }
  return rows;
}

module.exports = {
  name: 'tictactoe',
  aliases: ['ttt'],
  description: 'Play Tic-Tac-Toe! vs Bot or vs another player. Usage: !tictactoe or !tictactoe @user',

  async execute(message) {
    const opponent = message.mentions.users.first();

    const pvp = opponent && !opponent.bot && opponent.id !== message.author.id;
    const cells = Array(9).fill('');

    const embed = new EmbedBuilder()
      .setTitle('❌⭕ Tic-Tac-Toe!')
      .setColor(0x5865F2)
      .setDescription(
        pvp
          ? `**${message.author.username}** (❌) vs **${opponent.username}** (⭕)\n\n${buildBoard(cells)}\n\n❌ **${message.author.username}**'s turn!`
          : `**${message.author.username}** (❌) vs **Bot** (⭕)\n\n${buildBoard(cells)}\n\n❌ Your turn!`
      )
      .setFooter({ text: 'Wisteria 🌸 | !tictactoe @user for PvP' });

    const sent = await message.reply({ embeds: [embed], components: buildRows(cells, 'placeholder') });

    const session = {
      cells,
      challenger: message.author.id,
      challenged: pvp ? opponent.id : null,
      currentTurn: message.author.id,
      pvp,
      messageId: sent.id,
    };

    // Update buttons with real session id
    activeSessions.set(sent.id, session);
    await sent.edit({ components: buildRows(cells, sent.id) });

    // Auto-cleanup after 10 min
    setTimeout(() => {
      if (activeSessions.has(sent.id)) {
        activeSessions.delete(sent.id);
        sent.edit({ components: buildRows(session.cells, sent.id, true) }).catch(() => {});
      }
    }, 600000);
  },

  async handleButton(interaction, data, client) {
    const [sessionId, indexStr] = data;
    const index   = parseInt(indexStr);
    const session = activeSessions.get(sessionId);

    if (!session) return interaction.reply({ content: '❌ This game has expired!', ephemeral: true });

    // Turn enforcement
    if (interaction.user.id !== session.currentTurn) {
      return interaction.reply({ content: "⏳ It's not your turn!", ephemeral: true });
    }

    if (session.pvp && interaction.user.id !== session.challenger && interaction.user.id !== session.challenged) {
      return interaction.reply({ content: "❌ You're not in this game!", ephemeral: true });
    }

    if (!session.pvp && interaction.user.id !== session.challenger) {
      return interaction.reply({ content: "❌ This isn't your game!", ephemeral: true });
    }

    if (session.cells[index] !== '') {
      return interaction.reply({ content: "❌ That cell is already taken!", ephemeral: true });
    }

    const mark = interaction.user.id === session.challenger ? 'X' : 'O';
    session.cells[index] = mark;

    const winner = checkWinner(session.cells);

    if (winner) {
      activeSessions.delete(sessionId);
      let desc;
      if (winner === 'draw') {
        desc = `${buildBoard(session.cells)}\n\n😐 **It's a draw!!**`;
      } else {
        const winnerName = session.pvp
          ? (winner === 'X' ? (await client.users.fetch(session.challenger)).username : (await client.users.fetch(session.challenged)).username)
          : (winner === 'X' ? (await client.users.fetch(session.challenger)).username : 'Bot');
        desc = `${buildBoard(session.cells)}\n\n🎉 **${winnerName}** wins!!`;
      }
      const embed = new EmbedBuilder()
        .setTitle(`❌⭕ Tic-Tac-Toe — ${winner === 'draw' ? 'Draw!' : 'Winner!'}`)
        .setColor(winner === 'draw' ? 0xFEE75C : 0x57F287)
        .setDescription(desc)
        .setFooter({ text: 'Type !tictactoe to play again! | Wisteria 🌸' });
      return interaction.update({ embeds: [embed], components: buildRows(session.cells, sessionId, true) });
    }

    // Switch turns
    if (session.pvp) {
      session.currentTurn = interaction.user.id === session.challenger ? session.challenged : session.challenger;
    } else {
      // Bot plays
      const botIdx = getBotMove(session.cells);
      session.cells[botIdx] = 'O';

      const botWinner = checkWinner(session.cells);
      if (botWinner) {
        activeSessions.delete(sessionId);
        const desc = botWinner === 'draw'
          ? `${buildBoard(session.cells)}\n\n😐 **It's a draw!!**`
          : `${buildBoard(session.cells)}\n\n😈 **Bot wins!!** Better luck next time!`;
        const embed = new EmbedBuilder()
          .setTitle(`❌⭕ Tic-Tac-Toe — ${botWinner === 'draw' ? 'Draw!' : 'Bot Wins!'}`)
          .setColor(botWinner === 'draw' ? 0xFEE75C : 0xED4245)
          .setDescription(desc)
          .setFooter({ text: 'Type !tictactoe to play again! | Wisteria 🌸' });
        return interaction.update({ embeds: [embed], components: buildRows(session.cells, sessionId, true) });
      }
    }

    let nextName;
    try {
      const u = await client.users.fetch(session.currentTurn);
      nextName = u.username;
    } catch { nextName = 'Bot'; }

    const embed = new EmbedBuilder()
      .setTitle('❌⭕ Tic-Tac-Toe!')
      .setColor(0x5865F2)
      .setDescription(`${buildBoard(session.cells)}\n\n${session.cells.filter(c => c === 'X').length > session.cells.filter(c => c === 'O').length ? '⭕' : '❌'} **${nextName}**'s turn!`)
      .setFooter({ text: 'Wisteria 🌸' });

    interaction.update({ embeds: [embed], components: buildRows(session.cells, sessionId) });
  },
};
