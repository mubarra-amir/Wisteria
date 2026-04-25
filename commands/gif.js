const { EmbedBuilder } = require('discord.js');

// GIF categories with search terms
const gifCategories = {
  happy: ['happy dance', 'celebration happy', 'joy excited'],
  sad: ['sad crying', 'disappointed sad', 'crying tears'],
  hype: ['hype excited', 'lets go hype', 'pumped up'],
  laugh: ['laughing lol', 'funny laugh', 'lmao laugh'],
  wave: ['waving hello', 'hi wave', 'greeting wave'],
  bye: ['goodbye wave', 'bye bye', 'farewell'],
  hug: ['hug warm', 'hugging friends', 'group hug'],
  facepalm: ['facepalm', 'oh no facepalm', 'disappointed facepalm'],
  clap: ['clapping applause', 'slow clap', 'bravo clap'],
  wow: ['wow amazed', 'mind blown wow', 'omg reaction'],
  sleep: ['sleepy tired', 'sleeping bored', 'yawn sleepy'],
  vibe: ['vibing music', 'chilling vibe', 'relaxing vibe'],
  party: ['party time', 'celebration party', 'lets party'],
  fire: ['fire hot', 'thats fire', 'on fire'],
  nope: ['nope no way', 'absolutely not nope', 'shaking head no'],
};

// Giphy GIF fetch helper
async function fetchGif(query, apiKey) {
  const encoded = encodeURIComponent(query);
  // Random offset so you get variety instead of the same GIFs every time
  const offset = Math.floor(Math.random() * 50);
  const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encoded}&limit=20&offset=${offset}&rating=pg-13&lang=en`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Giphy API error: ${res.status}`);
  const data = await res.json();

  if (!data.data || data.data.length === 0) return null;

  // Pick a random result from the batch
  const item = data.data[Math.floor(Math.random() * data.data.length)];
  return item?.images?.original?.url || item?.images?.downsized?.url || null;
}

module.exports = {
  name: 'gif',
  description: 'Send a GIF by category or search term',
  categories: Object.keys(gifCategories),

  async execute(message, args) {
    const apiKey = process.env.GIPHY_API_KEY;

    if (!apiKey) {
      return message.reply(
        '⚠️ GIFs are not configured! Add `GIPHY_API_KEY=your_key` to your `.env` file.\n' +
        '🔑 Get a free key at: https://developers.giphy.com/dashboard\n' +
        '*(Sign up → Create an App → choose API → copy your key!)*'
      );
    }

    const input = args.join(' ').toLowerCase().trim();

    if (!input) {
      const list = Object.keys(gifCategories).map(c => `\`${c}\``).join(', ');
      return message.reply(`🎬 **GIF Categories:** ${list}\n\nUsage: \`!gif <category>\` or \`!gif <anything>\``);
    }

    // If it matches a preset category, pick one of its search terms
    let query = input;
    if (gifCategories[input]) {
      const terms = gifCategories[input];
      query = terms[Math.floor(Math.random() * terms.length)];
    }

    try {
      await message.channel.sendTyping();
      const gifUrl = await fetchGif(query, apiKey);

      if (!gifUrl) {
        return message.reply(`😕 Couldn't find a GIF for **"${input}"**. Try something else!`);
      }

      const embed = new EmbedBuilder()
        .setColor(0x9B59B6)
        .setImage(gifUrl)
        .setFooter({ text: `🎬 GIF for "${input}" • Powered by Giphy | Wisteria 🌸` });

      await message.reply({ embeds: [embed] });
    } catch (err) {
      console.error('[GIF]', err);
      message.reply('❌ Failed to fetch a GIF! Check that your `GIPHY_API_KEY` in `.env` is correct.');
    }
  },
};