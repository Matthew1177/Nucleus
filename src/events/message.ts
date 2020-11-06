import {Event, NucleusClient} from '../lib/';
import {Snowflake, Collection, MessageEmbed, Message} from 'discord.js';
import CommandHandler from '../handlers/CommandHandler';

export default class extends Event {
  cooldowns: Collection<string, Collection<Snowflake, number>>;
  constructor(client: NucleusClient, name: string) {
    super(client, name);
    const arr = (this.client.extraData.commands as CommandHandler).array();
    this.cooldowns = new Collection();
    arr.forEach(x => {
      this.cooldowns.set(x.name, new Collection());
    });

    setInterval(
      this.sweepCooldowns,
      Number(process.env.COOLDOWN_SWEEP_INTERVAL),
      [Number(process.env.COOLDOWN_LIFETIME)]
    );
  }

  execute(message: Message): void {
    if (!this.client.database) return;
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

    for (const command in this.cooldowns) {
      this.cooldowns.get(command)!.sweep(c => now - c > lifetimeMs);
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

  private splitMessage(content: string, prefixes: string[]): string[] {
    let toSplit = '';
    for (const prefix of prefixes) {
      if (content.startsWith(prefix)) {
        toSplit = content.slice(prefix.length);
        break;
      }
    }
    const args = toSplit.split(' ');
    return args;
  }

  private async handleGuild(message: Message): Promise<void> {
    if (this.client.user === null) return;
    const now = Date.now();
    const commands = this.client.extraData.commands as CommandHandler;
    const guildRecord = await this.client.database.getGuild(message.guild!.id);
    // deal with missing attr
    if (!guildRecord) {
      // guild missing
      this.client.database.insertGuild({
        ...this.client.database.baseGuild,
        id: message.guild!.id,
      });
      return;
    } else if (!guildRecord.prefix) {
      // prefix missing
      this.client.database.updateGuild(message.guild!.id, {
        $set: {prefix: process.env.DEFAULT_PREFIX!},
      });
    } else if (!guildRecord.permissions) {
      // perms missing
      this.client.database.updateGuild(message.guild!.id, {
        $set: {permissions: {}},
      });
    }
    // rest of code
    const prefixes = [
      `<@${this.client.user!.id}> `,
      `<@!${this.client.user!.id}> `,
      guildRecord.prefix as string,
    ];

    const args = this.splitMessage(message.content, prefixes);
    const cmd = commands.getCommand(args.shift() ?? '');
    if (cmd) {
      if (!(await cmd.check(message))) {
        return;
      }
      const cmdCooldown = this.cooldowns.get(cmd.name);

      if (!cmdCooldown) this.cooldowns.set(cmd.name, new Collection());

      const cooldown = this.cooldowns.get(cmd.name)!.get(message.author.id);
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

  private async handleDM(message: Message): Promise<void> {
    if (this.client.user === null) return;
    const now = Date.now();
    const commands = this.client.extraData.commands as CommandHandler;
    const prefixes = [
      `<@${this.client.user!.id}> `,
      `<@!${this.client.user!.id}> `,
      process.env.DEFAULT_PREFIX!,
    ];

    const args = this.splitMessage(message.content, prefixes);
    const cmd = commands.getCommand(args.shift() ?? '');

    if (cmd) {
      if (!(await cmd.check(message))) {
        return;
      }
      const cmdCooldown = this.cooldowns.get(cmd.name);

      if (!cmdCooldown) this.cooldowns.set(cmd.name, new Collection());

      const cooldown = this.cooldowns.get(cmd.name)!.get(message.author.id);
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
