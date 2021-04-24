import {Client, Constructable} from 'discord.js';
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
      disableMentions: 'everyone',
      allowedMentions: {},
    });

    this.pool = new Pool();
  }

  registerEvent<T extends Event>(
    eventClass: Constructable<T>,
    ...args: unknown[]
  ): T {
    const event = new eventClass(this, ...args);
    super[event.once ? 'once' : 'on'](event.name, event.execute.bind(event));
    return event;
  }
}
