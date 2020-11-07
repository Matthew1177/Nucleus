import {Command, NucleusGuildMember} from '../../lib';
import {Message} from 'discord.js';
import HelpEmbed from '../../handlers/HelpEmbed';

export default class extends Command {
  cooldown = 1;

  async check(msg: Message): Promise<boolean> {
    if (msg.channel.type !== 'dm') {
      const mem = msg.member as NucleusGuildMember;
      if (msg.member) {
        const perms = await mem.fetchPermissions();
        if (perms.has('KICK_MEMBERS')) {
          return true;
        }
      }
    }
    return false;
  }
  async execute(message: Message, args: Array<string>): Promise<void> {
    if (!args[0]) {
      message.channel.send(new HelpEmbed(this.client, 'ban'));
    }
    const numb = args[0].match(/\d/g)?.join('');
    if (numb) {
      const user = message.guild!.members.cache.get(numb);
      if (user) {
        if (
          (message.member!.roles.highest.comparePositionTo(user.roles.highest) >
            0 ||
            message.member!.guild.owner === message.member!) &&
          user.guild.owner !== user
        )
          if (user.kickable)
            user
              .kick(
                `Responsible user: @${message.author.tag} (${message.author.id})`
              )
              .then(() => {
                message.channel.send(
                  `'Kicked @${user.user.tag} (\`${user.user.id}\`)`
                );
              });
          else
            message.channel.send(
              "I am unable to kick that user, please move my role higher than that user's highest role."
            );
      }
    }
  }
}
