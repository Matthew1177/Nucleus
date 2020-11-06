import {Command} from '../../lib';
import {Message} from 'discord.js';

export default class extends Command {
  cooldown = 0;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async check(msg: Message): Promise<boolean> {
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(message: Message, args: Array<string>): Promise<void> {
    if (message.channel.type === 'dm') {
      message.channel.send(
        'The current prefix is `' + process.env.DEFAULT_PREFIX + '`.'
      );
      return;
    } else {
      const guild = await this.client.database.getGuild(message.guild!.id);
      message.channel.send('The current prefix is `' + guild!.prefix! + '`.');
    }
  }
}
