import {
  MongoClient, FilterQuery, InsertOneWriteOpResult, UpdateWriteOpResult, UpdateQuery
} from 'mongodb'
import NucleusClient from '../extensions/NucleusClient'

export default class Database {
  client: NucleusClient;

  mongo: MongoClient | undefined;

  constructor (client: NucleusClient) {
    this.client = client;

    (async () => {
      this.mongo = await new MongoClient(process.env.URI!,
        { useNewUrlParser: true, useUnifiedTopology: true }).connect()
    })()
  }

  // Helper Functions

  async getOne (collection: string, filter: FilterQuery<unknown>): Promise<any> {
    const db = this.mongo!
    const dbo = db.db(process.env.DATABASE)

    const tab = dbo.collection(collection)

    const val = tab.findOne(filter)
    return val
  }

  async insertOne (collection: string, obj: any): Promise<InsertOneWriteOpResult<any>> {
    const db = this.mongo!
    const dbo = db.db(process.env.DATABASE)

    const tab = dbo.collection(collection)

    const ret = await tab.insertOne(obj)
    return ret
  }

  async updateOne (collection: string, filter: FilterQuery<any>,
    update: UpdateQuery<any> | Partial<any>): Promise<UpdateWriteOpResult> {
    const db = this.mongo!
    const dbo = db.db(process.env.DATABASE)

    const tab = dbo.collection(collection)

    const ret = await tab.updateOne(filter, update)
    return ret
  }
}
