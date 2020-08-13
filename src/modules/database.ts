import Discord, { Snowflake, SystemChannelFlags } from 'discord.js' 
import { Connection, Cursor } from 'rethinkdb';

class Database {
    ///// ----- Vars ----- /////
    r : any = require('rethinkdb');
    conn : any = null

    ///// ----- Constructor ----- /////
    constructor () {
        this.r.connect({db: 'discord'}, (err: Error, conn: Connection) => {
            if (err) throw err;
            this.conn = conn
        })
    }   

    ///// ----- Guilds Table ----- /////
    getGuild (guildId: Snowflake) {
        this.r
            .table('guild')
            .filter({id: guildId})
            .run(this.conn)
                .then((cursor: Cursor) => {

                }).catch((err: Error) => {
                    throw err
                })
    }
}

export default new Database();
