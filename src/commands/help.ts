import { Message } from 'discord.js';
import { COMMANDS } from '../index';

module.exports = {
    name: 'help',
    callback: (msg: Message, _args: Array<string>) => {
        msg.channel.send(`**Commands**: ${COMMANDS.map(command => command.name).join(', ')}`);
    },
};
