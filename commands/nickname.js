const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

// !nick @user <new nickname>  — change someone's nickname
const nickCmd = {
  name: 'nick',
  description: "Change a user's nickname",
  async execute(message, args, client) {
    // Check bot has permission
    if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageNicknames)) {
      return message.reply("❌ I don't have **Manage Nicknames** permission! Ask a server admin to grant it.");
    }

    const target = message.mentions.members.first();
    if (!target) return message.reply('❓ Usage: `!nick @user <new nickname>`\nExample: `!nick @John CoolDude`');

    const newNick = args.slice(1).join(' ').trim();
    if (!newNick) return message.reply('❓ Please provide a nickname!\nUsage: `!nick @user <new nickname>`');
    if (newNick.length > 32) return message.reply('❌ Nickname must be 32 characters or less!');

    // Can't change nickname of someone with higher role
    if (target.roles.highest.position >= message.guild.members.me.roles.highest.position) {
      return message.reply("❌ I can't change the nickname of someone with a higher or equal role than me!");
    }

    const oldNick = target.displayName;
    try {
      await target.setNickname(newNick, `Changed by ${message.author.username} via Wisteria`);

      const embed = new EmbedBuilder()
        .setTitle('✏️ Nickname Changed!')
        .setColor(0x9B59B6)
        .addFields(
          { name: '👤 User', value: `${target}`, inline: true },
          { name: '📛 Old Nick', value: oldNick, inline: true },
          { name: '✨ New Nick', value: newNick, inline: true },
        )
        .setFooter({ text: `Changed by ${message.author.username} | Wisteria 🌸` });

      message.reply({ embeds: [embed] });
    } catch (err) {
      console.error('[NICK]', err);
      message.reply('❌ Failed to change nickname. Make sure my role is above theirs!');
    }
  },
};

// !resetnick @user  — reset nickname back to original username
const resetNickCmd = {
  name: 'resetnick',
  description: "Reset a user's nickname to their username",
  async execute(message, args, client) {
    if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageNicknames)) {
      return message.reply("❌ I don't have **Manage Nicknames** permission!");
    }

    const target = message.mentions.members.first();
    if (!target) return message.reply('❓ Usage: `!resetnick @user`');

    if (target.roles.highest.position >= message.guild.members.me.roles.highest.position) {
      return message.reply("❌ I can't change the nickname of someone with a higher or equal role than me!");
    }

    const oldNick = target.displayName;
    try {
      await target.setNickname(null, `Reset by ${message.author.username} via Wisteria`);

      const embed = new EmbedBuilder()
        .setTitle('🔄 Nickname Reset!')
        .setColor(0x9B59B6)
        .setDescription(`**${target.user.username}**'s nickname has been reset from **${oldNick}** back to their username.`)
        .setFooter({ text: `Reset by ${message.author.username} | Wisteria 🌸` });

      message.reply({ embeds: [embed] });
    } catch (err) {
      message.reply('❌ Failed to reset nickname!');
    }
  },
};

// !mynick <new nickname>  — change your OWN nickname
const myNickCmd = {
  name: 'mynick',
  description: 'Change your own nickname',
  async execute(message, args, client) {
    if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageNicknames)) {
      return message.reply("❌ I don't have **Manage Nicknames** permission!");
    }

    const newNick = args.join(' ').trim();
    if (!newNick) return message.reply('❓ Usage: `!mynick <new nickname>`\nUse `!resetnick @yourself` to reset it.');
    if (newNick.length > 32) return message.reply('❌ Nickname must be 32 characters or less!');

    try {
      await message.member.setNickname(newNick);
      message.reply(`✅ Done! Your nickname is now **${newNick}** 🌸`);
    } catch (err) {
      message.reply('❌ Failed to change your nickname!');
    }
  },
};

// !randomnick @user  — give someone a random funny nickname
const funnyNicknames = [
  'Lord of Nothing', 'Professional Napper', 'WiFi Thief', 'Snack Goblin',
  'Chaos Gremlin', 'Captain Obvious', 'Professional Overthinker', 'Keyboard Warrior',
  'Noodle Brain', 'Master of Disaster', 'Sleep Deprived', 'Certified Clown 🤡',
  'Big Brain Energy', 'Professional Lurker', 'Meme Lord', 'Notorious AFK',
  'The Chosen Lag', 'Vibe Curator', 'Touch Grass Inc', 'Error 404: Chill Not Found',
];

const randomNickCmd = {
  name: 'randomnick',
  description: 'Give someone a random funny nickname',
  async execute(message, args, client) {
    if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageNicknames)) {
      return message.reply("❌ I don't have **Manage Nicknames** permission!");
    }

    const target = message.mentions.members.first();
    if (!target) return message.reply('❓ Usage: `!randomnick @user`');

    if (target.roles.highest.position >= message.guild.members.me.roles.highest.position) {
      return message.reply("❌ I can't change the nickname of someone with a higher role than me!");
    }

    const nick = funnyNicknames[Math.floor(Math.random() * funnyNicknames.length)];
    try {
      await target.setNickname(nick);

      const embed = new EmbedBuilder()
        .setTitle('🎲 Random Nickname Assigned!')
        .setColor(0x9B59B6)
        .setDescription(`${target} is now known as **${nick}** 🌸😂`)
        .setFooter({ text: `By ${message.author.username} | Wisteria 🌸` });

      message.reply({ embeds: [embed] });
    } catch (err) {
      message.reply('❌ Failed to change nickname!');
    }
  },
};

module.exports = [nickCmd, resetNickCmd, myNickCmd, randomNickCmd];