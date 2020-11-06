import {GuildMember, Structures} from 'discord.js';
//import NucleusClient from './NucleusClient';
import NucleusPermissions from '../structures/NucleusPermissions';
import NucleusClient from './NucleusClient';
import NucleusRole from './NucleusRole';

export default class NucleusGuildMember extends GuildMember {
  async fetchPermissions(): Promise<NucleusPermissions> {
    const client = this.client as NucleusClient;
    if (super.permissions.has('ADMINISTRATOR')) {
      return new NucleusPermissions(NucleusPermissions.ALL);
    }
    const guild = await client.database.getGuild(this.guild.id); // yes
    if (!guild) {
      // MAKE GUILD
      return new NucleusPermissions(0);
    } else if (typeof guild.permissions === 'object') {
      // calc perms
      const roleperms: NucleusPermissions[] = [];
      super.roles.cache.forEach(async role => {
        const nrole = role as NucleusRole;
        roleperms.push(await nrole.fetchPermissions());
      });
      return new NucleusPermissions(roleperms);
    } else {
      return new NucleusPermissions(0);
    }
  }
}
Structures.extend('GuildMember', () => NucleusGuildMember);
