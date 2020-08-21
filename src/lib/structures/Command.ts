import NucleusClient from "../extensions/NucleusClient";
import NucleusMessage from "../extensions/NucleusMessage";

export default class Command {
    client: NucleusClient;
    name: string;
    aliases: string[] = [];
    cooldown = 3;

    constructor (client: NucleusClient, name: string) {
        this.client = client;
        this.name = name;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    execute (message: NucleusMessage, args: string[]): void {
        throw new Error("Unsupported operation.");
    }
}