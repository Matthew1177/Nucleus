import { join } from "path";
import CommandHandler from "./handlers/CommandHandler";
import { NucleusClient } from "./lib";

const client = new NucleusClient();

client.extraData.commands = new CommandHandler(client,join(__dirname,"commands"));
client.loadEvents(join(__dirname,"events"));

client.login();