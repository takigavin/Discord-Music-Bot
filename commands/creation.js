module.exports = {
	name: 'creation',
	description: 'Shows date the server was created',
	args: false,
	execute(message) {
		message.channel.send(`Server created on: ${message.guild.createdAt}`);
	},
};