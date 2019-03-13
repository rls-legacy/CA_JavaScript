/*Global Packages*/
const Discord = require('discord.js');
const client = new Discord.Client();

/*Local Variables*/
let commandFile;

/*Local Functions*/
//Run File
function RunCommandFile(file, object, intent) {

	commandFile = require(file);
	commandFile.run(client, object, intent);

}

//Client: login
client.login(process.env.SECRET);

//Client: ready
client.on('ready', () => {

	//Console
	console.log('Bot started...');
	console.log(`Logged in as ${client.user.tag}.`);

	//Client: setStatus & setActivity
	client.user.setStatus('dnd').catch(console.error);
	client.user.setActivity(' the RLS-Legacy', { type: 'WATCHING' }).catch(console.error);
	client.owner = process.env.OWNER

});

//Client: joined a server
client.on("guildCreate", guild => {

	//Console
	console.log("Joined a new guild: " + guild.name);

	//Export: to @/router/index.js
	RunCommandFile('./router/index.js', guild, "guildCreate")

});

//Client: left a server
client.on("guildDelete", guild => {

	//Console
	console.log("Left a guild: " + guild.name);

	//Export: to @/router/index.js
	RunCommandFile('./router/index.js', guild, "guildDelete")

});

//Client: received a message
client.on("message", message => {

	if (message.content.startsWith("captn ping")) {
		RunCommandFile('./store/modules/system/ping.js', message)
	} else if (message.author.bot){
		//Export: to @/router/index.js
		RunCommandFile('./router/index.js', message, "bot-message")
	} else {
		//Export: to @/router/index.js
		RunCommandFile('./router/index.js', message, "message")
	}

});
