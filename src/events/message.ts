import { NucleusMessage, Event } from '../lib/';
export default class extends Event {
    execute (message: NucleusMessage): void {
        if (message.channel.type == 'dm') {
            this.handleDM(message);
        }
    }

    private handleDM (message: NucleusMessage): void {
        if (message.content.startsWith(process.env.DEFAULT_PREFIX!)) {
            const sliced = message.content.slice(process.env.DEFAULT_PREFIX!.length);
            
            const split = sliced.split(' ');
        } else if (this.client.user) {
            if (message.content.startsWith(`<@${this.client.user.id}> `)) {
                const sliced = message.content.slice(`<@${this.client.user.id}> `.length);
            
                const split = sliced.split(' ');
            } else if (message.content.startsWith(`<@!${this.client.user.id}> `)) {
                const sliced = message.content.slice(`<@!${this.client.user.id}> `.length);
            
                const split = sliced.split(' ');
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private handleGuild (message: NucleusMessage): void {
        if (!process.env.DEFAULT_PREFIX) throw Error('process.env.DEFAULT_PREFIX is undefined.');
    }
} 