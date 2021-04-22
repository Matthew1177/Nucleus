import {GuildMember, Role} from 'discord.js';
import NucleusPermissions, {
  NucleusPermissionResolvable,
} from '../structures/NucleusPermissions';
import NucleusRole from './NucleusRole';

export default class NucleusGuildMember extends GuildMember {
  async hasNucleusPermission(
    permission: NucleusPermissionResolvable
  ): Promise<boolean> {
    if (this.user.id === this.guild.ownerID) return true;
    if (this.hasPermission('ADMINISTRATOR')) return true;
    const permissionsArray: NucleusPermissionResolvable = [];
    this.roles.cache.forEach(async (role: Role) => {
      const nrole = role as NucleusRole;
      await nrole.fetchNucleusPermissions();
    });
    return new NucleusPermissions(permissionsArray).has(permission);
  }
}
