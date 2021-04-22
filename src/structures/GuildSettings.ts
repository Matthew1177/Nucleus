type DatabaseData = {
  prefixes: Array<string>;
};

export default class GuildSettings {
  prefixes: Array<string>;
  constructor(data: DatabaseData) {
    this.prefixes = data.prefixes ?? ['!'];
  }
}
