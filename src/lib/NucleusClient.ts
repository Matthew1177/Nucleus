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
                const event = require(`${join(dir,file)}`);

                const eventName = file.split('.')[0];

                if (eventName) {
                    try {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore 
                        this[event.once ? 'once' : 'on'](eventName, (...args: unknown[]) => event.execute(this,...args));
                    } catch (err) {
                        console.error(err);
                    }
                }
            });
        });
    }
}
