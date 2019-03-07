
let commandFile;
let path;

/*Local Functions*/
//Run File
function RunCommandFile(file, client, path, object, intent) {
	commandFile = require(file);
	commandFile.run(client, db, path, object, intent);
}

//Export: from server.js
exports.run = (client, object, intent) => {

	switch (intent) {
		//Export: to db_outguild.js
		case "guildCreate":
			path = db.collection('discord').doc('configuration').collection('discord_guilds').doc(object.id);
			RunCommandFile(`./../db_out/db_outguild.js`, client, path, object, intent);
			break;
		case "guildDelete":
			path = db.collection('discord').doc('configuration').collection('discord_guilds').doc(object.id);
			RunCommandFile(`./../db_out/db_outguild.js`, client, path, object, intent);
			break;
		//Export: to db_outmessage.js
		case "message":
			path = db.collection('discord').doc('configuration').collection('discord_users').doc(object.author.id);
			RunCommandFile(`./../db_out/db_outmessage.js`, client, path, object, intent);
			break;
		default:
			break;
	}

};
