import {Client} from 'discord.js';
import NucleusPermissions from './NucleusPermissions';

export default abstract class Command {
  client: Client;
  abstract name: string;
  aliases: string[] = [];
  premium = false;
  permissions: NucleusPermissions = new NucleusPermissions(0);
  dm = true;
  guild = true;

  constructor(client: Client) {
    this.client = client;
  }

  abstract execute(...args: unknown[]): void;
}
