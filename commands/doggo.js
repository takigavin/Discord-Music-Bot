const fetch = require('node-fetch');

module.exports = {
	name: 'doggo',
	description: 'sends a random doggo',
	args: false,
	async execute(message) {
        let doggo;
        await fetch('https://api.thedogapi.com/v1/images/search')
            .then(response => response.json())
            .then((data) => { doggo = data[0].url; })
            .catch((err) => {
                message.channel.send("All doggos currently busy playing... :)");
            });
            
        message.channel.send(doggo);
	},
};
