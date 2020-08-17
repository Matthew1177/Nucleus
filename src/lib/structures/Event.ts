import NucleusClient from '../NucleusClient';
import { basename } from 'path';

export default class Event {
    client: NucleusClient;
    name: string = basename(__filename).split('.').slice(0, -1).join('.');
    once = false;

    constructor (client: NucleusClient) {
        this.client = client;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    execute (...args: unknown[]) : void {
        throw new Error('Unsupported operation.');
    }
}