import {Client} from 'discord.js';
import NucleusPermissions from './NucleusPermissions';

export default abstract class Command {
  client: Client;
  abstract name: string;
  aliases = [];
  premium = false;
  permissions: NucleusPermissions = new NucleusPermissions(0);

  constructor(client: Client) {
    this.client = client;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  abstract execute(...args: unknown[]): void;
}
