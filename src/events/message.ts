import { NucleusMessage, Event, NucleusClient } from "../lib/";
import CommandHandler from "../handlers/CommandHandler";
import { join } from "path";

export default class extends Event {
    commands: CommandHandler;

    constructor(client: NucleusClient, name: string) {
        super(client, name);
        this.commands = new CommandHandler(client, join(__dirname,"..","commands"));
    }

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
        const cmd = this.commands.getCommand(args.shift()!);

        if (cmd) {
            try {
                cmd.execute(message,args);
            } catch {
                message.channel.send("An error occured while trying to execute that command.");
            }
            
        } else return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private handleGuild (message: NucleusMessage): void {
        if (!process.env.DEFAULT_PREFIX) throw Error("process.env.DEFAULT_PREFIX is undefined.");
    }
} 