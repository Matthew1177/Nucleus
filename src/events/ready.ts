import Discord from 'discord.js';

module.exports = {
    'disabled': false,
    'once': true,
    'run': (client:Discord.Client) => {
        // @ts-ignore Cannot be null unless it isn't ready
        console.log(`Logged in as ${client.user.tag}`)
    }
}
