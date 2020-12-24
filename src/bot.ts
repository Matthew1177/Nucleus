import {join} from 'path';
import CommandHandler from './handlers/CommandHandler';
import {NucleusClient} from './lib';
//import {Intents} from 'discord.js';

const client = new NucleusClient(
  {
    databaseURI: process.env.URI!,
    database: process.env.DATABASE!,
    defaultPrefix: process.env.DEFAULT_PREFIX!,
  }
  /*{
    ws: {
      intents: Intents.ALL,
    },
  }*/
);

// TODO: remove extra data and place commandhandler in client
client.extraData.commands = new CommandHandler(
  client,
  join(__dirname, 'commands')
);
client.loadEvents(join(__dirname, 'events'));

client.login();
