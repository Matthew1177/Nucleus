import {
  InsertOneWriteOpResult,
  MongoClient,
  UpdateQuery,
  UpdateWriteOpResult,
} from 'mongodb';
import NucleusClient from '../extensions/NucleusClient';
import {Snowflake, Collection} from 'discord.js';

type GuildRecord = {
  id: string;
  prefix: string;
  permissions: Record<string, number>;
};

class CacheRecord<T> {
  data: T;
  creation: number;
  constructor(data: T) {
    this.data = data;
    this.creation = Date.now();
  }
}

type DatabaseOptions = {
  defaultGuildPrefix: string;
  databaseName: string;
};

export default class Database {
  client: NucleusClient;
  guildCache = new Collection<Snowflake, CacheRecord<GuildRecord>>();
  mongo: MongoClient | undefined;
  database: string;
  baseGuild = {prefix: '', permissions: {}};
  constructor(client: NucleusClient, uri: string, options: DatabaseOptions) {
    this.client = client;
    this.baseGuild.prefix = options.defaultGuildPrefix;
    this.database = options.databaseName;
    void (async () => {
      this.mongo = await new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }).connect();
    })();

    setInterval(() => this.sweepCache(600), 300 * 1000);
  }

  // Helper Functions
  async getGuild(id: Snowflake): Promise<Record<string, unknown> | null> {
    const cacheItem = this.guildCache.get(id);
    if (cacheItem) {
      return cacheItem.data;
    }
    const db = this.mongo!.db(this.database);
    const col = db.collection('guild_settings');

    const res = await col.findOne({id});
    if (res) {
      this.guildCache.set(id, new CacheRecord(res));
    }
    return res;
  }

  async insertGuild(
    obj: GuildRecord
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<InsertOneWriteOpResult<any>> {
    const db = this.mongo!.db(this.database);
    const col = db.collection('guild_settings');

    return await col.insertOne(obj);
  }

  async updateGuild(
    id: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    update: UpdateQuery<any> | Partial<any>
  ): Promise<UpdateWriteOpResult> {
    const db = this.mongo!.db(this.database);
    const col = db.collection('guild_settings');

    return await col.updateOne({id}, update);
  }

  async replaceGuild(
    obj: GuildRecord
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<InsertOneWriteOpResult<any>> {
    const db = this.mongo!.db(this.database);
    const col = db.collection('guild_settings');

    await col.deleteOne({id: obj.id});
    return await col.insertOne(obj);
  }

  private sweepCache(lifetime: number): void {
    if (lifetime <= 0) {
      return;
    }

    const lifetimeMs = lifetime * 1000;
    const now = Date.now();

    this.guildCache.sweep(c => now - c.creation > lifetimeMs);
  }
}
