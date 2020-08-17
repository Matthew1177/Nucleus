/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// TODO: Switch to MongoDB API w/ AWS Document Store

import NucleusClient from '../NucleusClient';
import { r, MasterPool } from 'rethinkdb-ts';

export default class Database {
    client: NucleusClient;
    r = r;
    pool: MasterPool | null = null

    constructor (client: NucleusClient) {
        this.client = client;

        this.r.connectPool()
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