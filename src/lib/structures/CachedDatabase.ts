import { Collection, Snowflake } from 'discord.js'
import Database from './Database'
import NucleusClient from '../extensions/NucleusClient'

export default class CachedDatabase {
    database: Database;

    client: NucleusClient;

    private guildCache = new Collection()

    constructor (client: NucleusClient) {
      this.client = client
      this.database = new Database(client)
    }

    async getGuildSettings (id: Snowflake): Promise<any> {
      const res = await this.database.getOne('guild', { id })
      this.guildCache.set(id, res)
      return res
    }
}
