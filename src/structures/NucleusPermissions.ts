import {BitField, BitFieldResolvable} from 'discord.js';

const FLAGS = {
  KICK_MEMBERS: 1 << 0,
  BAN_MEMBERS: 1 << 1,
  MUTE_MEMBERS: 1 << 2,
  PURGE_MESSAGES: 1 << 3,
  WARN_MEMBERS: 1 << 4,
};

export type NucleusPermissionResolvable = BitFieldResolvable<
  keyof typeof FLAGS
>;

export default class NucleusPermissions extends BitField<keyof typeof FLAGS> {
  static FLAGS = FLAGS;
  static ALL = Object.values(FLAGS).reduce((all, p) => all | p, 0);
  static DEFAULT = 0;
  constructor(bits: NucleusPermissionResolvable) {
    super(bits);
  }
}
