const { EmbedBuilder } = require('discord.js');

const WORDS = [
  'crane', 'brave', 'gloom', 'patch', 'flame', 'grind', 'plumb', 'stove', 'flint', 'chard',
  'blaze', 'ghost', 'crisp', 'knack', 'pluck', 'stomp', 'dwarf', 'frost', 'cling', 'brisk',
  'clasp', 'floss', 'grump', 'swamp', 'tryst', 'glyph', 'knave', 'plaid', 'scamp', 'whirl',
  'abide', 'agent', 'alpha', 'angel', 'audit', 'bench', 'birth', 'black', 'bland', 'blank',
  'blast', 'blend', 'block', 'blood', 'bloom', 'blown', 'board', 'boost', 'booth', 'bound',
  'boxer', 'brand', 'bread', 'break', 'breed', 'bride', 'brief', 'brink', 'broad', 'brook',
  'brush', 'budge', 'build', 'built', 'bunch', 'burst', 'buyer', 'cabin', 'camel', 'candy',
  'cause', 'chain', 'chair', 'chalk', 'charm', 'chart', 'chase', 'cheap', 'check', 'cheek',
  'chess', 'chest', 'chief', 'child', 'china', 'choir', 'civic', 'civil', 'claim', 'clamp',
  'clang', 'clash', 'class', 'clean', 'clear', 'clerk', 'click', 'cliff', 'climb', 'cling',
  'clock', 'clone', 'close', 'cloth', 'cloud', 'clout', 'clown', 'coach', 'coral', 'cover',
  'crack', 'craft', 'crash', 'cream', 'creek', 'creep', 'crest', 'crime', 'cross', 'crowd',
  'crown', 'cruel', 'crush', 'curve', 'cycle', 'daily', 'dance', 'death', 'debut', 'deck',
  'delay', 'delta', 'dense', 'depot', 'depth', 'derby', 'doubt', 'dough', 'draft', 'drain',
  'drama', 'drank', 'dread', 'dream', 'drift', 'drill', 'drink', 'drive', 'drone', 'drool',
  'droop', 'drove', 'drown', 'drunk', 'dryer', 'dumpy', 'dunce', 'eagle', 'early', 'earth',
  'eight', 'elite', 'ember', 'empty', 'enjoy', 'enter', 'equal', 'error', 'event', 'every',
  'exact', 'extra', 'fable', 'faith', 'false', 'fancy', 'fault', 'feast', 'fence', 'ferry',
  'fiber', 'field', 'fifth', 'fifty', 'fight', 'final', 'first', 'fixed', 'flank', 'flash',
  'fleet', 'flesh', 'float', 'flock', 'flood', 'floor', 'flute', 'focus', 'force', 'forge',
  'forte', 'forum', 'found', 'frame', 'frank', 'fraud', 'fresh', 'front', 'frown', 'fruit',
  'fully', 'funky', 'funny', 'gamer', 'giant', 'given', 'gland', 'glass', 'glaze', 'gleam',
  'glide', 'globe', 'gloss', 'glow', 'glove', 'going', 'grace', 'grade', 'grand', 'grant',
  'grasp', 'grass', 'grave', 'great', 'green', 'greet', 'grief', 'grill', 'groan', 'gross',
  'group', 'grove', 'grown', 'guard', 'guess', 'guest', 'guide', 'guild', 'guilt', 'guise',
  'gulch', 'gummy', 'habit', 'happy', 'harsh', 'haste', 'hatch', 'haunt', 'haven', 'heart',
  'heavy', 'hedge', 'heist', 'hello', 'hence', 'heron', 'hinge', 'hoard', 'honor', 'horse',
  'hotel', 'hound', 'house', 'human', 'humor', 'hurry', 'hyper', 'ideal', 'image', 'imply',
  'index', 'inner', 'input', 'intel', 'inter', 'invent', 'issue', 'japan', 'jewel', 'joust',
  'judge', 'juice', 'juicy', 'jumbo', 'jumpy', 'kayak', 'kebab', 'knock', 'known', 'label',
];

const activeGames = new Map(); // userId → game state

function renderBoard(guesses, answer, maxGuesses) {
  const rows = [];
  for (let i = 0; i < maxGuesses; i++) {
    if (i < guesses.length) {
      const guess = guesses[i];
      let row = '';
      for (let j = 0; j < 5; j++) {
        const letter = guess[j];
        if (letter === answer[j]) {
          row += '🟩';
        } else if (answer.includes(letter)) {
          row += '🟨';
        } else {
          row += '⬛';
        }
      }
      row += `  \`${guess.toUpperCase()}\``;
      rows.push(row);
    } else {
      rows.push('⬜⬜⬜⬜⬜');
    }
  }
  return rows.join('\n');
}

