module.exports = {
	name: 'beep',
	description: 'Boop!',
	args: false,
	execute(message) {
		message.channel.send('Boop!');
	},
};