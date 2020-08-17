import { Structures, MessageOptions, StringResolvable, APIMessage, MessageAdditions, Message } from 'discord.js';

export default class NucleusMessage extends Structures.get('Message') {
    send(content: StringResolvable | APIMessage = '', 
        options: MessageOptions | MessageAdditions = {}): Promise<Message> {
        return this.channel.send(content, options);
    }
}

Structures.extend('Message', () => NucleusMessage);
