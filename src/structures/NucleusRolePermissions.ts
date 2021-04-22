import {Role} from 'discord.js';
import NucleusPermissions, {
  NucleusPermissionResolvable,
} from './NucleusPermissions';

export default class NucleusRolePermissions extends NucleusPermissions {
  private role: Role;
  constructor(bits: NucleusPermissionResolvable, role: Role) {
    super(bits);
    this.role = role;
  }

  any(permission: NucleusPermissionResolvable, checkAdmin = true) {
    return (
      (checkAdmin && this.role.permissions.has('ADMINISTRATOR')) ||
      super.any(permission)
    );
  }

  has(permission: NucleusPermissionResolvable, checkAdmin = true) {
    return (
      (checkAdmin && this.role.permissions.has('ADMINISTRATOR')) ||
      super.has(permission)
    );
  }
}
