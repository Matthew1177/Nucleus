import { Command } from '../../lib'
import { MessageEmbed, Message } from 'discord.js'
import CommandHandler from '../../handlers/CommandHandler'

export default class extends Command {
  cooldown = 3;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  execute (message: Message, args: Array<string>): void {
    message.channel.send(this.helpEmbed(args[0]))
  }

  helpEmbed (name?: string): MessageEmbed {
    if (name) {
      const commands = <CommandHandler> this.client.extraData.commands
      const command = commands.getCommand(name)
      if (command) {
        const embed = new MessageEmbed()
          .setColor(0x000000)
        embed.setTitle(command.name.charAt(0).toUpperCase() + command.name.slice(1))
        if (command.description && command.description.trim()) {
          embed.setDescription(command.description)
        } else {
          embed.setDescription('No description specified.')
        }
        return embed
      }
    }
    const embed = new MessageEmbed()
      .setDescription(
              `**Dashboard:** (link)
              **Commands:** (link)
              **Donate:** (link)`
      )
      .setColor(0x000000)
    return embed
  }
}
