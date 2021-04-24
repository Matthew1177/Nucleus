type DatabaseData = {
  prefixes: Array<string>;
  mod_log_channel: BigInt | undefined;
};

export default class GuildSettings {
  prefixes: Array<string>;
  modLogChannel: string | undefined;
  constructor(data: DatabaseData) {
    this.prefixes = data.prefixes ?? ['!'];
    this.modLogChannel = data.mod_log_channel
      ? String(data.mod_log_channel)
      : undefined;
  }
}
