import {Client} from 'discord.js';

export default abstract class Event {
  client: Client;
  abstract name: string;
  once = false;

  constructor(client: Client) {
    this.client = client;
  }

  abstract execute(...args: unknown[]): void;
}
