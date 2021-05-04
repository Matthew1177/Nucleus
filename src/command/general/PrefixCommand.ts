import {Message, MessageEmbed, Permissions} from 'discord.js';
import NucleusClient from '../../extensions/NucleusClient';
import NucleusGuild from '../../extensions/NucleusGuild';
import Command from '../../structures/Command';
import NucleusPermissions from '../../structures/NucleusPermissions';

export default class PrefixCommand extends Command {
  readonly botPermissions = new Permissions(0);
  readonly permissions: NucleusPermissions = new NucleusPermissions(0);
  readonly dm = true;
  readonly guild = true;
  readonly name = 'prefix';
  readonly aliases = ['prefixes'];
  readonly description =
    'Provides prefixes. To modify prefixes please visit the dashboard';
  readonly usage = '{p}prefix';
  readonly example = '{p}prefix';

  constructor(client: NucleusClient) {
    super(client);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(message: Message, args: string[]): Promise<void> {
    let num = 0;
    let desc = '';
    if (message.channel.type === 'dm') {
      num += 1;
      desc += '`!`\n';
    } else {
      const guild = message.guild as NucleusGuild;
      const {prefixes} = await guild.fetchSettings();
      num += prefixes.length;
      for (const p in prefixes) {
        desc += '`' + prefixes[p] + '`\n';
      }
    }
    const embed = new MessageEmbed()
      .setFooter(
        'You can also mention me to run commands.\nTo update the prefixes, please visit the dashboard.'
      )
      .setTitle(`Prefixes (${num})`);
    embed.setDescription(desc);
    message.channel.send(embed);
  }
}
