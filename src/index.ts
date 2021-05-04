require('dotenv').config();

import HelpCommand from './command/general/HelpCommand';
import PrefixCommand from './command/general/PrefixCommand';
import BanCommand from './command/moderation/BanCommand';
import CaseCommand from './command/moderation/CaseCommand';
import KickCommand from './command/moderation/KickCommand';
import LogsCommand from './command/moderation/LogsCommand';
import WarnCommand from './command/moderation/WarnCommand';
import CommandHandler from './events/CommandHandler';
import NucleusClient from './extensions/NucleusClient';
import LoadExtensions from './utils/LoadExtensions';

LoadExtensions();

const client = new NucleusClient();

const commandHandler = new CommandHandler(client)
  .registerCommand(new BanCommand(client))
  .registerCommand(new KickCommand(client))
  .registerCommand(new WarnCommand(client))
  .registerCommand(new CaseCommand(client))
  .registerCommand(new PrefixCommand(client))
  .registerCommand(new LogsCommand(client));

commandHandler.registerCommand(new HelpCommand(client, commandHandler));

client.registerEvent(commandHandler);

client.login(process.env.TOKEN);
