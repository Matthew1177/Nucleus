import {Collection, Message, MessageEmbed} from 'discord.js';
import {COLORS} from '../Constants';
import InvalidArgumentsError from '../errors/InvalidArgumentsError';
import NucleusGuild from '../extensions/NucleusGuild';
import NucleusGuildMember from '../extensions/NucleusGuildMember';
import Command from '../structures/Command';
import Event from '../structures/Event';

export default class CommandHandler extends Event {
  name = 'message';
  commands = new Collection<string, Command>();

  async execute(message: Message) {
    if (!this.client.user) return;
    if (message.author.bot) return;
    const prefix = await this.getPrefix(message);
    if (prefix !== undefined) {
      const args = message.content.substring(prefix.length).split(' ');
      const command = this.getCommand(args[0]);

      if (!command) return;

      if (command.guild && message.channel.type !== 'dm') {
        // guild
        const member = message.member as NucleusGuildMember;
        if (await member.hasNucleusPermission(command.permissions)) {
          this.executeCommand(command, message, args);
        }
      } else if (command.dm && message.channel.type === 'dm') {
        // dm
        this.executeCommand(command, message, args);
      }
    }
  }

  registerCommand(command: Command) {
    if (this.commands.has(command.name)) throw new Error('Duplicate command');
    this.commands.set(command.name, command);
  }

  getCommand(name: string): Command | undefined {
    name = name.toLowerCase();
    if (this.commands.has(name)) return this.commands.get(name);

    return this.commands.find(cmd => cmd.aliases.includes(name));
  }

  private async getPrefix(message: Message): Promise<string | undefined> {
    if (message.content.startsWith(`<@${this.client.user!.id}>`))
      return `<@${this.client.user!.id}>`;
    if (message.content.startsWith(`<@!${this.client.user!.id}>`))
      return `<@!${this.client.user!.id}>`;

    if (message.channel.type === 'dm') {
      if (message.content.startsWith('!')) return '!';
    } else {
      const guild = message.guild! as NucleusGuild;
      const prefixes = (await guild.fetchSettings()).prefixes;
      for (const i in prefixes) {
        if (message.content.startsWith(prefixes[i])) return prefixes[i];
      }
    }
    return undefined;
  }

  private async executeCommand(
    command: Command,
    message: Message,
    args: string[]
  ) {
    try {
      await command.execute(message, args);
    } catch (e) {
      if (e instanceof InvalidArgumentsError) {
        message.channel.send(this.helpEmbed(command));
      } else console.error(e);
    }
  }

  helpEmbed(command: Command | undefined) {
    if (command)
      return new MessageEmbed()
        .setTitle(
          command.name[0].toUpperCase() + command.name.substring(1) + ' Command'
        )
        .setColor(COLORS.DARK_BUT_NOT_BLACK)
        .setDescription(
          `**Description**: ${command.description}\n**Usage:** ${command.usage}\n**Example:** ${command.example}`
        );
    else
      return new MessageEmbed()
        .setColor(COLORS.DARK_BUT_NOT_BLACK)
        .setTitle('Kernel - An advanced moderation bot')
        .setDescription('')
        .addField(
          'Resources',
          `**[Invite](https://google.com)**
          **[Commands](https://google.com)**
          **[Dashboard](https://google.com)**
          **[Premium](https://google.com)**`
        );
  }
}
