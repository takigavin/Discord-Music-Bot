const ytdl = require('ytdl-core-discord');
const Discord = require('discord.js');

let queue = [];
let playing = false;

module.exports = {
	name: 'play',
	description: 'plays a link',
	args: true,
	async execute(message, args) {
            if(message.member.voice.channel) {
                const songInfo = await ytdl.getInfo(args[0]);
                const song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    thumbnail: songInfo.videoDetails.thumbnail.thumbnails[3].url,
                    publisher: songInfo.videoDetails.ownerChannelName,
                    publisherURL: songInfo.videoDetails.ownerProfileUrl
                };

                if(!playing){
                    try{
                        queue.push(song);
                        const connection = await message.member.voice.channel.join();
                        play(connection, message, queue[0]);
                        playing = true;
                    } catch (err) {
                        console.log(err);
                        queue.shift();
                        playing = false;
                        return message.channel.send(err);
                    }
                }
                else {
                    queue.push(song);
                    const positionInQueue = queue.length - 1;
                    const songQueuedEmbed = new Discord.MessageEmbed()
                    .setColor('GREEN')
                    .setDescription( `:white_check_mark: ${message.author} added [${song.title}](${song.url}) to the queue.\n
                                      :page_facing_up: Position in queue: ***${positionInQueue}***`)
                    return message.channel.send(songQueuedEmbed);
                }

                
            }
            else{
                message.channel.send('You must be in a voice channel to use this command!');
            }
	},
};

async function play(connection, message, song) {
    const dispatcher = connection.play(await ytdl(song.url), { type: 'opus' });

    const songEmbed = new Discord.MessageEmbed()
        .setColor('PURPLE')
        .addFields(
                { name: 'Title:', value: `[${song.title}](${song.url})`},
                { name: 'Published By:', value: `[${song.publisher}](${song.publisherURL})`, inline: true},    
        )
        .setThumbnail(`${song.thumbnail}`)
        .addField('Queued By:', `${message.author}`, true)

    dispatcher.on('start', () => {
        message.channel.send(`Now playing: **${song.title}**`);
        message.channel.send(songEmbed);
    });
        
    
    dispatcher.on('finish', () => {
        queue.shift();
        if(queue.length > 0){
            play(connection, message, queue[0])
        }
        else{
            const leavingEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Queue empty, leaving ***${connection.channel}***...`);
            message.channel.send(leavingEmbed);
            playing = false;
            connection.disconnect();
        }
    });
    
    // Always remember to handle errors appropriately!
    dispatcher.on('error', console.error);
}