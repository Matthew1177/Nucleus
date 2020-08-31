import { Structures } from "discord.js";

export default class NucleusMessage extends Structures.get("Message") {}

Structures.extend("Message", () => NucleusMessage);
