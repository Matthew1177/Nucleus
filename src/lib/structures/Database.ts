import NucleusClient from "../NucleusClient";
import { r, MasterPool } from 'rethinkdb-ts';

export default class Database {
    client: NucleusClient;
    connection = r;
    

    constructor (client: NucleusClient) {
        this.client = client;

        this.init().catch(e => console.error(e));
    }

    async init() {

    }
}