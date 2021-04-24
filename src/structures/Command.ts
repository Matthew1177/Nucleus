import {Client, Message} from 'discord.js';
import NucleusPermissions from './NucleusPermissions';

export default abstract class Command {
  abstract readonly name: string;
  readonly aliases: string[] = [];
  readonly premium = false;
  /**
   * Will only be checked if the command is run on a guild.
   */
  abstract readonly permissions: NucleusPermissions;
  abstract readonly dm: boolean;
  abstract readonly guild: boolean;
  abstract readonly description: string;
  abstract readonly usage: string;
  abstract readonly example: string;

  constructor(readonly client: Client) {}

  abstract execute(message: Message, args: string[]): void;
}
