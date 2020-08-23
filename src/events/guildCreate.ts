import { Event } from "../lib/";
import { Guild } from "discord.js";

export default class extends Event {
    execute (guild: Guild): void {
        this.client.database.get("guild", guild.id).then(resp => {
            if (resp) {
                console.log(resp);
            } else {
                this.client.database.insert("guild", 
                    {
                        id: guild.id, 
                        settings: 
                    {
                        prefix: process.env.DEFAULT_PREFIX
                    }
                    }).catch(err => console.error(err));
            }
        });
    }
} 