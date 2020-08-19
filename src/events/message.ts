import { NucleusMessage, Event } from '../lib/';
import { Message } from 'discord.js';

export default class extends Event {
    execute (message: NucleusMessage): void {
        if (message.content.startsWith('echo ')) {
            message.delete();

            message.send('Loading...').then((message1: Message) => {
                const message2: NucleusMessage = <NucleusMessage> message1;
                message2.edit(`$: ${message.content.slice(5)}`);
            });
        }
        
        /*
        if (message.channel.type == 'dm') {
            this.handleDM(message);
        }
        */
    }

    private handleDM (message: NucleusMessage): void {
        const prefixes = [
            `<@${this.client.user!.id}> `,
            `<@!${this.client.user!.id}> `,
            process.env.DEFAULT_PREFIX!
        ];
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private handleGuild (message: NucleusMessage): void {
        if (!process.env.DEFAULT_PREFIX) throw Error('process.env.DEFAULT_PREFIX is undefined.');
    }
} 