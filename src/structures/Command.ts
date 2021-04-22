import {Client, Message} from 'discord.js';
import NucleusPermissions from './NucleusPermissions';

export default abstract class Command {
  client: Client;
  abstract name: string;
  aliases: string[] = [];
  premium = false;
  /**
   * Will only be checked if the command is run on a guild.
   */
  permissions: NucleusPermissions = new NucleusPermissions(0);
  dm = true;
  guild = true;

  constructor(client: Client) {
    this.client = client;
  }

  abstract execute(message: Message, args: string[]): void;
}
