import {Client} from 'discord.js';
import NucleusPermissions from './NucleusPermissions';

export enum CommandContext {
  DM_CHANNL,
  GUILD_CHANNEL,
  BOTH,
}

export default abstract class Command {
  client: Client;
  abstract name: string;
  aliases = [];
  premium = false;
  permissions: NucleusPermissions = new NucleusPermissions(0);
  abstract context: CommandContext;

  constructor(client: Client) {
    this.client = client;
  }

  abstract execute(...args: unknown[]): void;
}
