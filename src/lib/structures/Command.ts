import NucleusClient from "../extensions/NucleusClient";
import { Message } from "discord.js";

export default class Command {
    client: NucleusClient;
    name: string;
    aliases: string[] = [];
    cooldown = 3;
    description: string | null = null;
    usage: string | null = null;

    constructor (client: NucleusClient, name: string) {
        this.client = client;
        this.name = name;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    execute (message: Message, args: string[]): void {
        throw new Error("Unsupported operation.");
    }
}