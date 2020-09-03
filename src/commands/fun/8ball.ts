import {Command} from '../../lib';
import {MessageEmbed, Message} from 'discord.js';
const responses = [
  'It is certain.',
  'It is decidedly so.',
  'Without a doubt.',
  'Yes – definitely.',
  'You may rely on it.',
  'As I see it, yes.',
  'Most likely.',
  'Outlook good.',
  'Yes.',
  'Signs point to yes.',
  'Reply hazy, try again.',
  'Ask again later.',
  'Better not tell you now.',
  'Cannot predict now.',
  'Concentrate and ask again.',
  "Don't count on it.",
  'My reply is no.',
  'My sources say no.',
  'Outlook not so good.',
  'Very doubtful.',
];

export default class extends Command {
  description = '';
  cooldown = 3;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  execute(message: Message, args: Array<string>): void {
    const rand = Math.floor(Math.random() * responses.length);
    const embed = new MessageEmbed()
      .setColor(rand < 10 ? 0x5cb85c : rand < 15 ? 0xf0ad4e : 0xd9534f)
      .setDescription(`${responses[rand]}`)
      .setAuthor(
        'Magic 8 Ball',
        'https://github.com/twitter/twemoji/blob/master/assets/72x72/1f3b1.png?raw=true'
      );

    message.channel.send(embed);
  }
}
