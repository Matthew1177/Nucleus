import { NucleusMessage, Event } from '../lib/';
export default class extends Event {
    execute (message: NucleusMessage): void {
        if (message.channel.type == 'dm') {
            this.handleDM(message);
        }
    }

    private handleDM (message: NucleusMessage): void {
        if (
            (
                process.env.DEFAULT_PREFIX &&
                message.content.startsWith(process.env.DEFAULT_PREFIX)) || 
            (this.client.user && 
                (
                    message.content.startsWith(`<@${this.client.user.id}> `) || 
                    message.content.startsWith(`<@!${this.client.user.id}> `)
                )
            )
        ) 
        {
            // TODO
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private handleGuild (message: NucleusMessage): void {
        if (!process.env.DEFAULT_PREFIX) throw Error('process.env.DEFAULT_PREFIX is undefined.');
    }
} 