const Discord = require("discord.js");
const _ = require('lodash');

/*Local Variables*/
let commandFile;

/*Local Functions*/
//Run File
function RunCommandFile(file, client, object, database, real_db) {
	commandFile = require(file);
	commandFile.run(client, object, database, real_db);
}

//Get Commands
function GetCommands(path) {
	return new Promise(function(resolve) {
		//Firebase: Get Command Document
		let getCommands = path.get()
			.then(doc => {
				if (doc.exists) {
					resolve(doc.data())
				}
			});
	});
}

function SetUsers(path, bot_id, guild_id, input, value) {
	//Firebase: Get Command Document
	let setuser = path.set(
		{
			"catcher": {
				[bot_id]: {
					"guilds": {
						[guild_id]: {[input]: value}
					}
				}
			}

		}, {
			merge: true
		});
}

function GetUsers(path) {
	return new Promise(function(resolve, reject) {
		//Firebase: Get Command Document
		try {
			let getUsers = path.get()
				.then(doc => {
					if (doc.exists) {
						resolve(doc.data())
					} else {
						resolve(0)
					}
				});
		} catch (e) {
			console.log(e);
			resolve(0)
		}

	});
}


//Export: from @/router/index.js
exports.run = (client, object, intent, database) => {
	switch (intent['sub_intent']) {
		case "message":
			let path = database.collection('configuration').doc('commands');
			let commands = GetCommands(path);
			commands.then(function (doc) {
				RunCommandFile(`./${intent['folder']}/${intent['file']}.js`, client, object, doc, database);
			});
			path = database.collection('guilds').doc(object.guild.id);
			let guild = GetCommands(path);
			guild.then(function (doc) {
				if (doc !== 0) {
					let sub = doc["Configuration"]["Points"]["messages"]["cooldown"];
					let m_points = GetUsers(database.collection('users').doc(object.author.id));

					m_points.then(function (value) {
						if (value !== 0) {
							if (value['catcher'][doc["Configuration"]["Points"]["bot_id"]]) {
								let time = value['catcher'][doc["Configuration"]["Points"]["bot_id"]]["guilds"][object.guild.id]['cooldown'];
								let messages = parseInt(value['catcher'][doc["Configuration"]["Points"]["bot_id"]]["guilds"][object.guild.id]['messages']) + 1;
								if ((parseInt(time) + parseInt(sub) <= object.createdTimestamp) || isNaN(parseInt(time)) || time === undefined) {
									SetUsers(database.collection('users').doc(object.author.id), doc["Configuration"]["Points"]["bot_id"], object.guild.id, "cooldown", object.createdTimestamp);
									SetUsers(database.collection('users').doc(object.author.id), doc["Configuration"]["Points"]["bot_id"], object.guild.id, "messages", messages)
								}
							} else {
								SetUsers(database.collection('users').doc(object.author.id), doc["Configuration"]["Points"]["bot_id"], object.guild.id, "cooldown", object.createdTimestamp);
								SetUsers(database.collection('users').doc(object.author.id), doc["Configuration"]["Points"]["bot_id"], object.guild.id, "messages", 0)
							}

						} else {
							SetUsers(database.collection('users').doc(object.author.id), doc["Configuration"]["Points"]["bot_id"], object.guild.id, "cooldown", object.createdTimestamp);
							SetUsers(database.collection('users').doc(object.author.id), doc["Configuration"]["Points"]["bot_id"], object.guild.id, "messages", 0)
						}
					})
				} else {

				}

			});
			break;
		case "bot-message":
			RunCommandFile(`./${intent['folder']}/${intent['file']}.js`, client, object, database);
		default:
			break;
	}
};
