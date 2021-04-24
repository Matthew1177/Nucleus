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
  abstract permissions: NucleusPermissions;
  abstract dm: boolean;
  abstract guild: boolean;
  abstract description: string;
  abstract usage: string;
  abstract example: string;

  constructor(client: Client) {
    this.client = client;
  }

  abstract execute(message: Message, args: string[]): void;
}
