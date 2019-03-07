

/*Local Variables*/
let commandFile;

/*Local Functions*/
//Run File
function RunCommandFile(file, client, object, database, intent) {
	commandFile = require(file);
	commandFile.run(client, object, database, intent);
}

//Export: from @/router/index.js
exports.run = (client, object, intent) => {
	switch (intent['sub_intent']) {
		case "database":
			return database;
		default:
			return database;
	}
};
