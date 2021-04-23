import {Message} from 'discord.js';
import {REGEX} from '../../Constants';
import InvalidArgumentsError from '../../errors/InvalidArgumentsError';
import Command from '../../structures/Command';
import NucleusPermissions from '../../structures/NucleusPermissions';

export default class KickCommand extends Command {
  name = 'kick';

  guild = true;
  dm = false;

  description = 'Kicks a member';

  usage = '!kick [user] (reason) - Kicks user for a optional reason';
  example = '\n!kick @Math LEAVE!\n!kick @Math!';

  permissions = new NucleusPermissions('KICK_MEMBERS');

  async execute(message: Message, args: string[]) {
    if (args[1]) {
      let idreg: RegExpMatchArray | null = args[1].match(REGEX.MENTION);
      if (!idreg) idreg = args[1].match(REGEX.SNOWFLAKE);
      if (!idreg) throw new InvalidArgumentsError();
      const id = idreg[0];
      const member = message.guild!.members.cache.get(id);
      if (member) {
        if (member.id === message.guild!.ownerID) {
          message.reply("I can't kick the server owner.");
          return;
        }
        if (
          message.member!.roles.highest.comparePositionTo(
            member.roles.highest
          ) <= 0 &&
          message.author.id !== message.guild!.ownerID
        ) {
          message.reply(
            'Your highest role must be above the user you wish to punish.'
          );
          return;
        }
        if (member.kickable) {
          args.pop();
          args.pop();
          member
            .kick(args.join(' '))
            .then(() => {
              message.reply(member.user.tag + ' kicked.');
            })
            .catch(e => {
              console.error(e);
              message.reply('Unable to kick that member.');
            });
        } else {
          message.reply(
            "I can't kick that user. Please make sure I have `KICK_MEMBERS` permission and have a higher role than that user."
          );
          return;
        }
      } else {
        message.reply("I can't find that user.");
        return;
      }
    } else {
      throw new InvalidArgumentsError();
    }
  }
}
