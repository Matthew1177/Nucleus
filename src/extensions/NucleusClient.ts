import {Client} from 'discord.js';
import Event from '../structures/Event';

export default class NucleusClient extends Client {
  registerEvent(event: Event) {
    super[event.once ? 'once' : 'on'](event.name, event.execute);
  }
}
