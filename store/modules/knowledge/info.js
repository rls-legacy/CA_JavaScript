/*Global Packages*/
const Discord = require('discord.js');
const md5 = require('blueimp-md5');
const wtf = require('wtf_wikipedia');
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

	let query_arr = [];

	if (base['mapper']) {
		query_arr = base['mapper']['default'];

		if (query_arr === undefined) {
			query_arr = base['mapper']['argument'];
			if (query_arr === undefined) {
				query_arr = ["Alice in Wonderland"]
			} else if (!Array.isArray(query_arr)) {
				query_arr = [query_arr]
			}
		}
	}

	let profile = {
		categories: function(member) {
			return {
				fields: [
					{
						name: "Categories",
						value: `\`\`${member.name}\`\``,
						inline: true
					}
				]
			}
		},
		avatar: function (member, wtf_json) {
			let name = wtf_json.image.text;
			let filename = name.replace(/ /g, "_");
			let digest = md5(filename);
			let folder = digest[0] + '/' + digest[0] + digest[1] + '/' + encodeURIComponent(filename);
			let im_url = 'http://upload.wikimedia.org/wikipedia/commons/' + folder;
			return {
				thumbnail: null,
				image: {
					url: (name !== "") ? im_url : "unknown"
				},
			}
		},
		list: function (object, doc) {
			let field_val = [];
			console.log(doc.links())
			for (let n = 0; n < doc.links().length; n++) {
				let fl_name = doc.links()[n].page;
				if (doc.links()[n].text) {
					fl_name = doc.links()[n].text
				}
				field_val.push({
					name: `${n + 1}. ${fl_name}`,
					value: "\u200B",
					inline: false
				})

			}

			return {
				description: `Found: ${doc.links().length} Possibilities.`,
				timestamp: null,
				fields: field_val,
				thumbnail: null,
				author: {
					name: "Search Result for " + query_arr[0]
				},
			}
		},
		info: function (member, doc) {
			let override_embed = {
				description: `\`\`Created: ${doc.title()}\`\``,
				timestamp: null,
				thumbnail: null
			};

			let embed_arr = [
				override_embed, {}
			];

			return merge.all(embed_arr)
		}
	};

	function embedder(object, wtf_json) {
		let auth_name;

		if (wtf_json.json().title) {
			auth_name = "Info to " + wtf_json.json().title
		}

		return {
			title: null,
			description: null,
			color: null,
			author: {
				name: auth_name
			},
			thumbnail: null,
			footer: null
		}
	}

	wtf.fetch(query_arr[0]).then(doc => {

		if (doc.json().categories.length === 0) {
			let wtf_json = doc;
			let n = doc.links().length;
			let firs_embed = embedder(object, wtf_json);
			let func_name = "list";

			for (let x in profile) {
				if (x.startsWith(func_name)) {
					func_name = x.toString();
				}
			}

			if (!profile[func_name]) {
				func_name = "list";
			}

			let f_embed = merge(firs_embed, profile[func_name](object, wtf_json));

			object.channel.send({embed: f_embed});
			const collector = new Discord.MessageCollector(object.channel, m => m.author.id === object.author.id, {time: 10000});

			collector.on('collect', message => {
				if (!/\d*/.test(message.content)) {
					message.channel.send("Please input a number.")
				} else if (message.content.match(/\d*/g)[0] > n) {
					message.channel.send("Your number is too high.")
				} else if (message.content.match(/\d*/g)[0] > n) {
					message.channel.send("Your number is too low.")
				} else {
					n = message.content.match(/\d*/g)[0] - 1;
					let query = doc.links()[n].page;

					wtf.fetch(query).then(doc => {
						wiki_toto(object, doc)
					});
				}
			});
		} else {
			wiki_toto(object, doc)
		}

		function wiki_toto(object, document) {
			let wtf_json = document;
			let base_embed = embedder(object, wtf_json);
			let func_name = base['command'];

			for (let x in profile) {
				if (x.startsWith(func_name)) {
					func_name = x.toString();
				}
			}

			if (!profile[func_name] && !profile[base['command']] ) {
				func_name = "info";
			}

			let embed = merge(base_embed, profile[func_name](object, wtf_json));
			RunCommandFile("./../../CommandHandler/output/embed.js", client, object, embed, false, override)
		}




	});

};