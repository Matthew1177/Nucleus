import { Event, NucleusClient } from '../lib/'
import CommandHandler from '../handlers/CommandHandler'
import { Snowflake, Collection, MessageEmbed, Message } from 'discord.js'

const cooldowns: Collection<string, Collection<Snowflake, number>> = new Collection()

function sweepCooldowns (lifetime: number): void {
  if (lifetime <= 0) {
    return
  }

  const lifetimeMs = lifetime * 1000
  const now = Date.now()

  for (const command in cooldowns) {
        cooldowns.get(command)!.sweep(
          c => now - c > lifetimeMs
        )
  }
}

export default class extends Event {
  constructor (client: NucleusClient, name: string) {
    super(client, name)

    const arr = (this.client.extraData.commands as CommandHandler).array()
    arr.forEach(x => {
      cooldowns.set(x.name, new Collection())
    })
  }

  execute (message: Message): void {
    if (message.partial || message.author.bot) return

    if (message.channel.type === 'dm') this.handleDM(message); else this.handleGuild(message)
  }

  private handleGuild (message: Message): void {
    // Get Guild Record
    this.client.database.getOne('guild_settings', { id: message.guild!.id })
      .then(record => {
        if (record === null || record === undefined) {
          // TODO, call create guild_settings and continue
          record = { id: message.guild!.id, prefix: process.env.DEFAULT_PREFIX }
          this.client.database.insertOne('guild_settings', record)
        }
        if (record.prefix === null || record.prefix === undefined) {
          this.client.database.updateOne('guild_settings', { id: message.guild!.id }, { $set: { prefix: process.env.DEFAULT_PREFIX! } })
          record.prefix = process.env.DEFAULT_PREFIX!
        }
        const now = Date.now()
        const commands = this.client.extraData.commands as CommandHandler
        const prefixes = [
                    `<@${this.client.user!.id}> `,
                    `<@!${this.client.user!.id}> `,
                    record.prefix
        ]

        let toSplit = ''
        for (const prefix of prefixes) {
          if (message.content.startsWith(prefix)) {
            toSplit = message.content.slice(prefix.length)
          }
        }
        if (toSplit === '') return
        const args = toSplit.split(' ')
        const cmd = commands.getCommand(args.shift()!)

        if (cmd) {
          const cmdCooldown = cooldowns.get(cmd.name)

          if (!cmdCooldown) cooldowns.set(cmd.name, new Collection())

          const cooldown = cooldowns.get(cmd.name)!.get(message.author.id)
          if (cooldown) {
            if (now < cooldown) {
              const embed = new MessageEmbed()
                .setColor(0x36393F)
                .setTitle('Cooldown')
                .setDescription(`Please wait \`${
                                    Math.round(((cooldown - now) / 1000 - 0.5))
                                        ? Math.round(((cooldown - now) / 1000 - 0.5))
                                        : Math.round((cooldown - now) / 100 - 0.5) / 10}\` second${
                                    (Math.round(((cooldown - now) / 1000 - 0.5))
                                        ? Math.round(((cooldown - now) / 1000 - 0.5))
                                        : Math.round((cooldown - now) / 100 - 0.5) / 10
                                    ) === 1 ? '' : 's'} before running this command again.`)

              message.channel.send(embed)
              return
            }
          }
            cmdCooldown!.set(message.author.id, now + cmd.cooldown * 1000)
            try {
              cmd.execute(message, args)
            } catch (error) {
              console.error(error)
              message.channel.send('An error occured while trying to execute that command.')
            }
        }
      })
      .catch(err => console.error(err))
  }

  private handleDM (message: Message): void {
    const now = Date.now()
    const commands = this.client.extraData.commands as CommandHandler
    const prefixes = [
            `<@${this.client.user!.id}> `,
            `<@!${this.client.user!.id}> `,
            process.env.DEFAULT_PREFIX!
    ]

    let toSplit = ''
    for (const prefix of prefixes) {
      if (message.content.startsWith(prefix)) {
        toSplit = message.content.slice(prefix.length)
      }
    }
    if (toSplit === '') return
    const args = toSplit.split(' ')
    const cmd = commands.getCommand(args.shift()!)

    if (cmd) {
      const cmdCooldown = cooldowns.get(cmd.name)

      if (!cmdCooldown) cooldowns.set(cmd.name, new Collection())

      const cooldown = cooldowns.get(cmd.name)!.get(message.author.id)
      if (cooldown) {
        if (now < cooldown) {
          const embed = new MessageEmbed()
            .setColor(0x36393F)
            .setTitle('Cooldown')
            .setDescription(`Please wait \`${
                            Math.round(((cooldown - now) / 1000 - 0.5))
                                ? Math.round(((cooldown - now) / 1000 - 0.5))
                                : Math.round((cooldown - now) / 100 - 0.5) / 10}\` second${
                            (Math.round(((cooldown - now) / 1000 - 0.5))
                                ? Math.round(((cooldown - now) / 1000 - 0.5))
                                : Math.round((cooldown - now) / 100 - 0.5) / 10
                            ) === 1 ? '' : 's'} before running this command again.`)

          message.channel.send(embed)
          return
        }
      }
            cmdCooldown!.set(message.author.id, now + cmd.cooldown * 1000)
            try {
              cmd.execute(message, args)
            } catch (error) {
              console.error(error)
              message.channel.send('An error occured while trying to execute that command.')
            }
    }
  }
}

setInterval(sweepCooldowns, Number(process.env.COOLDOWN_SWEEP_INTERVAL), [Number(process.env.COOLDOWN_LIFETIME)])
