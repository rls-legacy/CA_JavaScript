/*Local Variables*/
let commandFile;

/*Local Functions*/
//Run File
function RunCommandFile(file, client, object, database) {
	commandFile = require(file);
	commandFile.run(client, object, database);
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

//Export: from @/router/index.js
exports.run = (client, object, intent, database) => {
	switch (intent['sub_intent']) {
		case "message":
			let path = database.collection('configuration').doc('commands');
			let commands = GetCommands(path);
			commands.then(function (doc) {
				RunCommandFile(`./${intent['folder']}/${intent['file']}.js`, client, object, doc);
			});
			break;
		default:
			break;
	}
};
