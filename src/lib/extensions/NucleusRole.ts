import {Role, Structures} from 'discord.js';
import NucleusPermissions from '../structures/NucleusPermissions';
import NucleusClient from './NucleusClient';

export default class NucleusRole extends Role {
  async fetchPermissions(): Promise<NucleusPermissions> {
    const client = super.client as NucleusClient;
    const guild = await client.database.getGuild(super.guild.id);
    if (super.permissions.has('ADMINISTRATOR')) {
      return new NucleusPermissions(NucleusPermissions.ALL);
    }
    if (guild && guild.permissions) {
      const perms = guild.permissions as Record<string, number>;
      return new NucleusPermissions(perms[super.id]);
    } else {
      client.database.resetGuild(super.guild.id);
    }
    return new NucleusPermissions(0);
  }
}

Structures.extend('Role', () => NucleusRole);
