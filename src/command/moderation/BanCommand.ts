import {Message, Permissions} from 'discord.js';
import {REGEX} from '../../Constants';
import InvalidArgumentsError from '../../errors/InvalidArgumentsError';
import NucleusGuild, {ModerationTypes} from '../../extensions/NucleusGuild';
import NucleusGuildMember from '../../extensions/NucleusGuildMember';
import Command from '../../structures/Command';
import NucleusPermissions from '../../structures/NucleusPermissions';

export default class BanCommand extends Command {
  readonly botPermissions = new Permissions('BAN_MEMBERS');
  readonly name = 'ban';
  readonly aliases = ['pban', 'permban'];

  readonly description = 'Permanently ban a member';

  readonly usage =
    '!ban [user] (reason) - Permanently bans a user for an optional reason';
  readonly example = '\n!ban @Silk Begone forever!\n!ban @Silk';

  readonly guild = true;
  readonly dm = false;

  readonly permissions = new NucleusPermissions('BAN_MEMBERS');

  async execute(message: Message, args: string[]) {
    if (args[1]) {
      let idreg: RegExpMatchArray | null = args[1].match(REGEX.MENTION);
      if (!idreg) idreg = args[1].match(REGEX.SNOWFLAKE);
      if (!idreg) throw new InvalidArgumentsError();
      const id = idreg[0];
      const member = message.guild!.members.cache.get(id);
      args.shift();
      args.shift();
      const reason = args.join(' ');
      if (member) {
        if (member.id === message.guild!.ownerID) {
          message.reply("I can't ban the server owner.");
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
        if (member.bannable) {
          member
            .ban({reason, days: 1})
            .then(() => {
              message.reply(
                member.user.tag +
                  ' banned. Reason: ' +
                  (reason || 'Unspecified.')
              );
              const guild = member.guild as NucleusGuild;
              guild.addModLog({
                moderator: message.member! as NucleusGuildMember,
                offender: member.id,
                reason,
                case_type: ModerationTypes.Ban,
                duration: undefined,
              });
            })
            .catch(e => {
              console.error(e);
              message.reply('Unable to ban that member.');
            });
        } else {
          message.reply(
            "I can't kick that user. Please make sure I have a higher role than that user."
          );
          return;
        }
      } else {
        message
          .guild!.members.ban(id, {days: 1, reason})
          .catch(e => {
            console.error(e);
            message.reply('Unable to ban that member.');
          })
          .then(() => {
            message.channel.send(
              `<@${id}>` + ' banned. Reason: ' + (reason || 'Unspecified.')
            );
            const guild = message.member!.guild as NucleusGuild;
            guild.addModLog({
              moderator: message.member! as NucleusGuildMember,
              offender: id,
              reason,
              case_type: ModerationTypes.Ban,
              duration: undefined,
            });
          });
        return;
      }
    } else {
      throw new InvalidArgumentsError();
    }
  }
}
