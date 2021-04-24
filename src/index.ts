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

const commandHandler = client.registerEvent(CommandHandler);

commandHandler.registerCommand(BanCommand);
commandHandler.registerCommand(KickCommand);
commandHandler.registerCommand(WarnCommand);
commandHandler.registerCommand(HelpCommand, commandHandler);

client.login(process.env.TOKEN);