module.exports = {
  name: 'wordle',
  description: 'Play Wordle! Guess the 5-letter word in 6 tries.',
  async execute(message) {
    const userId = message.author.id;

    if (activeGames.has(userId)) {
      const game = activeGames.get(userId);
      const board = renderBoard(game.guesses, game.answer, 6);
      const embed = new EmbedBuilder()
        .setTitle('🟩 Wordle — Game in Progress!')
        .setColor(0x57F287)
        .setDescription(`You already have an active game!\n\n${board}\n\n**Guesses used:** ${game.guesses.length}/6\nType a 5-letter word to guess! | Type \`!wordle quit\` to give up.`)
        .setFooter({ text: '🟩 Correct  🟨 Wrong spot  ⬛ Not in word' });
      return message.reply({ embeds: [embed] });
    }

    if (message.content.toLowerCase().includes('quit')) {
      if (!activeGames.has(userId)) return message.reply("❌ You don't have an active Wordle game!");
      const game = activeGames.get(userId);
      activeGames.delete(userId);
      return message.reply(`🏳️ You gave up! The word was **${game.answer.toUpperCase()}**. Better luck next time! 🌸`);
    }

    const answer = WORDS[Math.floor(Math.random() * WORDS.length)];
    activeGames.set(userId, { answer, guesses: [], startTime: Date.now() });

    const embed = new EmbedBuilder()
      .setTitle('🟩 Wordle!')
      .setColor(0x57F287)
      .setDescription(
        `Guess the **5-letter word** in **6 tries**!\n\n` +
        `⬜⬜⬜⬜⬜\n⬜⬜⬜⬜⬜\n⬜⬜⬜⬜⬜\n⬜⬜⬜⬜⬜\n⬜⬜⬜⬜⬜\n⬜⬜⬜⬜⬜\n\n` +
        `Just type a 5-letter word in chat to guess!\nType \`!wordle quit\` to give up.`
      )
      .setFooter({ text: '🟩 Correct spot  🟨 Wrong spot  ⬛ Not in word | Wisteria 🌸' });

    await message.reply({ embeds: [embed] });

    const filter = m => m.author.id === userId && !m.content.startsWith('!') && /^[a-zA-Z]{5}$/.test(m.content.trim());
    const collector = message.channel.createMessageCollector({ filter, time: 300000 }); // 5 min

    collector.on('collect', async (m) => {
      const game = activeGames.get(userId);
      if (!game) return collector.stop();

      const guessRaw = m.content.trim().toLowerCase();

      if (guessRaw === 'quit') {
        activeGames.delete(userId);
        collector.stop('quit');
        return m.channel.send(`🏳️ **${m.author.username}** gave up! The word was **${game.answer.toUpperCase()}**`);
      }

      if (guessRaw.length !== 5) return;
      if (game.guesses.includes(guessRaw)) {
        await m.react('♻️');
        return;
      }

      game.guesses.push(guessRaw);

      const board = renderBoard(game.guesses, game.answer, 6);
      const won   = guessRaw === game.answer;
      const lost  = game.guesses.length >= 6 && !won;

      if (won) {
        activeGames.delete(userId);
        collector.stop('won');
        const timeTaken = Math.floor((Date.now() - game.startTime) / 1000);
        const xpReward  = Math.max(50, (7 - game.guesses.length) * 50);
        const embed = new EmbedBuilder()
          .setTitle('🎉 Wordle — You Won!!')
          .setColor(0x57F287)
          .setDescription(`${board}\n\n✅ **${m.author.username}** solved it in **${game.guesses.length}/6 guesses** (${timeTaken}s)!\n+${xpReward} XP earned!`)
          .setFooter({ text: 'Type !wordle to play again! | Wisteria 🌸' });
        return m.channel.send({ embeds: [embed] });
      }

      if (lost) {
        activeGames.delete(userId);
        collector.stop('lost');
        const embed = new EmbedBuilder()
          .setTitle('💀 Wordle — Game Over!')
          .setColor(0xED4245)
          .setDescription(`${board}\n\n❌ Out of guesses! The word was **${game.answer.toUpperCase()}**`)
          .setFooter({ text: 'Type !wordle to try again! | Wisteria 🌸' });
        return m.channel.send({ embeds: [embed] });
      }

      const embed = new EmbedBuilder()
        .setTitle(`🟩 Wordle — Guess ${game.guesses.length}/6`)
        .setColor(0xFEE75C)
        .setDescription(`${board}\n\n${6 - game.guesses.length} guesses remaining!`)
        .setFooter({ text: '🟩 Correct  🟨 Wrong spot  ⬛ Not in word' });
      m.channel.send({ embeds: [embed] });
    });

    collector.on('end', (_, reason) => {
      if (reason === 'time' && activeGames.has(userId)) {
        const game = activeGames.get(userId);
        activeGames.delete(userId);
        message.channel.send(`⏰ **${message.author.username}**'s Wordle timed out! The word was **${game.answer.toUpperCase()}** 😔`);
      }
    });
  },
};
