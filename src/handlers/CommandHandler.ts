import { Command, NucleusClient } from "../lib";
import { Collection } from "discord.js";
import { readdirSync } from "fs";
import { basename } from "path";

export default class CommandHandler extends Collection<string, Command> {
    modules: Collection<string,Collection<string,Command>> = new Collection();
    client: NucleusClient;

    constructor (client: NucleusClient, dir: string) {
        super();

        this.client = client;
        
        console.log(`Loading modules from '${dir}'`);

        let numMods = 0;
        let numCmds = 0;

        readdirSync(dir).forEach(mod => {
            const cmdsInMod = readdirSync(`${dir}/${mod}/`).filter(f => f.endsWith(".js"));
            const modName = basename(mod);

            this.modules.set(modName, new Collection());
            
            console.log(`Loading Module '${modName}'`);

            for (const file of cmdsInMod) {
                const name = basename(file).split(".").slice(0, -1).join(".");
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const req = ((r) => r.default || r)(require(`${dir}/${mod}/${file}`));
                const newReq = new req(client, name);

                this.set(name, newReq);
                this.modules.get(modName)!.set(name, newReq);

                console.log(`Loaded Command '${name}'`);
                ++numCmds;
            }
            ++numMods;
            console.log(`Loaded Module '${modName}'`);
        });

        console.log(`Loaded ${numMods} Module(s) and ${numCmds} Command(s)`);
    }

    getCommand (name: string): Command | null {
        if (this.has(name)) return this.get(name) as Command;

        const alias = this.find((cmd) => cmd.aliases.includes(name));
        return alias || null;
    }

    getModule (name: string): Collection<string,Command> | null {
        return this.modules.has(name) ? this.modules.get(name) as Collection<string,Command> : null;
    } 
}