/*Global Packages*/
const Discord = require('discord.js');
const Vibrant = require('node-vibrant');
const rgb = require('rgb-to-int');
const moment = require('moment');
const merge = require('deepmerge');
const libgen = require('libgen');

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
		name: "book",
		description: "Returns current speed of the RLS-Legacy",
		permissions: ["SEND_MESSAGES"]
	}
};

//Export: from @/store/CommandHandler/index.js
exports.run = async (client, object, base, override) => {

	let query_arr;
	let count_arr;
	let search_in_arr;
	let sort_arr;
	let reverse_arr;

	if (base['mapper']) {

		query_arr = base['mapper']['default'];

		if (query_arr === undefined) {
			query_arr = base['mapper']['book'];
			if (query_arr === undefined) {
				query_arr = ["Alice in Wonderland"]
			} else if (!Array.isArray(query_arr)) {
				query_arr = [query_arr]
			}
		}

		count_arr = base['mapper']['count'];

		if (count_arr === undefined) {
			count_arr = [10]
		} else if (!Array.isArray(count_arr)) {
			count_arr = [count_arr]
		}

		search_in_arr = base['mapper']['search_in'];

		if (search_in_arr === undefined) {
			search_in_arr = ["def"]
		} else if (!Array.isArray(search_in_arr)) {
			search_in_arr = [search_in_arr]
		}

		sort_arr = base['mapper']['sort'];

		if (sort_arr === undefined) {
			sort_arr = ["year"]
		} else if (!Array.isArray(sort_arr)) {
			sort_arr = [sort_arr]
		}

		reverse_arr = base['mapper']['reverse'];

		if (reverse_arr === undefined) {
			reverse_arr = [true]
		} else if (!Array.isArray(reverse_arr)) {
			reverse_arr = [reverse_arr]
		}

	}

	let profile = {
		list: function (member, data) {
			let field_val = [];

			for (let n = 0; n < data.length; n++) {
				field_val.push({
					name: `${n + 1}. ${data[n].title} [${data[n].year}] [${data[n].extension}]`,
					value: `\`\`Authors: ${data[n].author}\`\`\n` +
						`\`\`Language: ${data[n].language}\`\`\n`,
					inline: false
				})
			}

			return {
				description: `Found: ${data.length} books.`,
				timestamp: null,
				fields: field_val,
				thumbnail: null,
				author: {
					name: "Search Result for " + query_arr[0]
				},
			}
		},
		title: function (member, data, n) {
			return {
				fields: [{
					name: "Title",
					value: (data[n].title) ? data[n].title : "unknown"
				}]
			}
		},
		topic: function (member, data, n) {
			return {
				fields: [{
					name: "Topic",
					value: (data[n].topic !== "") ? data[n].topic : "unknown"
				}]
			}
		},
		year: function (member, data, n) {
			return {
				fields: [{
					name: "Year",
					value: (data[n].year !== 0 && data[n].year !== "") ? data[n].year : "unknown"
				}]
			}
		},
		edition: function (member, data, n) {
			return {
				fields: [{
					name: "Edition",
					value: (data[n].edition !== "") ? data[n].edition : "unknown"
				}]
			}
		},
		description: function (member, data, n) {
			return {
				fields: [{
					name: "Description",
					value: (data[n].descr !== "") ? data[n].descr : "unknown"
				}]
			}
		},
		download: function (member, data, n) {
			return {

				fields: [{
					name: `Download Link`,
					value: (data[n].md5 !== "") ? `[Download link](http://download.library1.org/main/${data[n].id.substring(0, data[n].id.length - 3)}000/${data[n].md5.toLowerCase()}/book.${data[n].extension})\n
					Keep the new tab open until you get a response.\nIt takes some time.` : "Link does not work."
				}]
			}
		},
		language: function (member, data, n) {
			return {
				fields: [{
					name: "Language",
					value: (data[n].language !== "") ? data[n].language : "unknown"
				}]
			}
		},
		author: function (member, data, n) {
			return {
				fields: [{
					name: "Author(s)",
					value: (data[n].author !== "") ? data[n].author : "unknown"
				}]
			}
		},
		pages: function (member, data, n) {
			return {
				fields: [{
					name: "Pages",
					value: (data[n].pages !== 0 && data[n].pages !== "") ? data[n].pages : "unknown"
				}]
			}
		},
		extension: function (member, data, n) {
			return {
				fields: [{
					name: "Extension",
					value: (data[n].extension !== "") ? data[n].extension : "unknown"
				}]
			}
		},
		tags: function (member, data, n) {
			return {
				fields: [{
					name: "Tags",
					value: (data[n].tags !== "") ? data[n].tags.split(";").join(" | ") : "unknown"
				}]
			}
		},
		publisher: function (member, data, n) {
			return {
				fields: [{
					name: "Publisher",
					value: (data[n].publisher !== "") ? data[n].publisher : "unknown"
				}]
			}
		},
		filesize: function (member, data, n) {

			function bytesToSize(bytes, seperator = "") {
				const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
				if (bytes === 0) return 'n/a';
				const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
				if (i === 0) return `${bytes}${seperator}${sizes[i]}`;
				return `${(bytes / (1024 ** i)).toFixed(1)}${seperator}${sizes[i]}`
			}

			return {
				fields: [{
					name: "File Size",
					value: (data[n].filesize !== "") ? bytesToSize(data[n].filesize, " ") : "unknown"
				}]
			}
		},
		avatar: function (member, data, n) {
			return {
				thumbnail: null,
				image: {
					url: (data[n]['coverurl'] !== "") ? "http://booksdescr.org/covers/" + data[n]['coverurl'] : "unknown"
				},
			}
		},
		info: function (member, data, n, palette) {
			let override_embed = {
				description: `${data[n].title}`,
				timestamp: null,
				thumbnail: {
					url: null
				},
			};

			let embed_arr = [
				this.list(member, data, n), override_embed
			];

			return merge.all(embed_arr)
		}
	};

	function embedder(member, data, n, palette) {

		let su_color = null;

		if (palette) {
			let rgb_product = {
				red: palette['Vibrant']['rgb'][0],
				green: palette['Vibrant']['rgb'][1],
				blue: palette['Vibrant']['rgb'][2]
			};
			su_color = rgb(rgb_product)
		}

		let auth_name = null;
		let thum_url = null;
		if (data[n]) {
			auth_name = "Book Data: " + data[n].title;
			thum_url = "http://booksdescr.org/covers/" + data[n]['coverurl']
		}

		return {
			title: null,
			description: null,
			author: {
				name: auth_name
			},
			color: su_color,
			thumbnail: {
				url: thum_url
			},
			footer: null
		}
	}

	let url = libgen.mirror(function (err, urlString) {
		if (err) {
			console.error(err);
		} else {
			return urlString
		}
	});

	const options = {
		mirror: "http://libgen.io/",
		query: query_arr[0],
		count: count_arr[0],
		search_in: search_in_arr[0],
		sort_by: sort_arr[0],
		reverse: reverse_arr[0]
	};

	libgen.search(options, async (err, data) => {
		if (err) {
			object.channel.send(err.toString());
			return console.error(err);
		} else {
			let n = data.length;
			let member = object.guild;
			let firs_embed = embedder(member, data);
			let func_name = "list";

			for (let x in profile) {
				if (x.startsWith(func_name)) {
					func_name = x.toString();
				}
			}

			if (!profile[func_name]) {
				func_name = "list";
			}

			let f_embed = merge(firs_embed, profile[func_name](member, data));

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
					member = object.guild;
					let func_name = base['command'];

					for (let x in profile) {
						if (x.startsWith(func_name)) {
							func_name = x.toString();
						}
					}

					if (!profile[func_name] && !profile[base['command']]) {
						func_name = "info";
					}

					if (func_name !== "info") {
						let v = new Vibrant("http://booksdescr.org/covers/" + data[n]['coverurl']);
						v.getPalette().then((palette) => {
							let fir_embed = embedder(member, data, n, palette);
							let f_embed = merge(fir_embed, profile[func_name](member, data, n, palette));
							RunCommandFile("./../../CommandHandler/output/embed.js", client, object, f_embed, false, override);
							collector.stop();
						});
					}
				}
			});
		}
	});
};