import {Event, NucleusClient} from '../lib/';
import CommandHandler from '../handlers/CommandHandler';
import {Snowflake, Collection, MessageEmbed, Message} from 'discord.js';

const cooldowns: Collection<
  string,
  Collection<Snowflake, number>
> = new Collection();

export default class extends Event {
  mentions: string[];
  constructor(client: NucleusClient, name: string) {
    super(client, name);
    this.mentions = [
      `<@${this.client.user!.id}> `,
      `<@!${this.client.user!.id}> `,
    ];
    const arr = (this.client.extraData.commands as CommandHandler).array();
    arr.forEach(x => {
      cooldowns.set(x.name, new Collection());
    });

    setInterval(
      this.sweepCooldowns,
      Number(process.env.COOLDOWN_SWEEP_INTERVAL),
      [Number(process.env.COOLDOWN_LIFETIME)]
    );
  }

  execute(message: Message): void {
    if (message.partial || message.author.bot) return;

    if (message.channel.type === 'dm') this.handleDM(message);
    else this.handleGuild(message);
  }

  sweepCooldowns(lifetime: number): void {
    if (lifetime <= 0) {
      return;
    }

    const lifetimeMs = lifetime * 1000;
    const now = Date.now();

    for (const command in cooldowns) {
      cooldowns.get(command)!.sweep(c => now - c > lifetimeMs);
    }
  }

  makeCooldownEmbed(then: number, now: number): MessageEmbed {
    return new MessageEmbed()
      .setColor(0x36393f)
      .setTitle('Cooldown')
      .setDescription(
        `Please wait \`${this.secondsUntil(
          then,
          now
        )}\` before running this command again.`
      );
  }

  secondsUntil(then: number, now: number): string {
    if (then - now === 0) return '`0` seconds';
    if (then - now > 1)
      return `\`${(Math.ceil((then - now) * 10) / 10).toString()}\` seconds`;
    if (Math.ceil((then - now) * 100) / 100 === 1) return '`1` second';
    return (Math.ceil((then - now) * 100) / 100).toString();
  }

  makeErrorEmbed(): MessageEmbed {
    return new MessageEmbed()
      .setColor(0xff0000)
      .setTitle('Error')
      .setDescription(
        'An error occurred while trying to execute that command.'
      );
  }

  private handleGuild(message: Message): void {
    if (this.client.user === null) return;
    const now = Date.now();
    const commands = this.client.extraData.commands as CommandHandler;
    this.client.database.getGuild(message.guild!.id).then(guildRecord => {
      if (guildRecord) {
        if (typeof guildRecord.prefix === 'string') {
          const prefixes = [...this.mentions, guildRecord.prefix];

          let toSplit = '';
          for (const prefix of prefixes) {
            if (message.content.startsWith(prefix!)) {
              toSplit = message.content.slice(prefix!.length);
            }
          }
          if (toSplit === '') return;
          const args = toSplit.split(' ');
          const cmd = commands.getCommand(args.shift() ?? '');
          if (cmd) {
            if (!cmd.guild) return;
            const cmdCooldown = cooldowns.get(cmd.name);

            if (!cmdCooldown) cooldowns.set(cmd.name, new Collection());

            const cooldown = cooldowns.get(cmd.name)!.get(message.author.id);
            if (cooldown) {
              if (now < cooldown) {
                const embed = this.makeCooldownEmbed(cooldown, now);
                message.channel.send(embed);
                return;
              }
            }
            cmdCooldown!.set(message.author.id, now + cmd.cooldown * 1000);
            try {
              cmd.execute(message, args);
            } catch (error) {
              console.error(error);
              message.channel.send(this.makeErrorEmbed());
            }
          }
        }
      }
    });
  }

  private handleDM(message: Message): void {
    if (this.client.user === null) return;
    const now = Date.now();
    const commands = this.client.extraData.commands as CommandHandler;
    const prefixes = [...this.mentions, process.env.DEFAULT_PREFIX];

    let toSplit = '';
    for (const prefix of prefixes) {
      if (message.content.startsWith(prefix!)) {
        toSplit = message.content.slice(prefix!.length);
      }
    }
    if (toSplit === '') return;
    const args = toSplit.split(' ');
    const cmd = commands.getCommand(args.shift() ?? '');

    if (cmd) {
      if (!cmd.dm) return;
      const cmdCooldown = cooldowns.get(cmd.name);

      if (!cmdCooldown) cooldowns.set(cmd.name, new Collection());

      const cooldown = cooldowns.get(cmd.name)!.get(message.author.id);
      if (cooldown) {
        if (now < cooldown) {
          const embed = new MessageEmbed()
            .setColor(0x36393f)
            .setTitle('Cooldown')
            .setDescription(
              `Please wait \`${this.secondsUntil(
                cooldown,
                now
              )}\` before running this command again.`
            );

          message.channel.send(embed);
          return;
        }
      }
      cmdCooldown!.set(message.author.id, now + cmd.cooldown * 1000);
      try {
        cmd.execute(message, args);
      } catch (error) {
        console.error(error);
        message.channel.send(this.makeErrorEmbed());
      }
    }
  }
}
