import NucleusClient from "../NucleusClient";
import NucleusMessage from "../extensions/NucleusMessage";
const { basename } = require('path');

export default class Command {
    client: NucleusClient;
    name: string = basename(__filename).split('.').slice(0, -1).join('.');
    aliases: string[] = [];

    constructor (client: NucleusClient, name: string) {
        this.client = client;
    }

    execute (message: NucleusMessage) {

    }
}