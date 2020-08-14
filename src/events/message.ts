import Discord from 'discord.js';

module.exports = {
    'disabled': false,
    'once': false,
    'run': (client:Discord.Client,msg:Discord.Message) => {
        let args = msg.content.split(" ")
    }
}
