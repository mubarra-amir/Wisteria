const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

// ─────────────────────────────────────────────────────────────
//  NICKNAME RATE LIMIT RULES
//
//  Applies to ALL members (changing own OR others' nicknames):
//    1. Max 3 changes per day (shared pool — own + others combined)
//    2. Each nickname lasts 15 minutes, then auto-reverts
//    3. After the nickname EXPIRES, you must wait 4 hours before
//       your next change — even if you have daily uses left
//    4. Can't set a new one while one you set is still active
//
//  Staff (admin / mod / helper / owner) = no restrictions ever.
//
//  Rate limit is tracked on the CHANGER (the person running the command).
//  Expiry/revert is tracked per TARGET (so we know what to revert).
//
//  Changer state  →  client.nickChangerState  key: `guildId:changerId`
//  {
//    uses: [timestamp, ...],    // when each change was made (24hr window)
//    cooldownUntil: number,     // 4hr cooldown end time (set on expiry)
//    activeTargetId: string|null, // userId of whoever's nick is currently active
//  }
//
//  Target revert state  →  client.nickTargetState  key: `guildId:targetId`
//  {
//    originalNick: string|null, // nick before it was changed
//    currentNick:  string|null, // what it was changed to
//    expiryAt:     number,      // when it expires
//    expiryTimer:  Timeout|null,
//    changedById:  string,      // who changed it (so we can update their state)
//  }
// ─────────────────────────────────────────────────────────────

const NICK_MAX_DAILY   = 3;
const NICK_EXPIRY_MS   = 15 * 60 * 1000;     // 15 minutes
const NICK_COOLDOWN_MS = 4 * 60 * 60 * 1000; // 4 hours after expiry

// ── Privileged check ──────────────────────────────────────────
function isPrivileged(member) {
  if (member.guild.ownerId === member.id) return true;
  return member.permissions.has(PermissionFlagsBits.Administrator)  ||
         member.permissions.has(PermissionFlagsBits.ManageGuild)    ||
         member.permissions.has(PermissionFlagsBits.ManageNicknames);
}

// ── Changer state helper ──────────────────────────────────────
function getChangerState(client, guildId, userId) {
  if (!client.nickChangerState) client.nickChangerState = new Map();
  const key = `${guildId}:${userId}`;
  if (!client.nickChangerState.has(key)) {
    client.nickChangerState.set(key, {
      uses:           [],
      cooldownUntil:  0,
      activeTargetId: null,
    });
  }
  return client.nickChangerState.get(key);
}

// ── Target state helper ───────────────────────────────────────
function getTargetState(client, guildId, userId) {
  if (!client.nickTargetState) client.nickTargetState = new Map();
  const key = `${guildId}:${userId}`;
  if (!client.nickTargetState.has(key)) {
    client.nickTargetState.set(key, {
      originalNick: null,
      currentNick:  null,
      expiryAt:     0,
      expiryTimer:  null,
      changedById:  null,
    });
  }
  return client.nickTargetState.get(key);
}

// ── Schedule auto-revert + trigger 4hr cooldown on changer ────
async function scheduleExpiry(client, guild, changer, target, targetState, changerState, channel) {
  if (targetState.expiryTimer) clearTimeout(targetState.expiryTimer);

  targetState.expiryAt = Date.now() + NICK_EXPIRY_MS;

  targetState.expiryTimer = setTimeout(async () => {
    targetState.expiryTimer = null;

    // Start the changer's 4hr cooldown NOW (after nickname expires)
    changerState.cooldownUntil  = Date.now() + NICK_COOLDOWN_MS;
    changerState.activeTargetId = null;
    const nextChangeAt          = Math.floor(changerState.cooldownUntil / 1000);

    // Revert target's nickname
    try {
      const freshTarget = await guild.members.fetch(target.id).catch(() => null);
      if (freshTarget && freshTarget.nickname === targetState.currentNick) {
        await freshTarget.setNickname(
          targetState.originalNick,
          'Nickname expired (15 min limit)'
        );
      }
    } catch { /* target may have left */ }

    targetState.currentNick  = null;
    targetState.changedById  = null;

    const isSelf = changer.id === target.id;
    const embed = new EmbedBuilder()
      .setTitle('⏰ Nickname Expired!')
      .setColor(0xFEE75C)
      .setDescription(
        `**${isSelf ? changer.user.username + "'s" : target.user.username + "'s"}** nickname has expired and been reset.\n\n` +
        `*(Changed by **${changer.user.username}**)*\n\n` +
        `⏳ **${changer.user.username} can change next:** <t:${nextChangeAt}:R>\n` +
        `*(4-hour cooldown begins after the nickname expires)*`
      )
      .setFooter({ text: 'Wisteria 🌸' });

    await channel.send({ embeds: [embed] }).catch(() => {});
  }, NICK_EXPIRY_MS);
}

