import {Message} from 'discord.js';
import {REGEX} from '../../Constants';
import InvalidArgumentsError from '../../errors/InvalidArgumentsError';
import Command from '../../structures/Command';
import NucleusPermissions from '../../structures/NucleusPermissions';

export default class WarnCommand extends Command {
  name = 'warn';

  guild = true;
  dm = false;

  description = 'Warns a member';

  usage = '!warn [user] (reason)';
  example = '\n!warn @Math fix your bot\n!warn @Math';

  permissions = new NucleusPermissions('WARN_MEMBERS');

  async execute(message: Message, args: string[]) {
    if (args[1]) {
      let idreg: RegExpMatchArray | null = args[1].match(REGEX.MENTION);
      if (!idreg) idreg = args[1].match(REGEX.SNOWFLAKE);
      if (!idreg) throw new InvalidArgumentsError();
      const id = idreg[0];
      const member = message.guild!.members.cache.get(id);
      if (member) {
        if (member.id === message.guild!.ownerID) {
          message.reply("I can't warn the server owner.");
          return;
        }
        if (
          message.member!.roles.highest.comparePositionTo(
            member.roles.highest
          ) <= 0 &&
          message.author.id !== message.guild!.ownerID
        ) {
          message.reply(
            'Your highest role must be above the user you wish to warn.'
          );
          return;
        }

        args.pop();
        args.pop();
        member.kick(args.join(' '));
      } else {
        message.reply("I can't find that user.");
        return;
      }
    } else {
      throw new InvalidArgumentsError();
    }
  }
}
