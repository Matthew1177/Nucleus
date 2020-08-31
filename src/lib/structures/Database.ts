import { MongoClient, FilterQuery, InsertOneWriteOpResult, UpdateWriteOpResult, UpdateQuery } from "mongodb";
import NucleusClient from "../extensions/NucleusClient";

export default class Database {
    client: NucleusClient;
    mongo: MongoClient | undefined;
    constructor (client: NucleusClient) {
        this.client = client;

        (async () => {this.mongo = await new MongoClient(process.env.URI!, {useNewUrlParser: true, useUnifiedTopology: true}).connect();})();
    }

    // Helper Functions

    // Can be an value
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    async getOne(collection: string,filter: FilterQuery<unknown>): Promise<any> {
        const db = this.mongo!;
        const dbo = db.db(process.env.DATABASE);

        const tab = dbo.collection(collection);

        const val = tab.findOne(filter);
        return val;
    }

    // It can be any value, does not matter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    async insertOne(collection: string, obj: any): Promise<InsertOneWriteOpResult<any>> {
        const db = this.mongo!;
        const dbo = db.db(process.env.DATABASE);

        const tab = dbo.collection(collection);

        const ret = await tab.insertOne(obj);
        return ret;
    }

    // It can be any value, does not matter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    async updateOne(collection: string, filter: FilterQuery<unknown>, update: UpdateQuery<any> | Partial<any>): Promise<UpdateWriteOpResult> {
        const db = this.mongo!;
        const dbo = db.db(process.env.DATABASE);

        const tab = dbo.collection(collection);

        const ret = await tab.updateOne(filter,update);
        return ret;
    }
}