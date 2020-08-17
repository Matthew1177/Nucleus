import NucleusClient from "../NucleusClient";
import { r, MasterPool } from 'rethinkdb-ts';

export default class Database {
    client: NucleusClient;
    r = r;
    pool: MasterPool | null = null

    constructor (client: NucleusClient) {
        this.client = client;

        this.r.connectPool()
            .then(pool => this.pool = pool)
            .catch(e => console.error(e))
    }

    get(table: string, key?: string) {
        return key ? 
            this.r
                .table(table)
                .get(key)
                .run() :
            this.r
                .table(table)
                .run();
    }

    has(table: string, key: string) {
        return !!this.r
            .table(table)
            .get(key)
            .run();
    }

    insert(table: string, value: object = {}) {
        return this.r
            .table(table)
            .insert(value)
            .run();
    }

    
}