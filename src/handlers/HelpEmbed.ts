import {MessageEmbed} from 'discord.js';
import {NucleusClient} from '../lib';
import CommandHandler from './CommandHandler';

export default class HelpEmbed extends MessageEmbed {
  client: NucleusClient;
  constructor(client: NucleusClient, name?: string) {
    super();
    this.client = client;
    if (name && name.toLowerCase().trim() !== 'help') {
      const commands = <CommandHandler>this.client.extraData.commands;
      const command = commands.getCommand(name);
      if (command) {
        this.setColor(0x23272a);
        this.setTitle(
          command.name.charAt(0).toUpperCase() + command.name.slice(1)
        );
        if (command.description && command.description.trim()) {
          this.setDescription(command.description);
        } else {
          this.setDescription('No description specified.');
        }
      }
    } else {
      this.setDescription(
        `**Dashboard:** (planned)
        **Commands:** (link)
        **Donate:** (link)`
      ).setColor(0x23272a);
    }
  }
}
