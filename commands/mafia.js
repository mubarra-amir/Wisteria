const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

/*
 * MAFIA GAME — Full Discord implementation
 *
 * Roles: Mafia, Detective, Doctor, Villager
 * Phases: Lobby → Night → Day → Vote → repeat
 *
 * Sessions keyed by guildId
 */

const sessions = new Map();

const ROLES = {
  MAFIA: { name: 'Mafia', emoji: '🔫', team: 'mafia' },
  DETECTIVE: { name: 'Detective', emoji: '🔍', team: 'village' },
  DOCTOR: { name: 'Doctor', emoji: '💉', team: 'village' },
  VILLAGER: { name: 'Villager', emoji: '🧑‍🌾', team: 'village' },
};

function assignRoles(players) {
  const count = players.length;
  const roles = [];

  const mafiaCount = count >= 7 ? 2 : 1;
  for (let i = 0; i < mafiaCount; i++) roles.push('MAFIA');
  if (count >= 4) roles.push('DETECTIVE');
  if (count >= 5) roles.push('DOCTOR');
  while (roles.length < count) roles.push('VILLAGER');

  // Shuffle
  for (let i = roles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [roles[i], roles[j]] = [roles[j], roles[i]];
  }

  return players.map((p, i) => ({ ...p, role: roles[i], alive: true }));
}

function checkWin(session) {
  const alive = session.players.filter(p => p.alive);
  const mafiaAlive = alive.filter(p => p.role === 'MAFIA');
  const villageAlive = alive.filter(p => p.role !== 'MAFIA');

  if (mafiaAlive.length === 0) return 'village';
  if (mafiaAlive.length >= villageAlive.length) return 'mafia';
  return null;
}

