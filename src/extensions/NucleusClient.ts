import {Client} from 'discord.js';
import {Pool} from 'pg';
import Event from '../structures/Event';

export default class NucleusClient extends Client {
  pool: Pool;

  constructor() {
    super({
      ws: {
        intents: [
          'GUILDS',
          'GUILD_MEMBERS',
          'GUILD_BANS',
          'GUILD_MESSAGES',
          'DIRECT_MESSAGES',
        ],
      },
    });

    this.pool = new Pool();
  }

  registerEvent(event: Event) {
    super[event.once ? 'once' : 'on'](event.name, event.execute);
  }
}
