const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

const ROWS = 6, COLS = 7;
const EMPTY = '⚫', P1 = '🔴', P2 = '🟡';
const NUM_EMOJIS = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣'];

const activeSessions = new Map();

function makeGrid() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(''));
}

function renderGrid(grid) {
  const display = { '': EMPTY, 'P1': P1, 'P2': P2 };
  const rows = grid.map(row => row.map(c => display[c]).join('')).join('\n');
  return NUM_EMOJIS.join('') + '\n' + rows;
}

function dropPiece(grid, col, player) {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (grid[r][col] === '') {
      grid[r][col] = player;
      return r;
    }
  }
  return -1; // column full
}

function checkWinner(grid) {
  // Horizontal, vertical, diagonal
  const directions = [[0,1],[1,0],[1,1],[1,-1]];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = grid[r][c];
      if (!cell) continue;
      for (const [dr, dc] of directions) {
        let count = 1;
        for (let i = 1; i < 4; i++) {
          const nr = r + dr * i, nc = c + dc * i;
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || grid[nr][nc] !== cell) break;
          count++;
        }
        if (count >= 4) return cell;
      }
    }
  }
  if (grid[0].every(c => c !== '')) return 'draw';
  return null;
}

function buildColButtons(sessionId, disabled = false) {
  // 7 buttons across two rows (4+3)
  const rows = [];
  const row1 = new ActionRowBuilder();
  for (let c = 0; c < 4; c++) {
    row1.addComponents(
      new ButtonBuilder()
        .setCustomId(`connect4:${sessionId}:${c}`)
        .setLabel(NUM_EMOJIS[c])
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(disabled)
    );
  }
  const row2 = new ActionRowBuilder();
  for (let c = 4; c < 7; c++) {
    row2.addComponents(
      new ButtonBuilder()
        .setCustomId(`connect4:${sessionId}:${c}`)
        .setLabel(NUM_EMOJIS[c])
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(disabled)
    );
  }
  rows.push(row1, row2);
  return rows;
}

module.exports = {
  name: 'connect4',
  aliases: ['c4'],
  description: 'Play Connect 4! Usage: !connect4 @user',

  async execute(message) {
    const opponent = message.mentions.users.first();
    if (!opponent || opponent.bot || opponent.id === message.author.id) {
      return message.reply('❓ Usage: `!connect4 @user` — Challenge a friend to Connect 4! 🔴🟡');
    }

    const grid = makeGrid();
    const embed = new EmbedBuilder()
      .setTitle('🔴🟡 Connect 4!')
      .setColor(0xFEE75C)
      .setDescription(
        `**${message.author.username}** (${P1}) vs **${opponent.username}** (${P2})\n\n` +
        renderGrid(grid) + `\n\n${P1} **${message.author.username}**'s turn!\nClick a number to drop your piece!`
      )
      .setFooter({ text: 'First to connect 4 wins! | Wisteria 🌸' });

    const sent = await message.reply({ embeds: [embed], components: buildColButtons('placeholder') });

    const session = {
      grid,
      p1: message.author.id,
      p2: opponent.id,
      p1name: message.author.username,
      p2name: opponent.username,
      currentTurn: message.author.id, // P1 goes first
    };
    activeSessions.set(sent.id, session);
    await sent.edit({ components: buildColButtons(sent.id) });

    setTimeout(() => {
      if (activeSessions.has(sent.id)) {
        activeSessions.delete(sent.id);
        sent.edit({ components: buildColButtons(sent.id, true) }).catch(() => {});
      }
    }, 600000);
  },

  async handleButton(interaction, data, client) {
    const [sessionId, colStr] = data;
    const col     = parseInt(colStr);
    const session = activeSessions.get(sessionId);

    if (!session) return interaction.reply({ content: '❌ This game has expired!', ephemeral: true });

    if (interaction.user.id !== session.currentTurn) {
      return interaction.reply({ content: "⏳ It's not your turn!", ephemeral: true });
    }

    if (interaction.user.id !== session.p1 && interaction.user.id !== session.p2) {
      return interaction.reply({ content: "❌ You're not in this game!", ephemeral: true });
    }

    const player  = interaction.user.id === session.p1 ? 'P1' : 'P2';
    const dropped = dropPiece(session.grid, col, player);

    if (dropped === -1) {
      return interaction.reply({ content: '❌ That column is full! Choose another.', ephemeral: true });
    }

    const winner = checkWinner(session.grid);

    if (winner) {
      activeSessions.delete(sessionId);
      let desc;
      if (winner === 'draw') {
        desc = renderGrid(session.grid) + '\n\n😐 **It\'s a draw!!**';
      } else {
        const winnerName = winner === 'P1' ? session.p1name : session.p2name;
        const winnerEmoji = winner === 'P1' ? P1 : P2;
        desc = renderGrid(session.grid) + `\n\n🎉 ${winnerEmoji} **${winnerName}** wins!!`;
      }
      const embed = new EmbedBuilder()
        .setTitle(`🔴🟡 Connect 4 — ${winner === 'draw' ? "It's a Draw!" : 'Winner!'}`)
        .setColor(winner === 'draw' ? 0xFEE75C : winner === 'P1' ? 0xED4245 : 0xFEE75C)
        .setDescription(desc)
        .setFooter({ text: 'Type !connect4 @user to play again! | Wisteria 🌸' });
      return interaction.update({ embeds: [embed], components: buildColButtons(sessionId, true) });
    }

    // Switch turns
    session.currentTurn = session.currentTurn === session.p1 ? session.p2 : session.p1;
    const nextName  = session.currentTurn === session.p1 ? session.p1name : session.p2name;
    const nextEmoji = session.currentTurn === session.p1 ? P1 : P2;

    const embed = new EmbedBuilder()
      .setTitle('🔴🟡 Connect 4!')
      .setColor(0xFEE75C)
      .setDescription(
        `**${session.p1name}** (${P1}) vs **${session.p2name}** (${P2})\n\n` +
        renderGrid(session.grid) + `\n\n${nextEmoji} **${nextName}**'s turn!`
      )
      .setFooter({ text: 'Click a column number to drop! | Wisteria 🌸' });

    interaction.update({ embeds: [embed], components: buildColButtons(sessionId) });
  },
};
