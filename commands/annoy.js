const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const ANNOY_DURATION_MS = 2 * 60 * 1000; // 2 minutes hard cap

module.exports = {
  name: 'annoy',
  description: 'Silently delete all messages from a user for up to 2 minutes',
  async execute(message, args, client) {
    // Check bot has ManageMessages
    if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return message.reply('❌ I need **Manage Messages** permission to do that!');
    }

    if (!args[0]) {
      return message.reply([
        '❓ Usage: `!annoy <@user or userID>`',
        'Example: `!annoy @John` or `!annoy 123456789012345678`',
        '⚠️ **Annoy mode automatically stops after 2 minutes.**',
        'Use `!stopannoy <@user or userID>` to stop early.',
        'Use `!annoylist` to see who\'s being annoyed.',
      ].join('\n'));
    }

    // Initialize storage on client
    if (!client.annoyedUsers) client.annoyedUsers = new Map();
    const guildId = message.guild.id;
    if (!client.annoyedUsers.has(guildId)) client.annoyedUsers.set(guildId, new Map());

    // Resolve target — accept @mention or raw user ID
    let targetId, targetName;

    const mentioned = message.mentions.users.first();
    if (mentioned) {
      targetId   = mentioned.id;
      targetName = mentioned.username;
    } else {
      const rawId = args[0].replace(/\D/g, '');
      if (rawId.length < 17) return message.reply('❌ That doesn\'t look like a valid user ID or mention!');
      try {
        const fetched = await client.users.fetch(rawId);
        targetId   = fetched.id;
        targetName = fetched.username;
      } catch {
        return message.reply("❌ Couldn't find that user! Make sure the ID is correct.");
      }
    }

    // Guard: don't annoy bot or self
    if (targetId === client.user.id) return message.reply("😂 Nice try, I won't annoy myself!!");
    if (targetId === message.author.id) return message.reply("💜 Aww don't annoy yourself babe!! You're great 🌸");

    const guildMap = client.annoyedUsers.get(guildId);

    if (guildMap.has(targetId)) {
      const existing = guildMap.get(targetId);
      const elapsed = Date.now() - existing.startTime;
      const remaining = Math.ceil((ANNOY_DURATION_MS - elapsed) / 1000);
      return message.reply(`⚠️ **${targetName}** is already being annoyed! Auto-stops in **${remaining}s** or use \`!stopannoy @${targetName}\`.`);
    }

    // Schedule auto-stop after 2 minutes
    const timer = client.scheduleAnnoyTimeout(
      guildId,
      targetId,
      targetName,
      message.author.username,
      message.channel,
    );

    guildMap.set(targetId, {
      timer,
      activatorId:   message.author.id,
      activatorName: message.author.username,
      startTime:     Date.now(),
    });

    const expireAt = Math.floor((Date.now() + ANNOY_DURATION_MS) / 1000);

    const embed = new EmbedBuilder()
      .setTitle('🔇 Annoy Mode Activated!')
      .setColor(0xED4245)
      .setDescription(
        `Every message from **${targetName}** will be **instantly deleted** 😈\n\n` +
        `⏰ **Auto-expires:** <t:${expireAt}:R>\n` +
        `Use \`!stopannoy @${targetName}\` to stop early.`
      )
      .setFooter({ text: `Activated by ${message.author.username} | Max 2 minutes | Wisteria 🌸` });

    message.reply({ embeds: [embed] });
  },
};
