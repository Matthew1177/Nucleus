import { Command, NucleusClient } from "../lib";
import { Collection } from "discord.js";
import { readdir } from "fs";
import { basename, join } from "path";

export default class CommandHandler extends Collection<string, Command> {
    client: NucleusClient;

    constructor (client: NucleusClient, dir: string) {
        super();

        this.client = client;
        
        readdir(dir, (err,files) => {
            if (err) return console.error(err);

            files.forEach(file => {
                const name = basename(file).split(".").slice(0, -1).join(".");
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const Command = ((r) => r.default || r)(require(`${join(dir,file)}`));
                const command = new Command(client, name);

                this.set(name, command);
            });
        });
    }
}