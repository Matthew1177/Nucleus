import {Client, Message} from 'discord.js';
import CommandHandler from '../../events/CommandHandler';
import Command from '../../structures/Command';
import NucleusPermissions from '../../structures/NucleusPermissions';

export default class HelpCommand extends Command {
  permissions: NucleusPermissions = new NucleusPermissions(0);
  dm = true;
  guild = true;
  name = 'help';
  description = 'Provides help';
  usage =
    '!help (command) - Provides help information for the command or help information for the bot';
  example = '\n!help\n!help ban';

  commandHandler: CommandHandler;

  constructor(client: Client, commandHandler: CommandHandler) {
    super(client);
    this.commandHandler = commandHandler;
  }

  execute(message: Message, args: string[]): void {
    message.channel.send(
      this.commandHandler.helpEmbed(
        args[1] ? this.commandHandler.getCommand(args[1]) : undefined
      )
    );
  }
}
