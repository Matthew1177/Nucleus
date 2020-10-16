import {BitField, BitFieldResolvable} from 'discord.js';

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
  static FLAGS = FLAGS;
  static ALL = Object.values(FLAGS).reduce((all, p) => all | p, 0);
  constructor(bits: NucleusPermissionResolvable) {
    super(bits);
  }
}
