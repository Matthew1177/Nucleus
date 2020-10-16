import {BitField, BitFieldResolvable} from 'discord.js';
import {NucleusClient} from '..';

type Permissions =
  | 'KICK_MEMBERS'
  | 'BAN_MEMBERS'
  | 'MUTE_MEMBERS'
  | 'PURGE_MESSAGES';

type NucleusPermissionResolvable = BitFieldResolvable<Permissions>;

const FLAGS = {
  KICK_MEMBERS: 1 << 0,
  BAN_MEMBERS: 1 << 1,
  MUTE_MEMBERS: 1 << 2,
  PURGE_MESSAGES: 1 << 3,
};

export default class NucleusPermissions extends BitField<Permissions> {
  client: NucleusClient;
  static FLAGS = FLAGS;
  static ALL = Object.values(FLAGS).reduce((all, p) => all | p, 0);
  constructor(client: NucleusClient, bits: NucleusPermissionResolvable) {
    super(bits);
    this.client = client;
  }
  any(permission: BitFieldResolvable<Permissions>, checkAdmin = true): boolean {
    return (
      // @ts-ignore
      (checkAdmin && super.has(this.constructor.FLAGS.ADMINISTRATOR)) ||
      super.any(permission)
    );
  }
}
