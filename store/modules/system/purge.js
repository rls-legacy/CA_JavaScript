/*Local Variables*/
let commandFile;

/*Local Functions*/
//Run File
function RunCommandFile(file, client, object, embed, edit, override) {
	commandFile = require(file);
	commandFile.run(client, object, embed, edit, override);
}

exports.description = () => {

	return {
		name: "purge",
		description: "Returns current speed of the RLS-Legacy",
		permissions: ["SEND_MESSAGES"]
	}
};

//Export: from @/store/CommandHandler/index.js
exports.run = async (client, object, array, override) => {

	object.channel.fetchMessages()
		.then(messages => {

				object.channel.bulkDelete(messages.filter(m => m.author.id === '543452329387753502')).then(() => {
					object.channel.send(`Deleted ${messages.filter(m => m.author.id === '543452329387753502').size} messages.`).then(msg => msg.delete(3000));
				});
			}
		)
		.catch(console.error);
};