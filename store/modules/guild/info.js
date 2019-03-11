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
		permissions: ["SEND_MESSAGES"]
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
		name: function(member) {
			return {
				fields: [
					{
						name: "Name".padEnd(20, `~`).replace(/~/g, "⠀"),
						value: `\`\`${member.name}\`\``,
						inline: true
					}
				]
			}
		},
		vlevel: function(member) {
			let verific_name = "Verification Level: ";
			let verific_level;
			switch (member.verificationLevel) {
				case 0:
					verific_name = verific_name + "None";
					verific_level = "Unrestricted";
					break;
				case 1:
					verific_name = verific_name + "Low";
					verific_level = "Must have a verified email on their Discord account.";
					break;
				case 2:
					verific_name = verific_name + "Medium";
					verific_level = "Must also be registered on Discord for longer than 5 minutes.";
					break;
				case 3:
					verific_name = verific_name + "(╯°□°）╯︵ ┻━┻";
					verific_level = "Must also be a member of this server for longer than 10 minutes.";
					break;
				case 4:
					verific_name = verific_name + "┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻";
					verific_level = "Must have a verified phone on their Discord account.";
					break;
			}
			return {
				fields: [
					{
						name: verific_name.padEnd(20, `~`).replace(/~/g, "⠀"),
						value: `\`\`${verific_level}\`\``,
						inline: true
					}
				]
			}
		},
		owner: function(member) {
			return {
				thumbnail: {
					url: member.owner.user.avatarURL
				},
				fields: [
					{
						name: "Server Owner".padEnd(20, `~`).replace(/~/g, "⠀"),
						value: `\`\`${member.owner.displayName}\`\``,
						inline: true
					}
				]
			}
		},
		admin: function(member) {
			let perm_arr = member.members.filter(x => x.hasPermission("ADMINISTRATOR")).sort((a, b) => a['position'] - b['position']).array();
			return {
				fields: [
					{
						name: ("Server Administrators").padEnd(20, `~`).replace(/~/g, "⠀"),
						value: `\`\` • ${perm_arr.map((value) => value.displayName).reverse().join('\`\`\n\`\` • ')}\`\``,
						inline: true
					}
				]
			}
		},
		presences: function(member) {
			let dnd = member.presences.map(r => r.status).filter(i => i === 'dnd').length;
			let idle = member.presences.map(r => r.status).filter(i => i === 'idle').length;
			let online = member.presences.map(r => r.status).filter(i => i === 'online').length;
			let offline = member.memberCount - online - idle - dnd;
			let all = offline + online + idle + dnd;

			let streaming = member.presences.map(r => r).filter(i => {if (i.game) {if(i.game.streaming)  {return i.game.streaming}}}).length;

			online = online - streaming;

			let dnd_icon = "<:dnd:549797006059634690>";
			let idle_icon = "<:idle:549798737233444894>";
			let online_icon = "<:online:549798765284950017>";
			let offline_icon = "<:offline:549799125797830658>";
			let streaming_icon = "<:streaming:549806312356053012>";

			return {
				thumbnail: {
					url: member.iconURL
				},
				fields: [
					{
						name: ("Presences " + `(\`\`${all}\`\`)`).padEnd(20, `~`).replace(/~/g, "⠀"),
						value: `${online_icon + `\`\`${online}\`\``} ${idle_icon + `\`\`${idle}\`\``} ${dnd_icon + `\`\`${dnd}\`\``} ${streaming_icon + `\`\`${streaming}\`\``} ${offline_icon + `\`\`${offline}\`\``}`,
						inline: true
					}
				]
			}
		},
		partner: function(member) {

			let is_partner = "No";
			if (member.verified === true) {
				is_partner = "Yes"
			}

			return {
				fields: [
					{
						name: "Partner".padEnd(20, `~`).replace(/~/g, "⠀"),
						value: `\`\`${is_partner}\`\``,
						inline: true
					}
				]
			}
		},
		region: function(member) {
			return {
				fields: [
					{
						name: "Region".padEnd(20, `~`).replace(/~/g, "⠀"),
						value: `\`\`${member.region}\`\``,
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
		roles: function(member) {
			//console.log(member.roles);
			return {
				fields: [
					{
						name: `Roles (\`\`${member.roles.array().length}\`\`)`,
						value: member.roles.map(r => r).sort((a, b) => a['position'] - b['position']).reverse().join(' \`\`|\`\` ')
					}
				]
			}
		},
		emojis: function(member) {

			return {
				fields: [
					{
						name: `Emojis [${member.emojis.array().length}]`,
						value: member.emojis.map(r => `${r}`).join(' | ')
					}
				]
			}
		},
		avatar: function(member) {
			return {
				thumbnail: null,
				image: {
					url: member.iconURL
				},
			}
		},
		created: function(member) {
			return {
				fields: [
					{
						name: `Created`,
						value: `\`\`${moment(member.createdTimestamp).format("DD MMM YYYY HH:mm")}\`\``
					}
				]
			}
		},
		info: function (member) {
			let override_embed = {
				description: `\`\`Created: ${moment(member.createdTimestamp).fromNow()}\`\`\n\`\`Bot Joined: ${moment(member.joinedTimestamp).fromNow()}\`\``,
				timestamp: null,
				thumbnail: {
					url: member.iconURL
				},
			};

			let embed_arr = [
				this.name(member), this.id(member), this.region(member), this.partner(member), this.presences(member), this.roles(member), override_embed
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
				name: "Profile of " + member.name
			},
			thumbnail: {
				url: member.iconURL
			},
			footer: null
		}
	}

	let user_icon = object.guild.iconURL;

	if (base['command'] === "owner") {
		 user_icon = object.guild.owner.user.avatarURL;
	}

	let v = new Vibrant(user_icon);
	v.getPalette().then((palette) => {
		let member = object.guild;
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

};