// ── Robust member fetch ───────────────────────────────────────
async function fetchMember(message, args) {
  let target;
  const mentioned = message.mentions.users.first();
  if (mentioned) {
    try { target = await message.guild.members.fetch(mentioned.id); } catch { /* fall through */ }
  }
  if (!target) {
    const rawId = args[0]?.replace(/\D/g, '');
    if (rawId?.length >= 17) {
      try { target = await message.guild.members.fetch(rawId); } catch { /* fall through */ }
    }
  }
  return target;
}

// ── Shared rate limit check — returns error string or null ────
function checkRateLimit(changerState, now) {
  // Clean uses older than 24 hours
  changerState.uses = changerState.uses.filter(t => t > now - 24 * 60 * 60 * 1000);

  // 4hr cooldown after last expiry
  if (changerState.cooldownUntil > now) {
    const availAt = Math.floor(changerState.cooldownUntil / 1000);
    return `⏳ You're still in cooldown after your last nickname expired!\n\n**Next change available:** <t:${availAt}:R>\n*(4-hour cooldown begins after the nickname expires)*`;
  }

  // Still has an active nickname out there
  if (changerState.activeTargetId !== null) {
    return `⚠️ You already have an active nickname change out there! Wait for it to expire (15 min) before making another change.`;
  }

  // Daily limit
  if (changerState.uses.length >= NICK_MAX_DAILY) {
    const resetAt = Math.floor((Math.min(...changerState.uses) + 24 * 60 * 60 * 1000) / 1000);
    return `🚫 You've used all **${NICK_MAX_DAILY}** nickname changes for today!\nDaily limit resets <t:${resetAt}:R>`;
  }

  return null; // all good
}

