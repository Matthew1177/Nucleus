import {Message, Permissions} from 'discord.js';
import Base from './Base';
import NucleusPermissions from './NucleusPermissions';

export default abstract class Command extends Base {
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
  abstract readonly botPermissions: Permissions;

  abstract execute(message: Message, args: string[]): void;
}
