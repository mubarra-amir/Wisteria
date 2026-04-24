const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const stopAnnoyCmd = {
  name: 'stopannoy',
  description: 'Stop deleting a user\'s messages (annoy ends automatically in 2 min anyway)',
  async execute(message, args, client) {
    if (!args[0]) {
      return message.reply('❓ Usage: `!stopannoy <@user or userID>`');
    }

    if (!client.annoyedUsers) client.annoyedUsers = new Map();
    const guildId = message.guild.id;
    const guildMap = client.annoyedUsers.get(guildId);

    if (!guildMap || guildMap.size === 0) {
      return message.reply("✅ Nobody is currently being annoyed!");
    }

    // Resolve target
    let targetId, targetName;

    const mentioned = message.mentions.users.first();
    if (mentioned) {
      targetId   = mentioned.id;
      targetName = mentioned.username;
    } else {
      const rawId = args[0].replace(/\D/g, '');
      if (rawId.length < 17) return message.reply('❌ Invalid user ID or mention!');
      try {
        const fetched = await client.users.fetch(rawId);
        targetId   = fetched.id;
        targetName = fetched.username;
      } catch {
        return message.reply("❌ Couldn't find that user!");
      }
    }

    if (!guildMap.has(targetId)) {
      return message.reply(`⚠️ **${targetName}** wasn't being annoyed!`);
    }

    // Clear the auto-timeout timer
    const entry = guildMap.get(targetId);
    if (entry?.timer) clearTimeout(entry.timer);

    guildMap.delete(targetId);
    if (guildMap.size === 0) client.annoyedUsers.delete(guildId);

    const elapsed = entry ? Math.floor((Date.now() - entry.startTime) / 1000) : '?';

    const embed = new EmbedBuilder()
      .setTitle('✅ Annoy Mode Stopped!')
      .setColor(0x57F287)
      .setDescription(`**${targetName}** can now send messages freely again 🌸\n*(Was annoyed for ~${elapsed}s out of the 2-minute max)*\nTruce? 🤝`)
      .setFooter({ text: `Stopped by ${message.author.username} | Wisteria 🌸` });

    message.reply({ embeds: [embed] });
  },
};

const annoyListCmd = {
  name: 'annoylist',
  description: 'See who is currently being annoyed',
  async execute(message, args, client) {
    if (!client.annoyedUsers) client.annoyedUsers = new Map();
    const guildId  = message.guild.id;
    const guildMap = client.annoyedUsers.get(guildId);

    if (!guildMap || guildMap.size === 0) {
      return message.reply("✅ Nobody is being annoyed right now! Everyone's safe 🌸");
    }

    const lines = [];
    for (const [userId, entry] of guildMap.entries()) {
      try {
        const user    = await client.users.fetch(userId);
        const elapsed = Math.floor((Date.now() - entry.startTime) / 1000);
        const remaining = Math.max(0, 120 - elapsed);
        lines.push(`🔇 **${user.username}** — ⏰ auto-stops in **${remaining}s** (by ${entry.activatorName})`);
      } catch {
        lines.push(`🔇 Unknown user (\`${userId}\`)`);
      }
    }

    const embed = new EmbedBuilder()
      .setTitle('😈 Currently Annoyed Users')
      .setColor(0xED4245)
      .setDescription(lines.join('\n'))
      .setFooter({ text: 'Annoy mode auto-expires after 2 min | !stopannoy @user to stop early | Wisteria 🌸' });

    message.reply({ embeds: [embed] });
  },
};

module.exports = [stopAnnoyCmd, annoyListCmd];
