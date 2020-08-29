import { MongoClient } from "mongodb";
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

    async has(table: string, key: string): Promise<boolean> {
        const db = await this.mongo.connect();
        const dbo = db.db(process.env.DATABASE);

        const tab = dbo.collection(table);

        const val = tab.findOne({id: key});
        return !!val;
    }
}