module.exports = {
  name: 'mafia',
  description: 'Start a Mafia party game',

  async execute(message, args, client) {
    const guildId = message.guild.id;
    const sub = args[0];

    // --- START ---
    if (!sub || sub === 'start') {
      if (sessions.has(guildId)) {
        return message.reply('⚠️ A Mafia game is already in progress! Use `!mafia end` to cancel it.');
      }

      const session = {
        hostId: message.author.id,
        channelId: message.channel.id,
        players: [],
        phase: 'lobby',
        day: 0,
        votes: {},
        nightActions: {},
        lobbyMessageId: null,
      };
      sessions.set(guildId, session);

      // Add host
      session.players.push({ id: message.author.id, username: message.author.username, alive: true });

      const embed = buildLobbyEmbed(session);
      const row = buildLobbyRow(guildId);
      const sent = await message.channel.send({ embeds: [embed], components: [row] });
      session.lobbyMessageId = sent.id;

      await message.reply('🎭 Mafia game lobby created! Others can join by clicking the button. Host: use `!mafia begin` when ready (min 4 players).');
      return;
    }

    // --- BEGIN (host only) ---
    if (sub === 'begin') {
      const session = sessions.get(guildId);
      if (!session) return message.reply('No active lobby. Use `!mafia start` first.');
      if (session.hostId !== message.author.id) return message.reply('Only the host can begin the game!');
      if (session.players.length < 4) return message.reply('Need at least **4 players** to start!');

      session.players = assignRoles(session.players);
      session.phase = 'night';
      session.day = 1;

      // Send each player their role via DM
      for (const p of session.players) {
        const roleInfo = ROLES[p.role];
        const roleEmbed = new EmbedBuilder()
          .setTitle(`🎭 Your Role: ${roleInfo.emoji} ${roleInfo.name}`)
          .setColor(p.role === 'MAFIA' ? 0xED4245 : 0x57F287)
          .setDescription(getRoleDescription(p.role, session))
          .setFooter({ text: 'Keep your role SECRET!' });

        try {
          const member = await message.guild.members.fetch(p.id);
          await member.send({ embeds: [roleEmbed] });
        } catch {
          await message.channel.send(`⚠️ Couldn't DM <@${p.id}> — please enable DMs!`);
        }
      }

      await startNightPhase(message.channel, session, guildId, client);
      return;
    }

    // --- END ---
    if (sub === 'end') {
      if (!sessions.has(guildId)) return message.reply('No active game.');
      const session = sessions.get(guildId);
      if (session.hostId !== message.author.id && !message.member.permissions.has('ManageMessages')) {
        return message.reply('Only the host or a moderator can end the game!');
      }
      sessions.delete(guildId);
      return message.channel.send('🛑 Mafia game ended by host.');
    }

    // --- STATUS ---
    if (sub === 'status') {
      const session = sessions.get(guildId);
      if (!session) return message.reply('No active game.');
      const alive = session.players.filter(p => p.alive).map(p => `• ${p.username}`).join('\n');
      const dead = session.players.filter(p => !p.alive).map(p => `• ~~${p.username}~~`).join('\n');

      const embed = new EmbedBuilder()
        .setTitle(`🎭 Mafia — Day ${session.day} | Phase: ${session.phase}`)
        .setColor(0x5865F2)
        .addFields(
          { name: `✅ Alive (${session.players.filter(p=>p.alive).length})`, value: alive || 'None', inline: true },
          { name: `💀 Dead (${session.players.filter(p=>!p.alive).length})`, value: dead || 'None', inline: true },
        );
      return message.channel.send({ embeds: [embed] });
    }

    message.reply('Unknown subcommand. Try `!mafia start`, `!mafia begin`, `!mafia status`, `!mafia end`');
  },

  async handleButton(interaction, data, client) {
    const [action, guildId] = data;
    const session = sessions.get(guildId || interaction.guild.id);

    // Join lobby
    if (action === 'join') {
      if (!session || session.phase !== 'lobby') {
        return interaction.reply({ content: 'Game is not in lobby phase!', ephemeral: true });
      }
      if (session.players.find(p => p.id === interaction.user.id)) {
        return interaction.reply({ content: 'You already joined!', ephemeral: true });
      }
      session.players.push({ id: interaction.user.id, username: interaction.user.username, alive: true });

      const embed = buildLobbyEmbed(session);
      const row = buildLobbyRow(interaction.guild.id);
      await interaction.update({ embeds: [embed], components: [row] });
      return;
    }

    // Day vote
    if (action === 'vote') {
      const [, targetId, gId] = data;
      const sess = sessions.get(gId);
      if (!sess || sess.phase !== 'vote') return interaction.reply({ content: 'Not vote phase!', ephemeral: true });

      const voter = sess.players.find(p => p.id === interaction.user.id && p.alive);
      if (!voter) return interaction.reply({ content: 'You are not an alive player!', ephemeral: true });

      sess.votes[interaction.user.id] = targetId;
      await interaction.reply({ content: `✅ You voted for **${sess.players.find(p=>p.id===targetId)?.username}**`, ephemeral: true });

      const channel = await client.channels.fetch(sess.channelId);
      checkVotesComplete(sess, channel, gId, client);
      return;
    }
  },
};

function buildLobbyEmbed(session) {
  return new EmbedBuilder()
    .setTitle('🎭 Mafia — Lobby')
    .setColor(0x5865F2)
    .setDescription('Click **Join Game** to join! Host runs `!mafia begin` when ready.')
    .addFields({
      name: `Players (${session.players.length})`,
      value: session.players.map(p => `• ${p.username}`).join('\n') || 'None yet',
    })
    .setFooter({ text: 'Minimum 4 players required' });
}

function buildLobbyRow(guildId) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`mafia:join:${guildId}`)
      .setLabel('🙋 Join Game')
      .setStyle(ButtonStyle.Primary),
  );
}

function getRoleDescription(role, session) {
  const mafia = session.players.filter(p => p.role === 'MAFIA').map(p => p.username).join(', ');
  switch (role) {
    case 'MAFIA':
      return `You are **Mafia**! 🔫\nEliminate villagers each night.\nYour team: **${mafia}**\nDuring the day, blend in and avoid suspicion!`;
    case 'DETECTIVE':
      return '🔍 You are the **Detective**!\nEach night you can investigate a player to learn if they are Mafia or not. Use the bot DM commands during night phase.';
    case 'DOCTOR':
      return '💉 You are the **Doctor**!\nEach night you can protect one player from being eliminated. Use the bot DM commands during night phase.';
    default:
      return '🧑‍🌾 You are a **Villager**!\nDuring the day, discuss and vote to eliminate the Mafia. Win by eliminating all Mafia members!';
  }
}

