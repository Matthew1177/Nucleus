import NucleusClient from '../NucleusClient';
import NucleusMessage from '../extensions/NucleusMessage';
import { basename } from 'path';

export default class Command {
    client: NucleusClient;
    name: string = basename(__filename).split('.').slice(0, -1).join('.');
    aliases: string[] = [];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor (client: NucleusClient, name: string) {
        this.client = client;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    execute (message: NucleusMessage): void {
        throw new Error('Unsupported operation.');
    }
}