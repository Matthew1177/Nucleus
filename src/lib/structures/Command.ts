import NucleusClient from '../NucleusClient';
import NucleusMessage from '../extensions/NucleusMessage';

export default class Command {
    client: NucleusClient;
    name: string;
    aliases: string[] = [];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor (client: NucleusClient, name: string) {
        this.client = client;
        this.name = name;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    execute (message: NucleusMessage): void {
        throw new Error('Unsupported operation.');
    }
}