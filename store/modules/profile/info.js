/*Global Packages*/
const Vibrant = require('node-vibrant');
const rgb = require('rgb-to-int');
const moment = require('moment');
const merge = require('deepmerge');

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
		name: "info",
		description: "Returns current speed of the RLS-Legacy",
		permissions: ["SEND_MESSAGES", "ADMINISTRATOR"]
	}
};

//Export: from @/store/CommandHandler/index.js
exports.run = async (client, object, base, override) => {

	let array = [];

	if (base['mapper']) {
		array = base['mapper']['default'];

		if (array === undefined) {
			array = base['mapper']['users'];
		}
	}

	let profile = {
		status: function(member) {

			let status_i;
			let status_icon;

			switch (member.user.presence.status) {
				case 'dnd':
					status_i = "Do Not Disturb";
					status_icon = "<:dnd:549797006059634690>";
					break;
				case 'idle':
					status_i = "Idle";
					status_icon = "<:idle:549798737233444894>";
					break;
				case 'online':
					status_i = "Online";
					status_icon = "<:online:549798765284950017>";
					break;
				case 'offline':
				case 'invisible':
					status_i = "Offline";
					status_icon = "<:offline:549799125797830658>";
					break;
				default:
					status_i = "Online";
					status_icon = "<:online:549799125797830658>";
					break;
			}

			if (member.user.presence.game) {
				if (member.user.presence.game.streaming) {
					status_i = "Streaming";
					status_icon = "<:streaming:549806312356053012>";
				}
			}

			return {
				fields: [
					{
						name: "Status".padEnd(20, `~`).replace(/~/g, "⠀"),
						value: status_icon + `\`\`${status_i}\`\``,
						inline: true
					}
				]
			}
		},
		bot: function(member) {
			return {
				fields: [
					{
						name: "Bot?",
						value: `\`\`${member.user.bot}\`\``,
						inline: true
					},
				]
			}
		},
		presence: function(member) {
			let main_status = "Playing:";
			let sub_status = "Not playing anything";

			if (member.user.presence.game) {
				if (member.user.presence.game.state) {
					sub_status = member.user.presence.game.state;
					if (member.user.presence.game.name) {
						main_status = member.user.presence.game.name;
					}
				} else {
					if (member.user.presence.game.name) {
						sub_status = member.user.presence.game.name;
					}
				}
			}

			return {
				fields: [
					{
						name: main_status.padEnd(22, `~`).replace(/~/g, "⠀"),
						value: `\`\`${sub_status}\`\``,
						inline: true
					},
				]
			}
		},
		nickname: function(member) {
			let main_nickname = "No nickname set.";

			if (member.nickname) {
				main_nickname = member.nickname
			}

			return {
				fields: [
					{
						name: "Nickname".padEnd(20, `~`).replace(/~/g, "⠀"),
						value: `\`\`${main_nickname}\`\``,
						inline: true
					}
				]
			}
		},
		id: function(member) {
			return {
				fields: [
					{
						name: "ID".padEnd(20, `~`).replace(/~/g, "⠀"),
						value: `\`\`${member.id}\`\``,
						inline: true
					}
				]
			}
		},
		hierarchy: function(member) {
			return {
				fields: [
					{
						name: `Hierarchy`,
						value: `\`\`${member.highestRole.calculatedPosition}\`\``,
						inline: true
					}
				]
			}
		},
		roles: function(member) {
			return {
				fields: [
					{
						name: `Roles (\`\`${member.roles.array().length}\`\`)`,
						value: member.roles.map(r => r).sort((a, b) => a['position'] - b['position']).reverse().join(' \`\`|\`\` ')
					}
				]
			}
		},
		avatar: function(member) {
			return {
				thumbnail: null,
				image: {
					url: member.user.avatarURL
				},
			}
		},
		joined: function(member) {
			return {
				fields: [
					{
						name: `Joined`,
						value: `\`\`${moment(member.joinedTimestamp).format("DD MMM YYYY HH:mm")}\`\``
					}
				]
			}
		},
		created: function(member) {
			return {
				fields: [
					{
						name: `Created`,
						value: `\`\`${moment(member.user.createdTimestamp).format("DD MMM YYYY HH:mm")}\`\``
					}
				]
			}
		},
		info: function (member) {
			let override_embed = {
				description: `\`\`Created: ${moment(member.user.createdTimestamp).fromNow()}\`\`\n\`\`Joined: ${moment(member.joinedTimestamp).fromNow()}\`\``,
				timestamp: null
			};

			let embed_arr = [
				this.status(member), this.nickname(member), this.presence(member), this.id(member), this.roles(member), override_embed
			];

			return merge.all(embed_arr)
		}
	};

	function embedder(member, array, palette) {
		let rgb_product = {
			red: palette['Vibrant']['rgb'][0],
			green: palette['Vibrant']['rgb'][1],
			blue: palette['Vibrant']['rgb'][2]
		};

		return {
			title: null,
			description: null,
			color: rgb(rgb_product),
			author: {
				name: "Profile of " + member.user.username + "#" + member.user.discriminator,
				url: "https://discordapp.com/users/" + member.user.id,
			},
			thumbnail: {
				url: member.user.avatarURL
			},
			footer: null
		}
	}

	if (array.length === 0) {
		let user = object.author;
		let v = new Vibrant(user.avatarURL);
		v.getPalette().then((palette) => {
			let member = object.guild.members.get(user.id);
			let base_embed = embedder(member, array, palette);
			let func_name = base['command'];

			for (let x in profile) {
				if (x.startsWith(func_name)) {
					func_name = x.toString();
				}
			}

			if (!profile[func_name] && !profile[base['command']] ) {
				func_name = "info";
			}

			let embed = merge(base_embed, profile[func_name](member, array, palette));
			RunCommandFile("./../../CommandHandler/output/embed.js", client, object, embed, false, override)
		});
	}

	let b = 0;

	for (let x = 0; x <= Math.min(array.length, 3); x++) {
		let user = null;

		if (array[x]) {
			if (object.guild.members.get(array[x])) {
				array[x] = array[x].toLowerCase();
				user = object.guild.members.get(array[x]).user;
			} else if (object.guild.members.find(value => value.displayName.toLowerCase().startsWith(array[x]))) {
				array[x] = array[x].toLowerCase();
				user = object.guild.members.find(value => value.displayName.toLowerCase().startsWith(array[x])).user
			} else if (object.guild.members.find(value => value.id.startsWith(array[x]))) {
				user = object.guild.members.find(value => value.id.startsWith(array[x])).user
			} else if (client.users.find(value => value.username.toLowerCase().startsWith(array[x]))) {
				array[x] = array[x].toLowerCase();
				user = client.users.find(value => value.username.toLowerCase().startsWith(array[x]))
			} else if (object.mentions.members.array()[b]) {
				user = object.mentions.users.array()[b];
				b++
			}
		}

		if (user !== null) {
			let v = new Vibrant(user.avatarURL);
			v.getPalette().then((palette) => {
				let member = object.guild.members.get(user.id);
				let base_embed = embedder(member, array, palette);
				let func_name = base['command'];

				for (let x in profile) {
					if (x.startsWith(func_name)) {
						func_name = x.toString();
					}
				}

				if (!profile[func_name] && !profile[base['command']] ) {
					func_name = "info";
				}

				let embed = merge(base_embed, profile[func_name](member, array, palette));
				RunCommandFile("./../../CommandHandler/output/embed.js", client, object, embed, false, override)
			});
		} else {

		}
	}
};