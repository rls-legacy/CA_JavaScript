/*Local Variables*/
let commandFile;

/*Local Functions*/

//Export: from @/store/CommandHandler/index.js
exports.run = async (client, object, intent, b) => {
	let member = null;
	if (object.guild.members.get(intent)) {
		member = object.guild.members.get(intent).user;
	} else if (object.guild.members.find(value => value.displayName.toLowerCase() === intent)) {
		member = object.guild.members.find(value => value.displayName.toLowerCase() === intent).user
	} else if (object.guild.members.find(value => value.id.toLowerCase() === intent)) {
		member = object.guild.members.find(value => value.id.toLowerCase() === intent).user
	} else if (client.users.find(value => value.username.toLowerCase() === intent)) {
		member = client.users.find(value => value.username.toLowerCase() === intent)
	} else if (object.mentions.members.array()[b]) {
		member = object.mentions.users.array()[b];
		member.mention = true;
	}
	return member
};