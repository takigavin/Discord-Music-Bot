const ytdl = require('ytdl-core-discord');
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
                    url: songInfo.videoDetails.video_url
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
                    return message.channel.send(`${song.title} has been added to the queue!`);
                }

                
            }
            else{
                message.channel.send('You must be in a voice channel to use this command!');
            }
	},
};

async function play(connection, message, song) {
    const dispatcher = connection.play(await ytdl(song.url), { type: 'opus' });
    dispatcher.on('start', () => {
        message.channel.send(`Start playing: **${song.title}**`);
    });
        
    dispatcher.on('finish', () => {
        queue.shift();
        if(queue.length > 0){
            play(connection, message, queue[0])
        }
        else{
            message.channel.send('No more songs :((');
            playing = false;
            connection.disconnect();
        }
    });
    
    // Always remember to handle errors appropriately!
    dispatcher.on('error', console.error);
}