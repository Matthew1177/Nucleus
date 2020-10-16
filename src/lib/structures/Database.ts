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

export default class Database {
  client: NucleusClient;
  guildCache = new Collection<Snowflake, CacheRecord<GuildRecord>>();
  mongo: MongoClient | undefined;

  static BASEGUILD = {prefix: process.env.DEFAULT_PREFIX!, permissions: {}};
  constructor(client: NucleusClient) {
    this.client = client;

    void (async () => {
      if (process.env.URI === undefined)
        throw Error('process.env.URI is undefined');
      this.mongo = await new MongoClient(process.env.URI, {
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
    const db = this.mongo!.db(process.env.DATABASE);
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
    const db = this.mongo!.db(process.env.DATABASE);
    const col = db.collection('guild_settings');

    return await col.insertOne(obj);
  }

  async updateGuild(
    id: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    update: UpdateQuery<any> | Partial<any>
  ): Promise<UpdateWriteOpResult> {
    const db = this.mongo!.db(process.env.DATABASE);
    const col = db.collection('guild_settings');

    return await col.updateOne({id}, update);
  }

  async replaceGuild(
    obj: GuildRecord
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<InsertOneWriteOpResult<any>> {
    const db = this.mongo!.db(process.env.DATABASE);
    const col = db.collection('guild_settings');

    await col.deleteOne({id: obj.id});
    return await col.insertOne(obj);
  }

  async resetGuild(
    // @ts-ignore
    id: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<InsertOneWriteOpResult<any>> {
    const guild = await this.getGuild(id);
    // @ts-ignore
    const base = this.constructor.BASEGUILD;
    base.id = id;
    if (!guild) {
      return await this.insertGuild(base);
    } else {
      return await this.replaceGuild(base);
    }
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
