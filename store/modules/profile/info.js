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

/*Local Functions*/
//Get Commands
function GetUsers(path) {
	return new Promise(function(resolve, reject) {
		//Firebase: Get Command Document
		try {
			let getUsers = path.get()
				.then(doc => {
					if (doc.exists) {
						resolve(doc.data())
					} else {
						reject()
					}
				});
		} catch (e) {
			console.log(e)
			resolve(0)
		}

	});
}

exports.description = () => {
	return {
		name: "info",
		description: "Returns current speed of the RLS-Legacy",
		permissions: ["SEND_MESSAGES"]
	}
};

//Export: from @/store/CommandHandler/index.js
exports.run = async (client, object, base, override, database) => {

	let array = [];
	let array2 = [];

	if (base['mapper']) {
		array = base['mapper']['default'];
		if (base['mapper']['wildcard'][0]) {
			array2 = base['mapper']['wildcard'][0];
		}

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
						name: "Status".padEnd(23, `~`).replace(/~/g, "⠀"),
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
						if (member.user.presence.game.name === "Spotify") {
							sub_status = sub_status + " - " + member.user.presence.game.details
						}
					}
				} else {
					if (member.user.presence.game.name) {
						sub_status = member.user.presence.game.name;
					}
				}
			}

			let imURL = member.user.avatarURL;
			if (base['command'] === "presence") {
				if (member.user.presence.game) {
					if (member.user.presence.game.assets) {
						if (member.user.presence.game.assets.largeImageURL) {
							imURL = member.user.presence.game.assets.largeImageURL
						} else if (member.user.presence.game.assets.smallImageURL) {
							imURL = member.user.presence.game.assets.smallImageURL
						}
					}
				}
			}

			return {
				thumbnail: {
					url: imURL
				},
				fields: [
					{
						name: main_status.toString().padEnd(24, `~`).replace(/~/g, "⠀"),
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
						name: "Nickname".padEnd(23, `~`).replace(/~/g, "⠀"),
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
		points: async function(member) {

			try {
				let m_points = await GetUsers(database.collection('users').doc(member.id));
				let m_guild = await GetUsers(database.collection('guilds').doc(member.guild.id));

				return await {
					fields: [
						{
							name: `Points`.padEnd(23, `~`).replace(/~/g, "⠀"),
							value: `\`\`${m_points['catcher'][m_guild["Configuration"]["Points"]["bot_id"]]["guilds"][object.guild.id]['messages']}\`\``,
							inline: true
						}
					]
				}

			} catch (e) {
				return {
					fields: [
						{
							name: `Points`.padEnd(23, `~`).replace(/~/g, "⠀"),
							value: `\`\`No points set.\`\``,
							inline: true
						}
					]
				}
			}
		},
		info: async function (member) {
			let override_embed = {
				description: `\`\`Created: ${moment(member.user.createdTimestamp).fromNow()}\`\`\n\`\`Joined: ${moment(member.joinedTimestamp).fromNow()}\`\``,
				timestamp: null
			};

			let embed_arr = [
				this.nickname(member), this.presence(member), this.status(member), await this.points(member), this.roles(member), override_embed
			];

			return await merge.all(embed_arr)
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

		let imURL = user.avatarURL;
		if (base['command'] === "presence") {
			if (user.presence.game) {
				if (user.presence.game.assets) {
					if (user.presence.game.assets.largeImageURL) {
						imURL = user.presence.game.assets.largeImageURL
					} else if (user.presence.game.assets.smallImageURL) {
						imURL = user.presence.game.assets.smallImageURL
					}
				}
			}
		}

		let v = new Vibrant(imURL);
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

			async function test() {
				let embed = await merge(base_embed, await profile[func_name](member, array, palette));
				await RunCommandFile("./../../CommandHandler/output/embed.js", client, object, embed, false, override)
			}
			test()
		});
	}

	let b = 0;

	for (let x = 0; x <= Math.min(array.length, 3); x++) {
		let user = null;

		if (array2.length > 1) {
			console.log(array2[0] + "" + array2[2]);
			if (user === null) {
				user = object.guild.members.find(value => {
					if (value.displayName.toLowerCase().startsWith(array2[0]) && value.displayName.toLowerCase().endsWith(array2[2])) {
						return value
					}
				});

				if (user) {
					user = user.user
				}
			}
			if (user === null) {
				user = client.users.find(value => {
					if (value.username.toLowerCase().startsWith(array2[0]) && value.username.toLowerCase().endsWith(array2[2])) {
						return value
					}
				});

				if (user) {
				}
			}

			array2 = []
		} else if (array[x]) {
			if (object.guild.members.get(array[x])) {
				array[x] = array[x].toLowerCase();
				user = object.guild.members.get(array[x]).user;
			} else if (object.guild.members.find(value => value.displayName.toLowerCase().startsWith(array[x]))) {
				array[x] = array[x].toLowerCase();
				user = object.guild.members.find(value => value.displayName.toLowerCase().startsWith(array[x])).user
			} else if (object.guild.members.find(value => value.id.toString().startsWith(array[x].toString().trim()))) {
				user = object.guild.members.find(value => value.id.toString().startsWith(array[x].toString().trim())).user
			} else if (client.users.find(value => value.username.toLowerCase().startsWith(array[x]))) {
				array[x] = array[x].toLowerCase();
				user = client.users.find(value => value.username.toLowerCase().startsWith(array[x]))
			} else if (object.mentions.members.array()[b]) {
				user = object.mentions.users.array()[b];
				b++
			} else {

			}
		}


		if (user !== null) {
			let imURL = user.avatarURL;
			if (base['command'] === "presence") {
				if (user.presence.game) {
					if (user.presence.game.assets) {
						if (user.presence.game.assets.largeImageURL) {
							imURL = user.presence.game.assets.largeImageURL
						} else if (user.presence.game.assets.smallImageURL) {
							imURL = user.presence.game.assets.smallImageURL
						}
					}
				}
			}

			let v = new Vibrant(imURL);
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

				async function test() {
					let embed = await merge(base_embed, await profile[func_name](member, array, palette));
					await RunCommandFile("./../../CommandHandler/output/embed.js", client, object, embed, false, override)
				}
				test()
			});
		} else {

		}
	}
};