import {Message} from 'discord.js';
import {REGEX} from '../../Constants';
import InvalidArgumentsError from '../../errors/InvalidArgumentsError';
import Command from '../../structures/Command';

export default class BanCommand extends Command {
  name = 'ban';

  guild = true;
  dm = false;

  async execute(message: Message, args: string[]) {
    if (args[1]) {
      let idreg: RegExpMatchArray | null = args[1].match(REGEX.MENTION);
      if (!idreg) idreg = args[1].match(REGEX.SNOWFLAKE);
      if (!idreg) throw new InvalidArgumentsError();
      const id = idreg[0];
      const member = message.guild!.members.cache.get(id);
      if (member) {
        if (member.id === message.guild!.ownerID) {
          message.reply("I can't ban the server owner.");
          return;
        }
        if (member.bannable) {
          args.pop();
          args.pop();
          member.ban({reason: args.join(' '), days: 1});
        } else {
          message.reply(
            "I can't ban that user. Please make sure I have `BAN_MEMBERS` permission and have a higher role than that user."
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
