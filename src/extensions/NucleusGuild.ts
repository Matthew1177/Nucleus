import {Guild, MessageEmbed} from 'discord.js';
import {GUILD_SETTINGS_LIFETIME, NCS} from '../Constants';
import GuildSettings from '../structures/GuildSettings';
import NucleusClient from './NucleusClient';
import NucleusGuildMember from './NucleusGuildMember';
import {v4} from 'uuid';

export enum ModerationTypes {
  Kick = 0,
  Ban = 1,
  Warn = 2,
}

export type AddModLogOptions = {
  case_type: ModerationTypes;
  moderator: NucleusGuildMember;
  offender: string;
  reason: string | undefined;
  /**
   * Ms
   */
  duration: number | undefined;
};

export default class NucleusGuild extends Guild {
  private settingsFetchedTimestamp: number | undefined;
  private cachedSettings: GuildSettings | undefined;

  async fetchSettings(): Promise<GuildSettings> {
    if (this.settingsFetchedTimestamp && this.cachedSettings) {
      if (
        Date.now() - this.settingsFetchedTimestamp >
        GUILD_SETTINGS_LIFETIME
      ) {
        this.cachedSettings = await this.requestSettingsFromDatabase();
        this.settingsFetchedTimestamp = Date.now();
      }
    } else {
      this.cachedSettings = await this.requestSettingsFromDatabase();
      this.settingsFetchedTimestamp = Date.now();
    }
    return this.cachedSettings;
  }

  private async requestSettingsFromDatabase(): Promise<GuildSettings> {
    const client = this.client as NucleusClient;
    const res = await client.pool.query(
      'SELECT * FROM public.guild_settings WHERE id=$1;',
      [BigInt(this.id)]
    );
    if (res.rowCount < 1) {
      await client.pool.query(
        'INSERT INTO public.guild_settings(id, prefixes, mod_log_channel) VALUES ($1, $2, $3);',
        [BigInt(this.id), ['!'], undefined]
      );
      return new GuildSettings({prefixes: ['!'], mod_log_channel: undefined});
    } else {
      return new GuildSettings(res.rows[0]);
    }
  }

  async fetchModLogs(member: string) {
    const client = this.client as NucleusClient;
    const res = await client.pool.query(
      'SELECT * FROM public.guild_moderation_logs WHERE offender_id=$1 AND guild_id=$2;',
      [member, this.id]
    );
    return res.rows;
  }

  async fetchCase(uuid: string) {
    const client = this.client as NucleusClient;
    const res = await client.pool.query(
      'SELECT * FROM public.guild_moderation_logs WHERE id=$1 AND guild_id=$2;',
      [uuid, this.id]
    );
    return res.rows;
  }

  async addModLog(option: AddModLogOptions) {
    const client = this.client as NucleusClient;
    const now = Date.now();
    const uuid = v4();
    await client.pool.query(
      `INSERT INTO public.guild_moderation_logs(
        id, guild_id, case_type, moderator_id, offender_id, reason, start_timestamp, end_timestamp)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
      [
        uuid,
        option.moderator.guild.id,
        option.case_type,
        option.moderator.id,
        option.offender,
        option.reason || undefined,
        now,
        option.duration ? now + option.duration / 1000 : undefined,
      ]
    );
    const guild = option.moderator.guild as NucleusGuild;
    const settings = await guild.fetchSettings();
    if (settings.modLogChannel) {
      if (guild.channels.cache.has(settings.modLogChannel)) {
        const channel = guild.channels.cache.get(
          settings.modLogChannel.toString()
        );
        if (
          channel &&
          guild.me
            ?.permissionsIn(channel)
            .has(['VIEW_CHANNEL', 'SEND_MESSAGES'])
        ) {
          if (channel.isText()) {
            const offender = client.users.cache.get(option.offender);
            channel.send(
              new MessageEmbed()
                .setTitle('Member ' + ModerationTypes[option.case_type])
                .setDescription(
                  `**Offender:** ${offender ? offender.tag + ' ' : ''}${
                    offender || `<@${option.offender}>`
                  }
                  **Moderator:** ${option.moderator.user.tag} ${
                    option.moderator
                  }
                  **Reason:** ${option.reason || 'Unspecified.'}`
                )
                .setFooter(`Case ID: ${uuid}`)
                .setColor(NCS.BLUE)
                .setTimestamp(new Date())
            );
          }
        }
      }
    }
    return;
  }
}
