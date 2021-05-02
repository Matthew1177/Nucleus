import {Message, MessageEmbed, Permissions} from 'discord.js';
import {NCS, REGEX} from '../../Constants';
import InvalidArgumentsError from '../../errors/InvalidArgumentsError';
import NucleusGuild, {ModerationTypes} from '../../extensions/NucleusGuild';
import Command from '../../structures/Command';
import NucleusPermissions from '../../structures/NucleusPermissions';

export default class CaseCommand extends Command {
  readonly botPermissions = new Permissions(0);
  readonly name = 'case';

  readonly description = 'Warns a member';

  readonly usage = '!case [case id] - Retrieves information about a case';
  readonly example = '!case d638bbae-aae4-11eb-bcbc-0242ac130002';

  readonly guild = true;
  readonly dm = false;

  readonly permissions = new NucleusPermissions('WARN_MEMBERS');

  async execute(message: Message, args: string[]) {
    if (args[1]) {
      if (!args[1].match(REGEX.UUID)) throw new InvalidArgumentsError();
      const guild = message.guild! as NucleusGuild;
      const [caze] = await guild.fetchCase(args[1]);

      if (!caze) {
        message.channel.send('No case found.');
        return;
      }

      message.channel.send(
        new MessageEmbed()
          .setTitle('Member ' + ModerationTypes[caze.case_type])
          .setDescription(
            `**Offender:** <@${caze.offender_id}>
            **Moderator:** <@${caze.moderator_id}>
            **Reason:** ${caze.reason || 'Unspecified.'}`
          )
          .setFooter(`Case ID: ${caze.id}`)
          .setColor(NCS.BLUE)
      );
    } else throw new InvalidArgumentsError();
  }
}
