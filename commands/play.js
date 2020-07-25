const ytdl = require('ytdl-core-discord');

module.exports = {
	name: 'play',
	description: 'plays a link',
	args: true,
	async execute(message, args) {
            if(message.member.voice.channel) {
                const connection = await message.member.voice.channel.join();
                play(connection, `${args[0]}`);
            }
            else{
                message.channel.send('You must be in a voice channel to use this command!');
            }
	},
};

async function play(connection, url) {
        const dispatcher = connection.play(await ytdl(url), { type: 'opus' }, { highWaterMark: 25 });

        dispatcher.queue.shift();

        dispatcher.on('end', function () {
            if(queue[0]){
                play(connection, url)
            }
            else{
                connection.disconnect();
            }
        });
    
        // Always remember to handle errors appropriately!
        dispatcher.on('error', console.error);
}