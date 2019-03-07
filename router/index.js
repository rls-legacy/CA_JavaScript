/*Global Packages*/
const admin = require("firebase-admin");


/*Local Packages*/
const serviceAccount = require(`./../settings/database/serviceAccountKeys.json`);

/*Initialization*/
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://aliyssium-discordbot.firebaseio.com"
});

/*Local Variables*/
const database = admin.firestore();

/*Local Variables*/
let commandFile;

/*Local Functions*/
//Run File
function RunCommandFile(file, client, object, intent, database) {
	commandFile = require(file);
	commandFile.run(client, object, intent, database);
}

//Export: from server.js
exports.run = (client, object, intent) => {

	switch (intent) {
		//Export: to database.js
			/*
		case "guildCreate":
			RunCommandFile(`./../database/index.js`, client, object, {'folder': 'upload', 'main': 'create', 'sub_intent': intent});
			break;
		case "guildDelete":
			RunCommandFile(`./../database/index.js`, client, object, {'folder': 'upload', 'main': 'delete', 'sub_intent': intent});
			break;
			*/
		case "message":
			RunCommandFile(`./../store/index.js`, client, object, {'folder': 'CommandHandler', 'file': 'index', 'sub_intent': intent}, database);
			break;
		default:
			break;
	}

};