// ─────────────────────────────────────────────────────────────
//  !nick @user <new nickname>
//  Members CAN use this now — same rate limits apply.
//  Staff bypass everything.
// ─────────────────────────────────────────────────────────────
const nickCmd = {
  name: 'nick',
  description: "Change someone's nickname (!nick @user <name>)",
  async execute(message, args, client) {
    if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageNicknames)) {
      return message.reply("❌ I need **Manage Nicknames** permission to do that!");
    }

    if (!args[0]) {
      return message.reply(
        '❓ **Usage:** `!nick @user <new nickname>`\n\n' +
        '📋 **Member rules:**\n' +
        '• Nickname lasts **15 minutes**, then auto-reverts\n' +
        '• After it expires, wait **4 hours** before your next change\n' +
        `• Max **${NICK_MAX_DAILY} changes per day** (own + others combined)\n\n` +
        'Staff have no restrictions. Use `!nickstatus` to check your cooldown!'
      );
    }

    const target = await fetchMember(message, args);
    if (!target) return message.reply('❌ Couldn\'t find that member!\nUsage: `!nick @user <new nickname>`');

    const newNick = args.slice(1).join(' ').trim();
    if (!newNick) return message.reply('❓ Usage: `!nick @user <new nickname>`');
    if (newNick.length > 32) return message.reply('❌ Nickname must be 32 characters or less!');

    if (target.roles.highest.position >= message.guild.members.me.roles.highest.position) {
      return message.reply("❌ I can't change the nickname of someone with a higher or equal role than me!");
    }

    const changer = message.member;

    // ── Staff: no restrictions ──
    if (isPrivileged(changer)) {
      try {
        await target.setNickname(newNick, `Set by staff ${changer.user.username}`);
        const embed = new EmbedBuilder()
          .setTitle('✏️ Nickname Changed!')
          .setColor(0x9B59B6)
          .addFields(
            { name: '👤 User',     value: `${target}`,  inline: true },
            { name: '📛 Old Nick', value: target.displayName, inline: true },
            { name: '✨ New Nick', value: newNick,       inline: true },
          )
          .setFooter({ text: `By ${changer.user.username} (staff) | No expiry | Wisteria 🌸` });
        return message.reply({ embeds: [embed] });
      } catch (err) {
        console.error('[NICK/STAFF]', err);
        return message.reply('❌ Failed to change nickname. Make sure my role is above theirs!');
      }
    }

    // ── Member: apply rate limits ──
    const now          = Date.now();
    const changerState = getChangerState(client, message.guild.id, changer.id);
    const error        = checkRateLimit(changerState, now);
    if (error) return message.reply(error);

    // Check if target already has an active timed nickname from someone else
    const targetState = getTargetState(client, message.guild.id, target.id);
    if (targetState.currentNick !== null) {
      const expiresAt = Math.floor(targetState.expiryAt / 1000);
      return message.reply(
        `⚠️ **${target.user.username}** already has an active nickname that expires <t:${expiresAt}:R>!\n` +
        `Wait for it to expire before changing their name.`
      );
    }

    // Save original nick
    targetState.originalNick = target.nickname;

    try {
      await target.setNickname(newNick, `Changed by member ${changer.user.username} (rate limited)`);

      changerState.uses.push(now);
      changerState.activeTargetId = target.id;
      targetState.currentNick     = newNick;
      targetState.changedById     = changer.id;

      const usesLeft       = NICK_MAX_DAILY - changerState.uses.length;
      const expiresAt      = Math.floor((now + NICK_EXPIRY_MS) / 1000);
      const nextChangeAt   = Math.floor((now + NICK_EXPIRY_MS + NICK_COOLDOWN_MS) / 1000);

      const embed = new EmbedBuilder()
        .setTitle('✏️ Nickname Changed!')
        .setColor(0x9B59B6)
        .addFields(
          { name: '👤 User',     value: `${target}`,            inline: true },
          { name: '📛 Old Nick', value: target.displayName,      inline: true },
          { name: '✨ New Nick', value: newNick,                  inline: true },
        )
        .setDescription(
          `\n⏰ **Expires:** <t:${expiresAt}:R> *(auto-reverts after 15 min)*\n` +
          `⏳ **Your next change:** <t:${nextChangeAt}:R> *(4 hrs after expiry)*\n` +
          `📊 **Your changes left today:** ${usesLeft}/${NICK_MAX_DAILY}`
        )
        .setFooter({ text: 'Wisteria 🌸 | Nickname reverts automatically' });

      await message.reply({ embeds: [embed] });

      await scheduleExpiry(client, message.guild, changer, target, targetState, changerState, message.channel);

    } catch (err) {
      console.error('[NICK/MEMBER]', err);
      message.reply('❌ Failed to change nickname. Make sure my role is above theirs!');
    }
  },
};

