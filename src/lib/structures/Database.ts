import {MongoClient} from 'mongodb';
import NucleusClient from '../extensions/NucleusClient';
import {Snowflake, Collection} from 'discord.js';

class CacheRecord {
  data: Record<string, unknown>;
  creation: number;
  constructor(data: Record<string, unknown>) {
    this.data = data;
    this.creation = Date.now();
  }
}

export default class Database {
  client: NucleusClient;
  guildCache = new Collection<Snowflake, CacheRecord>();
  mongo: MongoClient | undefined;

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

  async insertGuild(obj: Record<string, unknown>): Promise<void> {
    const db = this.mongo!.db(process.env.DATABASE);
    const col = db.collection('guild_settings');

    await col.insertOne(obj);
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
