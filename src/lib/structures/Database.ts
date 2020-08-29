import { MongoClient, FilterQuery, UpdateOneOptions } from "mongodb";
import NucleusClient from "../extensions/NucleusClient";

export default class Database {
    client: NucleusClient;
    mongo: MongoClient
    constructor (client: NucleusClient) {
        this.client = client;

        this.mongo = new MongoClient(process.env.URI!);
    }

    // Helper Functions
    async get(table: string,key?: string): Promise<unknown> {
        const db = await this.mongo.connect();
        const dbo = db.db(process.env.DATABASE);

        const tab = await dbo.collection(table);

        if (!key) return tab;
        const val = tab.findOne({id: key});
        return val;
    }

    // It can be any value, does not matter
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async insert(table: string, obj: any): Promise<void> {
        const db = await this.mongo.connect();
        const dbo = db.db(process.env.DATABASE);

        const tab = dbo.collection(table);

        await tab.insertOne(obj);
        return;
    }

    async update(table: string, filter: FilterQuery<unknown>, update: UpdateOneOptions): Promise<void> {
        const db = await this.mongo.connect();
        const dbo = db.db(process.env.DATABASE);

        const tab = dbo.collection(table);

        await tab.updateOne(filter,update);
        return;
    }
}