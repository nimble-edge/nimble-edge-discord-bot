import { Message } from 'discord.js';
import { queue } from '../index';
import { MessageEmbed } from 'discord.js';

module.exports = {
    name: 'queue',
    callback: (msg: Message, args: Array<string>) => {
        const queueList = queue.map(
            (item, index) => `**${(index + 1)}.** ${item.title} ${ (item.dispatcher && !item.dispatcher.paused) ? '** - (Playing)**' : '' }`
        );

        let embed = new MessageEmbed()
            .setColor('#FBAB81')
            .setTitle('Song Queue:')
            .setDescription('Showing first 25 songs.')

        if (queueList.length) {
            if (queueList.length > 25) {
                if (args.length) {
                    const [ command ] = args;

                    if (command === 'end') {
                        const last25 = queueList.slice(-25);
                        embed.addField('----', last25.join('\n'));
                        msg.channel.send(embed);
                    }
                } else {
                    const first25 = queueList.slice(0, 25);
                    const restOfSongs = queueList.length - 25;
                    embed.addField('----', first25.join('\n'))
                        .setFooter(`${restOfSongs} more songs..`);
                    msg.channel.send(embed);
                }
            } else {
                embed.setDescription('');
                embed.addField('----', queueList.join('\n'));
                msg.channel.send(embed);
            }
        } else {
            const embed = new MessageEmbed()
                .setColor('#FBAB81')
                .setDescription('🤷 Queue ah hla a awmlo!');
            msg.channel.send(embed);
        }
    },
};
