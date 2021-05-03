import {Collection, Message, MessageEmbed} from 'discord.js';
import {COLORS} from '../Constants';
import InvalidArgumentsError from '../errors/InvalidArgumentsError';
import NucleusClient from '../extensions/NucleusClient';
import NucleusGuild from '../extensions/NucleusGuild';
import NucleusGuildMember from '../extensions/NucleusGuildMember';
import Command from '../structures/Command';
import Event from '../structures/Event';

export default class CommandHandler extends Event {
  readonly name = 'message';
  commands = new Collection<string, Command>();

  constructor(client: NucleusClient) {
    super(client);
  }

  async execute(message: Message) {
    if (!this.client.user) return;
    if (message.author.bot) return;
    if (
      message.channel.type !== 'dm' &&
      !message.guild?.me
        ?.permissionsIn(message.channel)
        .has(['SEND_MESSAGES', 'VIEW_CHANNEL'])
    )
      return;
    const prefix = await this.getPrefix(message);
    if (prefix !== undefined) {
      const args = message.content.substring(prefix.length).split(' ');
      const command = this.getCommand(args[0]);

      if (!command) return;

      if (command.guild && message.channel.type !== 'dm') {
        // guild
        const member = message.member as NucleusGuildMember;
        if (await member.hasNucleusPermission(command.permissions)) {
          if (
            message
              .guild!.me!.permissionsIn(message.channel)
              .has(command.botPermissions)
          ) {
            if (
              !message
                .guild!.me!.permissionsIn(message.channel)
                .has('EMBED_LINKS')
            ) {
              message.channel.send(
                'Please grant me the `EMBED_LINKS` permission to execute commands.'
              );
            }
            this.executeCommand(command, message, args, prefix);
          } else {
            message.channel.send(
              'This command cannot be executed because permissions are missing. The required permissions are: `' +
                command.botPermissions
                  .toArray()
                  .toString()
                  .replace(',', '`, `') +
                '`.'
            );
          }
        }
      } else if (command.dm && message.channel.type === 'dm') {
        // dm
        this.executeCommand(command, message, args, prefix);
      }
    }
  }

  registerCommand(command: Command) {
    if (this.commands.has(command.name)) throw new Error('Duplicate command');
    this.commands.set(command.name, command);
    return this;
  }

  getCommand(name: string): Command | undefined {
    name = name.toLowerCase();
    if (this.commands.has(name)) return this.commands.get(name);

    return this.commands.find(cmd => cmd.aliases.includes(name));
  }

  private async getPrefix(message: Message): Promise<string | undefined> {
    if (message.content.startsWith(`<@${this.client.user!.id}> `))
      return `<@${this.client.user!.id}> `;
    if (message.content.startsWith(`<@!${this.client.user!.id}> `))
      return `<@!${this.client.user!.id}> `;

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
    args: string[],
    prefix: string
  ) {
    try {
      await command.execute(message, args);
    } catch (e) {
      if (e instanceof InvalidArgumentsError) {
        message.channel.send(this.helpEmbed(command, prefix));
      } else console.error(e);
    }
  }

  helpEmbed(command: Command | undefined, prefix: string) {
    if (command)
      return new MessageEmbed()
        .setTitle(
          command.name[0].toUpperCase() + command.name.substring(1) + ' Command'
        )
        .setColor(COLORS.DARK_BUT_NOT_BLACK)
        .setDescription(
          `**Description**: ${command.description}\n**Usage:** ${command.usage}\n**Example:** ${command.example}`.replace(
            /\{p\}/g,
            prefix
          )
        );
    else
      return new MessageEmbed()
        .setColor(COLORS.DARK_BUT_NOT_BLACK)
        .setTitle('Kernel - An advanced moderation bot')
        .setDescription('Private Beta');
    /*
        .addField(
          'Resources',
          `**[Invite](https://google.com)**
          **[Commands](https://google.com)**
          **[Dashboard](https://google.com)**
          **[Premium](https://google.com)**`
        );
        */
  }
}
