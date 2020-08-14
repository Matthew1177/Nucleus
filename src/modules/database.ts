import { Snowflake } from 'discord.js';
import { Connection, Cursor } from 'rethinkdb';

class Database {
    ///// ----- Variables ----- /////
    private r : any = require('rethinkdb');
    private conn : any = null;

    ///// ----- Constructor ----- /////
    constructor () {
        this.r.connect({db: 'discord'}, (err: Error, conn: Connection) => {
            if (err) throw err;
            this.conn = conn;
        })
    }   

    ///// ----- Guilds Table ----- /////
    getGuild (guildId: Snowflake) {
        this.r
            .table('guild')
            .filter({id: guildId}) // Primary Key, 1 or 0 items in array
            .run(this.conn)
                .then((cursor: Cursor) => {
                    cursor.toArray((err, result) => {
                        if (err) throw err;
                        return result[0];
                    });
                }).catch((err: Error) => {
                    throw err;
                })
    }
}

export default new Database();
