import {Message, Permissions} from 'discord.js';
import {REGEX} from '../../Constants';
import InvalidArgumentsError from '../../errors/InvalidArgumentsError';
import NucleusGuild, {ModerationTypes} from '../../extensions/NucleusGuild';
import NucleusGuildMember from '../../extensions/NucleusGuildMember';
import Command from '../../structures/Command';
import NucleusPermissions from '../../structures/NucleusPermissions';

export default class KickCommand extends Command {
  readonly botPermissions = new Permissions('KICK_MEMBERS');
  readonly name = 'kick';

  readonly guild = true;
  readonly dm = false;

  readonly description = 'Kicks a member';

  readonly usage = '{p}kick [user] (reason) - Kicks user for a optional reason';
  readonly example = '\n{p}kick @Math LEAVE!\n{p}kick @Math';

  readonly permissions = new NucleusPermissions('KICK_MEMBERS');

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
          args.shift();
          args.shift();
          const reason = args.join(' ');
          member
            .kick(reason)
            .catch(e => {
              console.error(e);
              message.reply('Unable to kick that member.');
            })
            .then(() => {
              message.channel.send(
                `<@${id}>` + ' kicked. Reason: ' + (reason || 'Unspecified.')
              );
              const guild = member.guild as NucleusGuild;
              guild.addModLog({
                moderator: message.member! as NucleusGuildMember,
                offender: member.id,
                reason,
                case_type: ModerationTypes.Kick,
                duration: undefined,
              });
            });
        } else {
          message.reply(
            "I can't kick that user. Please make sure I have a higher role than that user."
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
