import {Role} from 'discord.js';
import {PERMISSIONS_SETTINGS_LIFETIME} from '../Constants';
import NucleusRolePermissions from '../structures/NucleusRolePermissions';
import NucleusClient from './NucleusClient';

export default class NucleusRole extends Role {
  private permissionsFetchedTimestamp: number | undefined;
  private cachedPermissions: NucleusRolePermissions | undefined;

  async fetchNucleusPermissions(): Promise<NucleusRolePermissions> {
    if (this.permissionsFetchedTimestamp && this.cachedPermissions) {
      if (
        Date.now() - this.permissionsFetchedTimestamp <=
        PERMISSIONS_SETTINGS_LIFETIME
      ) {
        return this.cachedPermissions;
      }
    }
    const client = this.client as NucleusClient;
    const res = await client.pool.query(
      'SELECT * FROM public.guild_role_permissions WHERE id=$1;',
      [this.id]
    );
    if (res.rowCount < 1) {
      let bitset = 0;
      if (this.id !== this.guild.id) {
        bitset = (
          await (this.guild.roles
            .everyone as NucleusRole).fetchNucleusPermissions()
        ).bitfield;
      }
      await client.pool.query(
        'INSERT INTO public.guild_role_permissions(id, guild_id, bitset) VALUES ($1, $2, $3);',
        [BigInt(this.id), BigInt(this.guild.id), bitset]
      );
      return new NucleusRolePermissions(bitset, this);
    } else {
      return new NucleusRolePermissions(res.rows[0].bitset, this);
    }
  }
}
