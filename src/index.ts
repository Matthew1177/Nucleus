require('dotenv').config();

import BanCommand from './command/moderation/BanCommand';
import CommandHandler from './events/CommandHandler';
import NucleusClient from './extensions/NucleusClient';
import LoadExtensions from './utils/LoadExtensions';

LoadExtensions();

const client = new NucleusClient();

const commandHandler = new CommandHandler(client);

commandHandler.registerCommand(new BanCommand(client));

client.registerEvent(commandHandler);

client.login(process.env.TOKEN);
