import { MongoClient, FilterQuery, UpdateOneOptions, InsertOneWriteOpResult, UpdateWriteOpResult } from "mongodb";
import NucleusClient from "../extensions/NucleusClient";

export default class Database {
    client: NucleusClient;
    mongo: MongoClient
    constructor (client: NucleusClient) {
        this.client = client;

        this.mongo = new MongoClient(process.env.URI!,{ useUnifiedTopology: true });
    }

    // Helper Functions
    async getOne(collection: string,filter: FilterQuery<unknown>): Promise<unknown> {
        const db = await this.mongo.connect();
        const dbo = db.db(process.env.DATABASE);

        const tab = dbo.collection(collection);

        const val = tab.findOne(filter);
        return val;
    }

    // It can be any value, does not matter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    async insertOne(collection: string, obj: any): Promise<InsertOneWriteOpResult<any>> {
        const db = await this.mongo.connect();
        const dbo = db.db(process.env.DATABASE);

        const tab = dbo.collection(collection);

        const ret = await tab.insertOne(obj);
        return ret;
    }

    async updateOne(collection: string, filter: FilterQuery<unknown>, update: UpdateOneOptions): Promise<UpdateWriteOpResult> {
        const db = await this.mongo.connect();
        const dbo = db.db(process.env.DATABASE);

        const tab = dbo.collection(collection);

        const ret = await tab.updateOne(filter,update);
        return ret;
    }
}