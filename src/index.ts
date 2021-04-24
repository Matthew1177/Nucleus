require('dotenv').config();

import HelpCommand from './command/general/HelpCommand';
import BanCommand from './command/moderation/BanCommand';
import KickCommand from './command/moderation/KickCommand';
import WarnCommand from './command/moderation/WarnCommand';
import CommandHandler from './events/CommandHandler';
import NucleusClient from './extensions/NucleusClient';
import LoadExtensions from './utils/LoadExtensions';

LoadExtensions();

const client = new NucleusClient();

const commandHandler = new CommandHandler(client);

commandHandler.registerCommand(new BanCommand(client));
commandHandler.registerCommand(new KickCommand(client));
commandHandler.registerCommand(new WarnCommand(client));
commandHandler.registerCommand(new HelpCommand(client, commandHandler));

client.registerEvent(commandHandler);

client.login(process.env.TOKEN);