async function startNightPhase(channel, session, guildId, client) {
  session.phase = 'night';
  session.nightActions = {};

  const alivePlayers = session.players.filter(p => p.alive);

  const embed = new EmbedBuilder()
    .setTitle(`🌙 Night ${session.day} — Everyone Close Your Eyes!`)
    .setColor(0x2F3136)
    .setDescription([
      'The village goes to sleep...',
      '',
      '**Special roles, check your DMs!**',
      '• 🔫 Mafia: DM the bot with `!kill <username>`',
      '• 🔍 Detective: DM the bot with `!investigate <username>`',
      '• 💉 Doctor: DM the bot with `!protect <username>`',
      '',
      'Night ends in **60 seconds** or when all actions are submitted.',
    ].join('\n'))
    .addFields({ name: '🧑 Alive Players', value: alivePlayers.map(p => p.username).join(', ') });

  await channel.send({ embeds: [embed] });

  // Listen for DM actions from special roles
  const mafia = session.players.filter(p => p.role === 'MAFIA' && p.alive);
  const detective = session.players.find(p => p.role === 'DETECTIVE' && p.alive);
  const doctor = session.players.find(p => p.role === 'DOCTOR' && p.alive);

  // Collect DM actions
  const dmFilter = m => !m.author.bot && m.channel.type === 1; // DM channel
  const dmCollector = client.on('messageCreate', async (msg) => {
    if (msg.channel.type !== 1 || msg.author.bot) return;
    const args = msg.content.trim().split(' ');
    const cmd = args[0].toLowerCase();

    const player = session.players.find(p => p.id === msg.author.id && p.alive);
    if (!player) return;

    if (cmd === '!kill' && player.role === 'MAFIA') {
      const target = session.players.find(p => p.username.toLowerCase() === args.slice(1).join(' ').toLowerCase() && p.alive && p.id !== player.id);
      if (!target) return msg.reply('❌ Invalid target. Try again with an alive player\'s username.');
      session.nightActions.kill = target.id;
      msg.reply(`✅ You chose to eliminate **${target.username}** tonight.`);
    }

    if (cmd === '!investigate' && player.role === 'DETECTIVE') {
      const target = session.players.find(p => p.username.toLowerCase() === args.slice(1).join(' ').toLowerCase() && p.alive && p.id !== player.id);
      if (!target) return msg.reply('❌ Invalid target.');
      session.nightActions.investigate = target.id;
      const isMafia = target.role === 'MAFIA';
      msg.reply(`🔍 Your investigation reveals: **${target.username}** is **${isMafia ? '🔫 MAFIA' : '✅ NOT Mafia'}**`);
    }

    if (cmd === '!protect' && player.role === 'DOCTOR') {
      const target = session.players.find(p => p.username.toLowerCase() === args.slice(1).join(' ').toLowerCase() && p.alive);
      if (!target) return msg.reply('❌ Invalid target.');
      session.nightActions.protect = target.id;
      msg.reply(`💉 You chose to protect **${target.username}** tonight.`);
    }
  });

  // End night after 60 seconds
  setTimeout(async () => {
    client.removeListener('messageCreate', dmFilter);
    await resolveNight(channel, session, guildId, client);
  }, 60000);
}

async function resolveNight(channel, session, guildId, client) {
  let eliminated = null;

  if (session.nightActions.kill) {
    const killId = session.nightActions.kill;
    if (session.nightActions.protect !== killId) {
      const victim = session.players.find(p => p.id === killId);
      if (victim) {
        victim.alive = false;
        eliminated = victim;
      }
    }
  }

  const embed = new EmbedBuilder()
    .setTitle(`☀️ Day ${session.day} — Morning has come!`)
    .setColor(0xFEE75C);

  if (eliminated) {
    embed.setDescription(`☠️ **${eliminated.username}** was eliminated last night! They were a **${ROLES[eliminated.role].name} ${ROLES[eliminated.role].emoji}**`);
  } else {
    embed.setDescription('😮 **Nobody** was eliminated last night! The doctor saved someone, or Mafia held back.');
  }

  await channel.send({ embeds: [embed] });

  const winner = checkWin(session);
  if (winner) return endGame(channel, session, guildId, winner);

  // Start day/vote phase
  await startDayPhase(channel, session, guildId, client);
}

