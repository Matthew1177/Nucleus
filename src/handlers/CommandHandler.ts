import { Command, NucleusClient } from "../lib";
import { Collection } from "discord.js";
import { readdir } from "fs";

export default class CommandHandler extends Collection<string, Command> {
    client: NucleusClient;

    constructor (client: NucleusClient, dir: string) {
        super();

        this.client = client;
        
        readdir(dir, (err,files) => {
            if (err) return console.error(err);
            
        });
    }
}