// TODO: RethinkDB
import { Client, ClientOptions } from 'discord.js'

export default class Cluster extends Client {
    // Constructor
    public constructor (options: ClientOptions | undefined) {
        super(options)
    }
}