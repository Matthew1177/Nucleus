import { Client, ClientOptions } from "discord.js";
import { readdir } from "fs";
import { join, basename } from "path";

export default class NucleusClient extends Client {
    // Constructor
    public constructor (options?: ClientOptions) {
        super(options);
    }

    public loadEvents (dir: string): void {
        readdir(dir, (err,files) => {
            if (err) return console.error(err);
            let total = 0;
            console.log(`Loading Events from '${dir}'`);
            files.forEach(file => {
                const name = basename(file).split(".").slice(0, -1).join(".");
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const Event = ((r) => r.default || r)(require(`${join(dir,file)}`));
                const event = new Event(this, name);

                this[event.once ? "once" : "on"](event.name, (...args: unknown[]) => event.execute(...args));
                console.log(`Loaded Event '${event.name}'`);
                ++total;
            });
            console.log(`Loaded ${total} Events`);
        });
    }
}