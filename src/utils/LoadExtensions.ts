import {Structures} from 'discord.js';
import NucleusGuild from '../extensions/NucleusGuild';
import NucleusGuildMember from '../extensions/NucleusGuildMember';
import NucleusRole from '../extensions/NucleusRole';

export default function LoadExtensions() {
  Structures.extend('Guild', () => NucleusGuild);
  Structures.extend('GuildMember', () => NucleusGuildMember);
  Structures.extend('Role', () => NucleusRole);
}
