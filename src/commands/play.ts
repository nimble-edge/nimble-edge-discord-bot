import ytdl from 'ytdl-core';
import { search } from 'yt-search';
import { Message, VoiceConnection } from 'discord.js';
import { queue, volume } from '../index';

module.exports = {
    name: 'play',
    callback: async (msg: Message, args: Array<string>) => {
        const voiceChannel = msg.member?.voice.channel;

        if (!voiceChannel) return msg.channel.send('Voice channel ah i awm angai! Mimawl!');

        if (!args[0] && !queue.length) return msg.channel.send("Link chuuu! Mimawl!");
        else if (args[0]) {
            if (!ytdl.validateURL(args[0])) {
                const song: { title: string, url: string } = await new Promise((resolve, _rej) => {
                    search(args.join(' '), (err, res) => {
                        if (err) {
                            return msg.channel.send("🛑 Youtube link a nilo tlat mai! Ti tha leh rawh!");
                        }

                        resolve({
                            title: res.all[0].title,
                            url: res.all[0].url,
                        });
                    });
                });
                queue.push(song);
            } else {
                const songInfo = (await ytdl.getInfo(args[0])).videoDetails;
                queue.push({
                    title: songInfo.title,
                    url: args[0],
                });
            }

            if (queue.length > 1) msg.channel.send(`👍 **Added to queue:** ${queue[queue.length - 1].title}`);
        }

        if (!msg.member?.voice.connection) {
            msg.member?.voice.channel?.join().then(connection => {
                if (!queue[0].dispatcher) {
                    playYt(connection, msg);
                }
            });
        }
    },
};

function playYt(connection: VoiceConnection, msg: Message) {
    if (queue.length) {
        const song = queue[0];
        song.dispatcher = connection.play(ytdl(song.url, { filter: 'audioonly', }));

        song.dispatcher.setVolume(volume);

        msg.channel.send(`🎶 **Now Playing:** ${song.title}`);

        song.dispatcher.on("finish", () => {
            // Remove item from queue
            queue.shift();

            // Play the next
            playYt(connection, msg);
        });
    } else {
        msg.channel.send("Queue ah hla a awmlo!");
    }
}
