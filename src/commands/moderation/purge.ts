import {Command, NucleusGuildMember} from '../../lib';
import {Message, NewsChannel, TextChannel} from 'discord.js';
import HelpEmbed from '../../handlers/HelpEmbed';

export default class extends Command {
  cooldown = 1;

  async check(msg: Message): Promise<boolean> {
    if (msg.channel.type !== 'dm') {
      const mem = msg.member as NucleusGuildMember;
      if (msg.member) {
        const perms = await mem.fetchPermissions();
        if (perms.has('PURGE_MESSAGES')) {
          return true;
        }
      }
    }
    return false;
  }
  async execute(message: Message, args: Array<string>): Promise<void> {
    if (!args[0]) {
      message.channel.send(new HelpEmbed(this.client, 'purge'));
      return;
    }
    message.delete();
    const channel = message.channel as TextChannel | NewsChannel;
    channel.bulkDelete(Number(args[0]));
  }
}