// ─────────────────────────────────────────────────────────────
//  !mynick <new nickname>  — change YOUR OWN nickname
//  Same rate limits as !nick — shared pool.
// ─────────────────────────────────────────────────────────────
const myNickCmd = {
  name: 'mynick',
  description: 'Change your own nickname (same rate limits as !nick)',
  async execute(message, args, client) {
    if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageNicknames)) {
      return message.reply("❌ I need **Manage Nicknames** permission!");
    }

    const newNick = args.join(' ').trim();
    if (!newNick) {
      return message.reply(
        '❓ **Usage:** `!mynick <new nickname>`\n\n' +
        '📋 **Member rules:**\n' +
        '• Nickname lasts **15 minutes**, then auto-reverts\n' +
        '• After it expires, wait **4 hours** before your next change\n' +
        `• Max **${NICK_MAX_DAILY} changes per day** (own + others combined)\n\n` +
        'Use `!nickstatus` to check your cooldown!'
      );
    }
    if (newNick.length > 32) return message.reply('❌ Nickname must be 32 characters or less!');

    const changer = message.member;

    // ── Staff: no restrictions ──
    if (isPrivileged(changer)) {
      try {
        await changer.setNickname(newNick, 'Staff mynick — no restrictions');
        return message.reply(`✅ Your nickname is now **${newNick}** 🌸 *(Staff — no expiry)*`);
      } catch {
        return message.reply('❌ Failed to change your nickname!');
      }
    }

    // ── Member: apply rate limits ──
    const now          = Date.now();
    const changerState = getChangerState(client, message.guild.id, changer.id);
    const error        = checkRateLimit(changerState, now);
    if (error) return message.reply(error);

    // Check if changer themselves already has an active timed nickname
    const targetState = getTargetState(client, message.guild.id, changer.id);
    if (targetState.currentNick !== null) {
      const expiresAt = Math.floor(targetState.expiryAt / 1000);
      return message.reply(
        `⚠️ You already have an active nickname!\n\n` +
        `**Current:** ${targetState.currentNick}\n` +
        `**Expires:** <t:${expiresAt}:R>\n\n` +
        `Wait for it to expire, then wait 4 hours before changing again.`
      );
    }

    targetState.originalNick = changer.nickname;

    try {
      await changer.setNickname(newNick, 'Member mynick (rate limited)');

      changerState.uses.push(now);
      changerState.activeTargetId = changer.id;
      targetState.currentNick     = newNick;
      targetState.changedById     = changer.id;

      const usesLeft     = NICK_MAX_DAILY - changerState.uses.length;
      const expiresAt    = Math.floor((now + NICK_EXPIRY_MS) / 1000);
      const nextChangeAt = Math.floor((now + NICK_EXPIRY_MS + NICK_COOLDOWN_MS) / 1000);

      const embed = new EmbedBuilder()
        .setTitle('✏️ Nickname Changed!')
        .setColor(0x9B59B6)
        .setDescription(
          `Your nickname is now **${newNick}**!\n\n` +
          `⏰ **Expires:** <t:${expiresAt}:R> *(auto-reverts after 15 min)*\n` +
          `⏳ **Next change available:** <t:${nextChangeAt}:R> *(4 hrs after expiry)*\n` +
          `📊 **Changes left today:** ${usesLeft}/${NICK_MAX_DAILY}`
        )
        .setFooter({ text: 'Wisteria 🌸 | Nickname reverts automatically after 15 min' });

      await message.reply({ embeds: [embed] });

      await scheduleExpiry(client, message.guild, changer, changer, targetState, changerState, message.channel);

    } catch (err) {
      console.error('[MYNICK]', err);
      message.reply('❌ Failed to change your nickname!');
    }
  },
};

// ─────────────────────────────────────────────────────────────
//  !resetnick @user  — staff only
// ─────────────────────────────────────────────────────────────
const resetNickCmd = {
  name: 'resetnick',
  description: "Reset a user's nickname — staff only",
  async execute(message, args, client) {
    if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageNicknames)) {
      return message.reply("❌ I need **Manage Nicknames** permission!");
    }
    if (!isPrivileged(message.member)) {
      return message.reply('❌ Only **staff** can forcibly reset nicknames!');
    }

    const target = await fetchMember(message, args);
    if (!target) return message.reply('❌ Couldn\'t find that member! Usage: `!resetnick @user`');

    if (target.roles.highest.position >= message.guild.members.me.roles.highest.position) {
      return message.reply("❌ I can't change the nickname of someone with a higher or equal role than me!");
    }

    // Cancel any active expiry timer for this target
    const targetState = getTargetState(client, message.guild.id, target.id);
    if (targetState.expiryTimer) {
      clearTimeout(targetState.expiryTimer);
      targetState.expiryTimer = null;

      // Apply cooldown to whoever changed it
      if (targetState.changedById && client.nickChangerState) {
        const cState = client.nickChangerState.get(`${message.guild.id}:${targetState.changedById}`);
        if (cState) {
          cState.cooldownUntil  = Date.now() + NICK_COOLDOWN_MS;
          cState.activeTargetId = null;
        }
      }
      targetState.currentNick = null;
      targetState.changedById = null;
    }

    const oldNick = target.displayName;
    try {
      await target.setNickname(null, `Reset by staff ${message.author.username}`);

      const embed = new EmbedBuilder()
        .setTitle('🔄 Nickname Reset!')
        .setColor(0x9B59B6)
        .setDescription(`**${target.user.username}**'s nickname has been reset from **${oldNick}** back to their username.`)
        .setFooter({ text: `Reset by ${message.author.username} (staff) | Wisteria 🌸` });

      message.reply({ embeds: [embed] });
    } catch {
      message.reply('❌ Failed to reset nickname!');
    }
  },
};

// ─────────────────────────────────────────────────────────────
//  !randomnick @user  — staff only
// ─────────────────────────────────────────────────────────────
const funnyNicknames = [
  'Lord of Nothing', 'Professional Napper', 'WiFi Thief', 'Snack Goblin',
  'Chaos Gremlin', 'Captain Obvious', 'Professional Overthinker', 'Keyboard Warrior',
  'Noodle Brain', 'Master of Disaster', 'Sleep Deprived', 'Certified Clown 🤡',
  'Big Brain Energy', 'Professional Lurker', 'Meme Lord', 'Notorious AFK',
  'The Chosen Lag', 'Vibe Curator', 'Touch Grass Inc', 'Error 404: Chill Not Found',
];

