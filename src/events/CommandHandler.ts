import {Message} from 'discord.js';
import Event from '../structures/Event';

export default class CommandHandler extends Event {
  name = 'message';

  async execute(message: Message) {}
}
