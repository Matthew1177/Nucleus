import dotenv from "dotenv";
import { NucleusClient } from "./lib/";
import { join } from "path";
import CommandHandler from "./handlers/CommandHandler";

dotenv.config();
const client = new NucleusClient();

client.extraData.commands = new CommandHandler(client,join(__dirname,"commands"));
client.loadEvents(join(__dirname,"events"));

client.login(process.env.TOKEN);