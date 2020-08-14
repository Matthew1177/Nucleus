// .env
import dotenv from 'dotenv';
dotenv.config();
// Filesystem
import fs from 'fs';
// DiscordJS
import Discord from 'discord.js';
const client = new Discord.Client();
Discord.Constants.Events

// Load Event Handlers
fs.readdir('./dist/events/', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file =>{
        const event = require(`./events/${file}`);
        if (event.disabled) return;

        const eventName = file.split('.')[0];
        
        if (eventName) {
            try {
                // @ts-ignore If it isn't a valid event type error and skip
                client[event.once ? 'once' : 'on'](eventName, (...args) => event.run(client,...args)); 
            } catch (error) {
                return;
            }
        }
    }) 
})

client.login(process.env.TOKEN);