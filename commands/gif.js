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

// Tenor GIF fetch helper
async function fetchGif(query, apiKey) {
  const encoded = encodeURIComponent(query);
  const url = `https://tenor.googleapis.com/v2/search?q=${encoded}&key=${apiKey}&limit=20&contentfilter=medium`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Tenor API error');
  const data = await res.json();

  if (!data.results || data.results.length === 0) return null;

  // Pick a random result from top 20
  const item = data.results[Math.floor(Math.random() * data.results.length)];
  return item.media_formats?.gif?.url || item.media_formats?.tinygif?.url || null;
}

module.exports = {
  name: 'gif',
  description: 'Send a GIF by category or search term',
  categories: Object.keys(gifCategories),

  async execute(message, args) {
    const apiKey = process.env.TENOR_API_KEY;

    if (!apiKey) {
      return message.reply('⚠️ GIFs are not configured yet! Ask the server admin to add a `TENOR_API_KEY` to the bot config.');
    }

    const input = args.join(' ').toLowerCase().trim();

    if (!input) {
      const list = Object.keys(gifCategories).map(c => `\`${c}\``).join(', ');
      return message.reply(`🎬 **GIF Categories:** ${list}\n\nUsage: \`!gif <category>\` or \`!gif <anything>\``);
    }

    // Check if it matches a preset category (use one of its search terms)
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
        .setFooter({ text: `🎬 GIF for "${input}" • Powered by Tenor | Wisteria 🌸` });

      await message.reply({ embeds: [embed] });
    } catch (err) {
      console.error('[GIF]', err);
      message.reply('❌ Failed to fetch a GIF. Make sure the Tenor API key is valid!');
    }
  },
};
