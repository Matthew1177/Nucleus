import {Command} from '../../lib';
import {Message} from 'discord.js';
import HelpEmbed from '../../handlers/HelpEmbed';
export default class extends Command {
  cooldown = 0;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(message: Message, args: Array<string>): Promise<void> {
    message.channel.send(new HelpEmbed(this.client, args[0]));
  }

  async check(): Promise<boolean> {
    return true;
  }
}
