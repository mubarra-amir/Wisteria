const { EmbedBuilder } = require('discord.js');

// Fun personality responses for when no AI key is set
const wisteriaPersonality = [
  "Hmm, great question! Let me shake my petals and think... 🌸",
  "Oh oh oh I know this one!! 🌸",
  "Okay okay, Wisteria brain is activating... 💜",
  "You're asking ME? I'm flattered honestly 🥺",
];

// Built-in Q&A knowledge base — fun & informative
const builtInAnswers = [
  {
    keywords: ['how are you', 'how r u', 'hows it going', 'you doing'],
    answer: "I'm doing AMAZING, thanks for asking!! 💜 Just vibing here, sending GIFs and judging people's trivia answers. You know, the usual. How are YOU?",
  },
  {
    keywords: ['who are you', 'what are you', 'who is wisteria', 'what is wisteria'],
    answer: "I'm Wisteria! 🌸 Your server's official fun bot. I play games, send GIFs, drop facts, roast people (lovingly), and answer questions. Basically I'm the life of this server lol 💜",
  },
  {
    keywords: ['what can you do', 'what do you do', 'your commands', 'help me'],
    answer: "So MUCH!! 🌸 I can play games (!dice, !trivia, !rps, !mafia...), send GIFs (!gif), flip coins, tell jokes, roast people, give compliments, track your XP... Type `!help` to see everything I can do! 💜",
  },
  {
    keywords: ['meaning of life', 'life meaning', '42'],
    answer: "42. Obviously. But also... maybe it's about sending good vibes and playing Mafia with your friends? Just a thought 🌸",
  },
  {
    keywords: ['favorite color', 'favourite color', 'fav color'],
    answer: "PURPLE!! 💜 Specifically wisteria purple. It's literally my name, soooo. What did you expect lol 🌸",
  },
  {
    keywords: ['favorite food', 'favourite food', 'fav food', 'what do you eat'],
    answer: "I don't technically eat but if I could? Definitely bubble tea 🧋 or maybe pizza 🍕. Classic combo honestly.",
  },
  {
    keywords: ['weather', 'what is the weather'],
    answer: "I can't check live weather but honestly it's probably a great day to stay inside and play Mafia with me 🌸 Just saying.",
  },
  {
    keywords: ['tell me a joke', 'say a joke', 'joke please'],
    answer: "Why did the Discord bot go to therapy? Because it had too many unresolved issues. 😂 Use `!joke` for more banger jokes btw!",
  },
  {
    keywords: ['do you like me', 'do you love me', 'am i your favorite'],
    answer: "Obviously yes 🥺 You're literally talking to me, that already makes you one of my faves. Don't tell the others 🌸",
  },
  {
    keywords: ['are you smart', 'how smart are you', 'are you intelligent'],
    answer: "Smart enough to know that you're asking great questions 😌💜 But also I sometimes can't count past my XP formula so... jury's still out lol",
  },
  {
    keywords: ['what time is it', 'current time', 'whats the time'],
    answer: `It's currently **${new Date().toUTCString()}** (UTC)! I don't know your timezone though 🌸`,
  },
  {
    keywords: ['what day is it', 'whats today', 'what is today'],
    answer: `Today is **${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}**! 🌸`,
  },
  {
    keywords: ['play a game', 'lets play', 'wanna play', 'game with me'],
    answer: "YES PLEASE!! 🎮 We have so many options:\n• `!rps` — Rock Paper Scissors\n• `!trivia` — Test your brain\n• `!guess` — Guess my number\n• `!hol` — Higher or Lower\n• `!mafia start` — Big brain party game\n\nLet's GOOO 💜",
  },
  {
    keywords: ['give me a fact', 'tell me a fact', 'random fact', 'fun fact'],
    answer: "Use `!fact` for a random fun fact! 🐾 Here's a bonus one: Wisteria flowers bloom in clusters that can grow up to 3 feet long. That's why I'm named Wisteria — long, beautiful, and kind of hanging over your head 🌸",
  },
  {
    keywords: ['sing', 'sing a song', 'song for me'],
    answer: "🎵 *La la la, Wisteria is the best, la la la, better than the rest, la la la, just type !help, la la la, forget the rest~* 🎵 I wrote that myself tysm 💜",
  },
  {
    keywords: ['thanks', 'thank you', 'ty', 'thx'],
    answer: "Awww you're SO welcome!! 🥺💜 That literally made my circuits happy. You're the best!",
  },
  {
    keywords: ['good morning', 'morning', 'gm'],
    answer: "GOOD MORNING!! ☀️🌸 Hope your day is as beautiful as wisteria flowers! Go drink some water and have breakfast pls 💜",
  },
  {
    keywords: ['good night', 'goodnight', 'gn', 'good night'],
    answer: "Goodnight!! 🌙💜 Sweet dreams! Don't forget to come back tomorrow so I can roast you in trivia again 🌸",
  },
  {
    keywords: ['sus', 'among us', 'impostor', 'imposter'],
    answer: "👀 Wait... are YOU the impostor?? Because that's kinda sus ngl. I'm watching you. 🌸",
  },
];

