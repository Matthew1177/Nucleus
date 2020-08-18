import { Client, ClientOptions } from 'discord.js';
import { readdir } from 'fs';
import { join } from 'path';
export default class NucleusClient extends Client {
    // Constructor
    public constructor (options?: ClientOptions) {
        super(options);
    }

    public loadEvents (dir: string): void {
        readdir(dir, (err,files) => {
            if (err) return console.error(err);
            
            files.forEach(file => {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const Event = require(`${join(dir,file)}`);
                const event = new Event(this);

                if (event.name) {
                    try {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore 
                        this[event.once ? 'once' : 'on'](event.name, (...args: unknown[]) => event.execute(...args));
                    } catch (err) {
                        console.error(err);
                    }
                }
            });
        });
    }
}
