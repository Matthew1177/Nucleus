import { Client, ClientOptions } from 'discord.js';

export default class NucleusClient extends Client {
    // Constructor
    public constructor (options: ClientOptions | undefined) {
        super(options);
    }
}
