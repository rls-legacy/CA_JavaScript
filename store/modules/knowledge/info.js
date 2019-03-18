/*Global Packages*/
const fullwidth = require('fullwidth');
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

	if (base['case_mapper']) {
		query_arr = base['case_mapper']['default'];

		if (query_arr === undefined) {
			query_arr = base['case_mapper']['argument'];
			if (query_arr === undefined) {
				query_arr = ["Alice in Wonderland"]
			} else if (!Array.isArray(query_arr)) {
				query_arr = [query_arr]
			}
		}
	}

	let profile = {
		no_info: function () {
			return {
				fields: [
					{
						name: `No ${base['command']} found for:`,
						value: `\`\`${query_arr[0]}\`\``,
						inline: true
					}
				]
			}
		},
		category: function(member, doc, fallthrough) {
			if (doc.json()) {
				if (doc.json()['categories']) {
					return {
						thumbnail: this.avatar(member, doc, true),
						fields: [
							{
								name: "Categories",
								value: doc.json()['categories'].join(" \`\`|\`\` ")
							}
						]
					}
				} else {
					return this.no_info()
				}
			} else {
				return this.no_info()
			}
		},
		avatar: function (member, doc, fallthrough) {
			if (doc.infoboxes(0)) {
				if (doc.infoboxes(0).json().image) {
					let name = doc.infoboxes(0).json().image.text;
					let filename = name.replace(/ /g, "_");
					let digest = md5(filename);
					let folder = digest[0] + '/' + digest[0] + digest[1] + '/' + encodeURIComponent(filename);
					let im_url = 'http://upload.wikimedia.org/wikipedia/commons/' + folder;
					if (fallthrough === true) {
						return {url: (name !== "") ? im_url : null}
					} else {
						return {
							thumbnail: null,
							image: {
								url: (name !== "") ? im_url : null
							},
						}
					}

				} else {
					if (fallthrough !== true) {
						return this.no_info()
					} else {
						return null
					}
				}
			} else {
				if (fallthrough !== true) {
					return this.no_info()
				} else {
					return null
				}
			}
		},
		list: function (object, doc, fallthrough) {
			let field_val = [];
			let subfield = [];
			let c = 0;
			field_val[c] = [];
			let longest = [];
			longest[c] = 0;
			let g = 0;
			for (let n = 0; n < doc.links().length; n++) {
				let fl_name = doc.links()[n].page.replace(/''/g, "");

				if (doc.links()[n].text) {
					fl_name = doc.links()[n].text.replace(/''/g, "")
				}

				function cutStr(fl_name, sub) {

					if (fl_name.length > 27) {
						if (sub === true) {
							g = g + 2;
						} else {
							g++;
						}
						let length = fl_name.length + n.toString().length + 2;
						let middle = 27;
						let spaceNearMiddle = fl_name.lastIndexOf(' ', middle);
						let string1 = cutStr(fl_name.substring(0, spaceNearMiddle), false)/*.padEnd(30, `~`).replace(/~/g, "⠀")*/;
						let string2 = cutStr(fl_name.substring(spaceNearMiddle + 1, length), false)/*.padEnd(30, `~`).replace(/~/g, "⠀")*/;
						return flx_name = string1 + "\n".padEnd(n.toString().length, `~`).replace(/~/g, "⠀") + "⠀ ⠀" + string2;
					} else {
						if (sub === true) {
							g++;
						}
						return fl_name
					}
				}

				fl_name = cutStr(fl_name, true);

				if (fl_name.length > longest[c]) {
					longest[c] = fl_name
				}

				field_val[c].push(`${n + 1}. ${fl_name/*.padEnd(30, `~`).replace(/~/g, "⠀")*/}`);
				if ((g % 10 === 0) || (g % 11 === 0)) {
					g = 0;
					c++;
					field_val[c] = [];
					longest[c] = [];
				}
			}

			while (c--) {
				subfield.push({name: ("List " + (c+1)).padEnd(25, `~`).replace(/~/g, "⠀"),value: `\`\`${field_val[c].join("\n")}\`\``, inline: true})
			}

			return {
				description: `Found: ${doc.links().length} Possibilities.`,
				timestamp: null,
				fields: subfield.reverse(),
				thumbnail: null,
				author: {
					name: "Search Result for " + query_arr[0]
				},
			}
		},
		info: function (member, doc, fallthrough) {
			console.log(doc.infoboxes(0).json())
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

	function embedder(object, wtf_json, fallthrough) {
		let auth_name;

		if (wtf_json.json().title) {
			auth_name = "Info to " + wtf_json.json().title
		}

		return {
			title: null,
			description: null,
			author: {
				name: auth_name
			},
			thumbnail: null,
			footer: null
		}
	}

	wtf.fetch(query_arr[0]).then(doc => {

		if (doc !== null && doc.json().categories.length === 0) {
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

			let f_embed = merge(firs_embed, profile[func_name](object, wtf_json, false));

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
					collector.stop();
					n = message.content.match(/\d*/g)[0] - 1;
					let query = doc.links()[n].page;

					wtf.fetch(query).then(doc => {
						wiki_toto(object, doc)
					});
				}
			});
		} else if (doc !== null) {
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
			
			let embed = merge(base_embed, profile[func_name](object, wtf_json, false));
			RunCommandFile("./../../CommandHandler/output/embed.js", client, object, embed, false, override)
		}

	});

};