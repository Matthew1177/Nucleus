import NucleusClient from "../NucleusClient";
import { basename } from "path";

export default class Event {
    client: NucleusClient;
    name: string = basename(__filename).split('.').slice(0, -1).join('.');
    once: boolean = false;

    constructor (client: NucleusClient) {
        this.client = client
    }

    execute (...args: any[]) {
        
    }
}