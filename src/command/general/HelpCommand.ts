import {Client, Message, Permissions} from 'discord.js';
import CommandHandler from '../../events/CommandHandler';
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
    '!help (command) - Provides help information for the command or help information for the bot';
  readonly example = '\n!help\n!help ban';

  constructor(client: Client, readonly commandHandler: CommandHandler) {
    super(client);
  }

  execute(message: Message, args: string[]): void {
    message.channel.send(
      this.commandHandler.helpEmbed(
        args[1] ? this.commandHandler.getCommand(args[1]) : undefined
      )
    );
  }
}
