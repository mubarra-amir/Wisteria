const { EmbedBuilder } = require('discord.js');

// emojiReactions is stored on client: client.emojiReactions = Map<userId, emoji>

const setReactionCmd = {
  name: 'setreact',
  description: 'Set an emoji Wisteria reacts with when your name is mentioned',
  async execute(message, args, client) {
    const emoji = args[0];

    if (!emoji) {
      return message.reply('❓ Usage: `!setreact <emoji>`\nExample: `!setreact 🌸`\n\nWisteria will react with your emoji whenever someone mentions you!');
    }

    // Validate: accept unicode emoji or custom emoji format <:name:id>
    const unicodeEmojiRegex = /\p{Emoji}/u;
    const customEmojiRegex = /^<a?:\w+:\d+>$/;

    if (!unicodeEmojiRegex.test(emoji) && !customEmojiRegex.test(emoji)) {
      return message.reply('❌ That doesn\'t look like a valid emoji! Try a standard emoji like 🌸, 😂, 🔥, etc.');
    }

    if (!client.emojiReactions) client.emojiReactions = new Map();
    client.emojiReactions.set(message.author.id, emoji);

    const embed = new EmbedBuilder()
      .setTitle('✅ Reaction Emoji Set!')
      .setColor(0x9B59B6)
      .setDescription(`Whenever someone mentions **${message.author.username}**, Wisteria will react with **${emoji}**!`)
      .setFooter({ text: 'Use !setreact <emoji> to change it anytime | Wisteria 🌸' });

    message.reply({ embeds: [embed] });
  },
};

const clearReactionCmd = {
  name: 'clearreact',
  description: 'Remove your custom mention reaction emoji',
  async execute(message, args, client) {
    if (!client.emojiReactions) client.emojiReactions = new Map();

    if (!client.emojiReactions.has(message.author.id)) {
      return message.reply("You haven't set a reaction emoji yet! Use `!setreact <emoji>` to set one.");
    }

    client.emojiReactions.delete(message.author.id);
    message.reply('🗑️ Your mention reaction emoji has been cleared!');
  },
};

const listReactionsCmd = {
  name: 'reactions',
  description: 'See who has custom mention reactions set',
  async execute(message, args, client) {
    if (!client.emojiReactions || client.emojiReactions.size === 0) {
      return message.reply('Nobody has set a reaction emoji yet! Use `!setreact <emoji>` to be the first.');
    }

    const lines = [];
    for (const [userId, emoji] of client.emojiReactions.entries()) {
      const member = message.guild.members.cache.get(userId);
      if (member) lines.push(`${emoji} — **${member.displayName}**`);
    }

    const embed = new EmbedBuilder()
      .setTitle('🌸 Mention Reaction Emojis')
      .setColor(0x9B59B6)
      .setDescription(lines.length > 0 ? lines.join('\n') : 'No members found.')
      .setFooter({ text: 'Use !setreact <emoji> to set yours! | Wisteria 🌸' });

    message.reply({ embeds: [embed] });
  },
};

module.exports = [setReactionCmd, clearReactionCmd, listReactionsCmd];
