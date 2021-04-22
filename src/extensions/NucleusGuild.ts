import {Guild} from 'discord.js';
import {GUILD_SETTINGS_LIFETIME} from '../Constants';
import GuildSettings from '../structures/GuildSettings';
import NucleusClient from './NucleusClient';

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
        'INSERT INTO public.guild_settings(id, prefixes) VALUES ($1, $2);',
        [BigInt(this.id), ['!']]
      );
      return new GuildSettings({prefixes: ['!']});
    } else {
      return new GuildSettings(res.rows[0]);
    }
  }
}