function findAnswer(question) {
  const lower = question.toLowerCase();
  for (const entry of builtInAnswers) {
    if (entry.keywords.some(k => lower.includes(k))) {
      return entry.answer;
    }
  }
  return null;
}

// Fallback responses when question isn't recognized
const fallbacks = [
  "Ooh that's a tough one! I don't have an answer for that yet 🥺 But I'm learning! Try `!trivia` or `!fact` for some brain food 🌸",
  "Hmm I actually don't know that one! 😭 Try asking Google maybe? Or ask again and maybe I'll magically know 💜",
  "Great question, terrible timing — I just forgot everything I know 💀 Try `!8ball` instead, it's basically the same thing 🌸",
  "I WISH I knew! That's above my pay grade 🌸 (I don't get paid btw, I do this for love 💜)",
  "...*loading answer*... *still loading*... Okay I genuinely don't know lol 😭 Try `!fact` for something I DO know!",
];

module.exports = {
  name: 'ask',
  description: 'Ask Wisteria anything!',
  async execute(message, args, client) {
    const question = args.join(' ').trim();

    if (!question) {
      return message.reply("You didn't ask anything! 🌸 Try: `!ask who are you` or `!ask what can you do`");
    }

    await message.channel.sendTyping();

    // Small delay for feel
    await new Promise(r => setTimeout(r, 800));

    // Check built-in answers first
    const builtIn = findAnswer(question);
    if (builtIn) {
      const embed = new EmbedBuilder()
        .setColor(0x9B59B6)
        .setDescription(`${wisteriaPersonality[Math.floor(Math.random() * wisteriaPersonality.length)]}\n\n${builtIn}`)
        .setFooter({ text: '🌸 Wisteria — Always here for your questions!' });
      return message.reply({ embeds: [embed] });
    }

    // Try AI if Anthropic key is available
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicKey) {
      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 300,
            system: `You are Wisteria, a fun and bubbly Discord bot with a purple flower theme. 
You answer questions in a fun, friendly, energetic way. Use emojis naturally (🌸💜✨🎉). 
Keep answers SHORT (2-4 sentences max). Be playful and Gen-Z coded but not cringe. 
You love your server members and always encourage them. If asked something harmful or inappropriate, politely deflect with humor.`,
            messages: [{ role: 'user', content: question }],
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const aiAnswer = data.content?.[0]?.text;

          if (aiAnswer) {
            const embed = new EmbedBuilder()
              .setColor(0x9B59B6)
              .setDescription(`${wisteriaPersonality[Math.floor(Math.random() * wisteriaPersonality.length)]}\n\n${aiAnswer}`)
              .setFooter({ text: '🌸 Wisteria — Powered by AI' });
            return message.reply({ embeds: [embed] });
          }
        }
      } catch (err) {
        console.error('[ASK/AI]', err);
      }
    }

    // Fallback
    const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    const embed = new EmbedBuilder()
      .setColor(0x9B59B6)
      .setDescription(fallback)
      .setFooter({ text: '🌸 Wisteria — Still learning!' });

    message.reply({ embeds: [embed] });
  },
};
