import Discord from 'discord.js';

module.exports = {
    'disabled': false,
    'once': false,
    'run': function (client:Discord.Client) {
        // @ts-ignore
        console.log(`Logged in as ${client.user.tag}`)
    }
}
