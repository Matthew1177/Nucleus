require('dotenv').config();

import NucleusClient from './extensions/NucleusClient';

const client = new NucleusClient({
  ws: {
    intents: [
      'GUILDS',
      'GUILD_MEMBERS',
      'GUILD_BANS',
      'GUILD_MESSAGES',
      'DIRECT_MESSAGES',
    ],
  },
});

client.login(process.env.TOKEN);