const randomNickCmd = {
  name: 'randomnick',
  description: 'Give someone a random funny nickname — staff only',
  async execute(message, args, client) {
    if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageNicknames)) {
      return message.reply("❌ I need **Manage Nicknames** permission!");
    }
    if (!isPrivileged(message.member)) {
      return message.reply('❌ Only **staff** can use `!randomnick`!');
    }

    const target = await fetchMember(message, args);
    if (!target) return message.reply('❓ Usage: `!randomnick @user`');

    if (target.roles.highest.position >= message.guild.members.me.roles.highest.position) {
      return message.reply("❌ I can't change the nickname of someone with a higher role than me!");
    }

    const nick = funnyNicknames[Math.floor(Math.random() * funnyNicknames.length)];
    try {
      await target.setNickname(nick, `Random nick by staff ${message.author.username}`);

      const embed = new EmbedBuilder()
        .setTitle('🎲 Random Nickname Assigned!')
        .setColor(0x9B59B6)
        .setDescription(`${target} is now known as **${nick}** 🌸😂`)
        .setFooter({ text: `By ${message.author.username} (staff) | Wisteria 🌸` });

      message.reply({ embeds: [embed] });
    } catch {
      message.reply('❌ Failed to change nickname!');
    }
  },
};

// ─────────────────────────────────────────────────────────────
//  !nickstatus  — check your own cooldown & uses
// ─────────────────────────────────────────────────────────────
const nickStatusCmd = {
  name: 'nickstatus',
  description: 'Check your nickname change cooldown and uses remaining',
  async execute(message, args, client) {
    const member = message.member;

    if (isPrivileged(member)) {
      return message.reply('✨ You\'re **staff** — no nickname restrictions apply to you! 🌸');
    }

    const now          = Date.now();
    const changerState = getChangerState(client, message.guild.id, member.id);
    changerState.uses  = changerState.uses.filter(t => t > now - 24 * 60 * 60 * 1000);

    const usesLeft      = NICK_MAX_DAILY - changerState.uses.length;
    const onCooldown    = changerState.cooldownUntil > now;
    const hasActiveNick = changerState.activeTargetId !== null;

    const lines = [`📊 **Changes used today:** ${changerState.uses.length}/${NICK_MAX_DAILY}`];

    if (hasActiveNick) {
      const targetState = getTargetState(client, message.guild.id, changerState.activeTargetId);
      const expiresAt   = Math.floor(targetState.expiryAt / 1000);
      const coolAt      = Math.floor((targetState.expiryAt + NICK_COOLDOWN_MS) / 1000);
      const isSelf      = changerState.activeTargetId === member.id;
      lines.push(`✏️ **Active nickname change:** ${isSelf ? 'your own nick' : `<@${changerState.activeTargetId}>`}`);
      lines.push(`⏰ **Expires:** <t:${expiresAt}:R>`);
      lines.push(`⏳ **Your next change after expiry:** <t:${coolAt}:R>`);
    } else if (onCooldown) {
      const availAt = Math.floor(changerState.cooldownUntil / 1000);
      lines.push(`⏳ **Cooldown active — next change:** <t:${availAt}:R>`);
    } else if (usesLeft === 0) {
      const resetAt = Math.floor((Math.min(...changerState.uses) + 24 * 60 * 60 * 1000) / 1000);
      lines.push(`🚫 **No changes left today — resets:** <t:${resetAt}:R>`);
    } else {
      lines.push(`✅ **Ready!** You have **${usesLeft}** change(s) available.`);
    }

    const embed = new EmbedBuilder()
      .setTitle('📋 Your Nickname Status')
      .setColor(onCooldown || usesLeft === 0 || hasActiveNick ? 0xFEE75C : 0x57F287)
      .setDescription(lines.join('\n'))
      .setFooter({ text: 'Use !nick @user <n> or !mynick <n> | Wisteria 🌸' });

    message.reply({ embeds: [embed] });
  },
};

module.exports = [nickCmd, resetNickCmd, myNickCmd, randomNickCmd, nickStatusCmd];