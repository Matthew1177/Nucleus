import {Message} from 'discord.js';
import NucleusGuild from '../extensions/NucleusGuild';
import Event from '../structures/Event';

export default class CommandHandler extends Event {
  name = 'message';

  async execute(message: Message) {
    if (!this.client.user) return;
    if (message.author.bot) return;
    const prefix = await this.getPrefix(message);
    if (prefix !== undefined) {
      const args = message.content.substring(prefix.length).split(' ');
    }
  }

  private async getPrefix(message: Message): Promise<string | undefined> {
    if (message.content.startsWith(`<@${this.client.user!.id}>`))
      return `<@${this.client.user!.id}>`;
    if (message.content.startsWith(`<@!${this.client.user!.id}>`))
      return `<@!${this.client.user!.id}>`;

    if (message.channel.type === 'dm') {
      if (message.content.startsWith('!')) return '!';
    } else {
      const guild = message.guild! as NucleusGuild;
      const prefixes = (await guild.fetchSettings()).prefixes;
      for (const i in prefixes) {
        if (message.content.startsWith(prefixes[i])) return prefixes[i];
      }
    }
    return undefined;
  }
}