async function startDayPhase(channel, session, guildId, client) {
  session.phase = 'vote';
  session.votes = {};

  const alivePlayers = session.players.filter(p => p.alive);

  const embed = new EmbedBuilder()
    .setTitle(`🗳️ Day ${session.day} — Time to Vote!`)
    .setColor(0xFF9900)
    .setDescription([
      'Discuss who you think is Mafia, then vote to eliminate a suspect.',
      'Majority vote wins. You have **90 seconds** to vote.',
    ].join('\n'))
    .addFields({ name: '🧑 Alive Players', value: alivePlayers.map(p => p.username).join(', ') });

  // Build vote buttons (up to 5 shown; Discord limit)
  const rows = [];
  const chunks = chunkArray(alivePlayers, 5);
  for (const chunk of chunks.slice(0, 5)) {
    const row = new ActionRowBuilder().addComponents(
      chunk.map(p =>
        new ButtonBuilder()
          .setCustomId(`mafia:vote:${p.id}:${guildId}`)
          .setLabel(`Vote ${p.username}`)
          .setStyle(ButtonStyle.Danger)
      )
    );
    rows.push(row);
  }

  await channel.send({ embeds: [embed], components: rows });

  // Auto-resolve after 90s
  setTimeout(() => resolveVote(channel, session, guildId, client), 90000);
}

function checkVotesComplete(session, channel, guildId, client) {
  const alivePlayers = session.players.filter(p => p.alive);
  const votes = Object.values(session.votes);
  if (votes.length >= Math.ceil(alivePlayers.length / 2)) {
    resolveVote(channel, session, guildId, client);
  }
}

async function resolveVote(channel, session, guildId, client) {
  if (session.phase !== 'vote') return;
  session.phase = 'resolving';

  const voteCounts = {};
  for (const targetId of Object.values(session.votes)) {
    voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
  }

  let maxVotes = 0;
  let eliminated = null;

  for (const [id, count] of Object.entries(voteCounts)) {
    if (count > maxVotes) {
      maxVotes = count;
      eliminated = session.players.find(p => p.id === id);
    }
  }

  const embed = new EmbedBuilder().setColor(0xED4245);

  if (eliminated && maxVotes > 0) {
    eliminated.alive = false;
    embed.setTitle('⚖️ The Village has decided!')
      .setDescription(`**${eliminated.username}** was voted out! They were a **${ROLES[eliminated.role].name} ${ROLES[eliminated.role].emoji}**`);
  } else {
    embed.setTitle('🤷 No consensus!')
      .setDescription('The village couldn\'t agree. Nobody was eliminated today.');
  }

  await channel.send({ embeds: [embed] });

  const winner = checkWin(session);
  if (winner) return endGame(channel, session, guildId, winner);

  session.day += 1;
  await startNightPhase(channel, session, guildId, client);
}

async function endGame(channel, session, guildId, winner) {
  sessions.delete(guildId);

  const mafiaTeam = session.players.filter(p => p.role === 'MAFIA').map(p => p.username).join(', ');
  const villageTeam = session.players.filter(p => p.role !== 'MAFIA').map(p => p.username).join(', ');

  const embed = new EmbedBuilder()
    .setTitle(winner === 'village' ? '🎉 Village Wins!' : '😈 Mafia Wins!')
    .setColor(winner === 'village' ? 0x57F287 : 0xED4245)
    .setDescription(
      winner === 'village'
        ? 'The Mafia has been eliminated! The village is safe! 🏡'
        : 'The Mafia has taken over the village! Better luck next time! 🔫'
    )
    .addFields(
      { name: '🔫 Mafia Team', value: mafiaTeam },
      { name: '🧑‍🌾 Village Team', value: villageTeam },
      { name: '📊 Game lasted', value: `${session.day} day(s)` }
    );

  await channel.send({ embeds: [embed] });
}

function chunkArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
}
