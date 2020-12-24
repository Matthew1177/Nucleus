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
        if (perms.has('BAN_MEMBERS')) {
          return true;
        }
      }
    }
    return false;
  }
  async execute(message: Message, args: Array<string>): Promise<void> {
    if (!args[0]) {
      message.channel.send(new HelpEmbed(this.client, 'ban'));
      return;
    }
    const numbs = args[0].match(/\d/g);
    if (!numbs) {
      message.channel.send(new HelpEmbed(this.client, 'ban'));
      return;
    }
    const numb = numbs.join('');
    if (numb) {
      const user = message.guild!.members.cache.get(numb);
      if (user) {
        if (
          (message.member!.roles.highest.comparePositionTo(user.roles.highest) >
            0 ||
            message.member!.guild.owner === message.member!) &&
          user.guild.owner !== user
        )
          if (user.bannable)
            user
              .ban({
                reason: `Responsible user: @${message.author.tag} (${message.author.id})`,
              })
              .then(() => {
                message.channel.send(
                  `Banned @${user.user.tag} (\`${user.user.id}\`)`
                );
              });
          else
            message.channel.send(
              "I am unable to ban that user, please move my role higher than that user's highest role."
            );
      } else {
        message
          .guild!.members.ban(numb, {
            reason: `Responsible user: @${message.author.tag} (${message.author.id})`,
          })
          .then(() => {
            message.channel.send(`Banned \`${numb}\``);
          })
          .catch(() => {
            message.channel.send(`Unable to ban \`${numb}\`.`);
          });
      }
    }
  }
}
