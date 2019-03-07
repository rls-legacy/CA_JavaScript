/*Global Packages*/
const Discord = require('discord.js');
const RichEmbed = new Discord.RichEmbed();

//Export: from @/store/CommandHandler/index.js
exports.run = async (client, object, b_embed, edit, override) => {

	let main_embed = {
		color: 16744448,
		author: {
			name: client.user.username,
			icon_url: client.user.avatarURL
		},
		title: "Capt'n Amelia",
		description: "Captain of the RLS-Legacy.",
		timestamp: new Date(),
		footer: {
			icon_url: client.user.avatarURL,
			text: "© Aliyss Snow"
		}
	};

	const o_embed = {
		footer: {
			text: "Permission Override initiated."
		}
	};

	if (override === true) {
		main_embed = Object.assign(main_embed, b_embed, o_embed);
	} else {
		main_embed = Object.assign(main_embed, b_embed);
	}

	let final_embed = {
		embed: main_embed
	};

	if (edit === true) {
		object.edit(final_embed)
	} else {
		object.channel.send(final_embed)
	}


};