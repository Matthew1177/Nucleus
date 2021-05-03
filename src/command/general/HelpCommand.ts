import {Message, Permissions} from 'discord.js';
import CommandHandler from '../../events/CommandHandler';
import NucleusClient from '../../extensions/NucleusClient';
import Command from '../../structures/Command';
import NucleusPermissions from '../../structures/NucleusPermissions';

export default class HelpCommand extends Command {
  readonly botPermissions = new Permissions(0);
  readonly permissions: NucleusPermissions = new NucleusPermissions(0);
  readonly dm = true;
  readonly guild = true;
  readonly name = 'help';
  readonly description = 'Provides help';
  readonly usage =
    '{p}help (command) - Provides help information for the command or help information for the bot';
  readonly example = '\n{p}help\n{p}help ban';

  readonly commandHandler: CommandHandler;

  constructor(client: NucleusClient, commandHandler: CommandHandler) {
    super(client);
    this.commandHandler = commandHandler;
  }

  execute(message: Message, args: string[]): void {
    message.channel.send(
      this.commandHandler.helpEmbed(
        args[1] ? this.commandHandler.getCommand(args[1]) : undefined,
        message.content.slice(0, message.content.length - args.join(' ').length)
      )
    );
  }
}
