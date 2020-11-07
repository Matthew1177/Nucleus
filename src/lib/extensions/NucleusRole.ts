import {Role, Structures} from 'discord.js';
import NucleusPermissions from '../structures/NucleusPermissions';
import NucleusClient from './NucleusClient';

export default class NucleusRole extends Role {
  async fetchPermissions(): Promise<NucleusPermissions> {
    const client = this.client as NucleusClient;
    if (!client.database) return new NucleusPermissions(0);
    const guild = await client.database.getGuild(this.guild.id);
    if (guild && guild.permissions) {
      const perms = guild.permissions as Record<string, number>;
      return new NucleusPermissions(perms[this.id]);
    } else {
      // deal with missing attrs
      if (!guild) {
        client.database.insertGuild({
          ...client.database.baseGuild,
          id: this.guild.id,
        });
      } else {
        client.database.updateGuild(this.guild.id, {
          $set: {permissions: []},
        });
      }
    }
    return new NucleusPermissions(0);
  }
}

Structures.extend('Role', () => NucleusRole);
