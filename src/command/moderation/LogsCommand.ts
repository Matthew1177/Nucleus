import {Message, Permissions} from 'discord.js';
import {REGEX} from '../../Constants';
import InvalidArgumentsError from '../../errors/InvalidArgumentsError';
import NucleusGuild from '../../extensions/NucleusGuild';
import Command from '../../structures/Command';
import NucleusPermissions from '../../structures/NucleusPermissions';

export default class LogsCommand extends Command {
  readonly botPermissions = new Permissions(0);
  readonly name = 'logs';

  readonly description =
    "Fetches the id's of cases where the specified user is the offender";

  readonly usage = '{p}logs (user)';
  readonly example = '{p}logs @Matthew';

  readonly guild = true;
  readonly dm = false;

  readonly permissions = new NucleusPermissions('WARN_MEMBERS');

  async execute(message: Message, args: string[]) {
    if (args[1]) {
      let idreg: RegExpMatchArray | null = args[1].match(REGEX.MENTION);
      if (!idreg) idreg = args[1].match(REGEX.SNOWFLAKE);
      if (!idreg) throw new InvalidArgumentsError();
      const id = idreg[0];
      const guild = message.guild! as NucleusGuild;
      const modlogs = await guild.fetchModLogs(id);
      message.channel.send(
        modlogs.reduce((prev, cur) => {
          return (prev += cur.id + '\n');
        }, '**Cases:**\n'),
        {split: true}
      );
    } else throw new InvalidArgumentsError();
  }
}
