import { Message } from 'discord.js';

module.exports = {
    name: 'ping',
    callback: (msg: Message, args: Array<string>) => {
        msg.channel.send('pong!');
    },
};
