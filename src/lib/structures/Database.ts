/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// Typing this file can cause issues

import NucleusClient from "../extensions/NucleusClient";
import { r, MasterPool } from "rethinkdb-ts";

export default class Database {
    client: NucleusClient;
    r = r;
    pool: MasterPool | null = null

    constructor (client: NucleusClient) {
        this.client = client;

        this.r.connectPool({db: "discord"})
            .then(pool => this.pool = pool)
            .catch(e => console.error(e));
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

    // eslint-disable-next-line @typescript-eslint/ban-types
    insert(table: string, value: object = {}) {
        return this.r
            .table(table)
            .insert(value)
            .run();
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    update(table: string, key: string, value: object = {}) {
        return this.r
            .table(table)
            .get(key)
            .update(value, { returnChanges: true })
            .run();
    }

    delete (table: string, key: string) {
        return this.r
            .table(table)
            .get(key)
            .delete()
            .run();
    }
}