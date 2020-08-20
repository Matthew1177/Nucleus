import { NucleusMessage, Event, Command } from "../lib/";

export default class extends Event {
    execute (message: NucleusMessage): void {
        if (message.partial || message.author.bot) return;

        if (message.channel.type === "dm") this.handleDM(message);
    }

    private handleDM (message: NucleusMessage): void {
        const prefixes = [
            `<@${this.client.user!.id}> `,
            `<@!${this.client.user!.id}> `,
            process.env.DEFAULT_PREFIX!
        ];

        let toSplit = "";
        for (const prefix of prefixes) {
            if (message.content.startsWith(prefix)) {
                toSplit = message.content.slice(prefix.length);
            }
        }
        if (toSplit === "") return;
        const args = toSplit.split(" ");
        message.send(args);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private handleGuild (message: NucleusMessage): void {
        if (!process.env.DEFAULT_PREFIX) throw Error("process.env.DEFAULT_PREFIX is undefined.");
    }
} 