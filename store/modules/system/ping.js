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
		name: "ping",
		description: "Returns current speed of the RLS-Legacy",
		permissions: ["SEND_MESSAGES"]
	}
};

//Export: from @/store/CommandHandler/index.js
exports.run = async (client, object, array, override) => {

	const message = await object.channel.send("Ping?");

	let embed = {
		title: "Pong!",
		description: "Current Speed of the RLS-Legacy.",
		fields: [
			{
				name: "Latency",
				value:  `Latency is ${message.createdTimestamp - object.createdTimestamp}ms.`,
				inline: true
			},
			{
				name: "API Latency",
				value:  `API Latency is ${Math.round(client.ping)}ms.`,
				inline: true
			}
		],
		author: null,
		timestamp: null,
		footer: null
	};

	RunCommandFile("./../../CommandHandler/output/embed.js", client, message, embed, true, override)
};