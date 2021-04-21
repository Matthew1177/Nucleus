import {Client, ClientEvents} from 'discord.js';

export default abstract class Event {
  client: Client;
  abstract name: keyof ClientEvents;
  once = false;

  constructor(client: Client) {
    this.client = client;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  abstract execute(...args: unknown[]): void;
}
