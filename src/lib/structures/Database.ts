import {MongoClient} from 'mongodb';
import NucleusClient from '../extensions/NucleusClient';
import {Snowflake} from 'discord.js';

class CacheRecord {
  data: never;
  creation: number;
  constructor(data: never) {
    this.data = data;
    this.creation = Date.now();
  }
}

export default class Database {
  client: NucleusClient;

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
  }

  // Helper Functions

  async getGuild(id: Snowflake) {
    const db = this.mongo!.db(process.env.DATABASE);
    const col = db.collection('guild_settings');

    const res = await col.findOne({id});
    if (res) {
      //
    }
  }
}
