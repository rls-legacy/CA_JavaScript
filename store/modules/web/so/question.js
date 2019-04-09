/*Global Variables*/
const Discord = require('discord.js');
const zlib = require('zlib');
const http = require("http");
const scraper = require('google-search-scraper');
const TurndownService = require('turndown');
const Vibrant = require('node-vibrant');
const rgb = require('rgb-to-int');

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
		name: "Python Documentation",
		description: "Returns current speed of the RLS-Legacy",
		permissions: ["SEND_MESSAGES"]
	}
};

//Export: from @/store/CommandHandler/index.js
exports.run = async (client, object, base, override, database) => {



	let urladder;
	let urlstring = "";

	if (base['case_mapper']) {
		urladder = base['case_mapper']['default'];

		if (urladder === undefined) {
			urladder = base['case_mapper']['argument'];
			if (urladder === undefined) {
				urladder = []
			} else if (!Array.isArray(urladder)) {
				urladder = [urladder]
			}
		}
	}

	if (urladder[0]) {
		urladder = urladder.join(" ");
	}


	let options = {
		query: `site:stackoverflow.com "${urladder}"`,
		limit: 2
	};

	let g_results = [];
	let g_results2 = [];
	let count = 0;

	function g_searching () {
		return new Promise( function (resolve) {
			scraper.search(options, function(err, url, meta) {
				// This is called for each result
				count++;
				if(err) throw err;
				let suburl = 34788047;
				if (url) {
					if (url.split("/")[4]) {
						suburl = url.split("/")[4];
					}
				}
				g_results.push({
					name: count + ") " + meta.title,
					value: meta.desc,
				});
				g_results2.push({
					name: meta.title,
					value: meta.desc,
					url: suburl
				});
				resolve(g_results)
			});
		})
	}

	async function runner() {
		let tent = await g_searching();
		if (tent.length !== 0) {
			await test(tent)
		}
	}

	runner();

	function getGzipped(url, callback) {
		// buffer to store the streamed decompression
		let buffer = [];

		http.get(url, function(res) {
			// pipe the response into the gunzip to decompress
			let gunzip = zlib.createGunzip();
			res.pipe(gunzip);

			gunzip.on('data', function(data) {
				// decompression chunk ready, add it to the buffer
				buffer.push(data.toString())

			}).on("end", function() {
				// response and decompression complete, join the buffer and return
				callback(null, buffer.join(""));

			}).on("error", function(e) {
				callback(e);
			})
		}).on('error', function(e) {
			callback(e)
		});
	}

	function test(g_results) {

		let imageURL = "https://cdn.sstatic.net/Sites/stackoverflow/company/img/logos/so/so-icon.png";
		let v = new Vibrant(imageURL);
		v.getPalette().then((palette) => {

			let rgb_product = {
				red: palette['Vibrant']['rgb'][0],
				green: palette['Vibrant']['rgb'][1],
				blue: palette['Vibrant']['rgb'][2]
			};

			let embed = {
				author: {
					name: `Results for ${urladder}`,
					icon_url: imageURL
				},
				title: null,
				color: rgb(rgb_product),
				//description: fullJSON['items'][0]['body'],
				fields: g_results,
				footer: {
					icon_url: null,
					text: "StackOverflow Question"
				}
			};

			RunCommandFile("./../../../CommandHandler/output/embed.js", client, object, embed, false, override)
		});


		const collector = new Discord.MessageCollector(object.channel, m => m.author.id === object.author.id, {time: 10000});
		let n = 10;
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

				let website = `http://api.stackexchange.com/2.2/questions/${g_results2[n]['url']}?order=desc&sort=activity&site=stackoverflow&filter=!-y(KwOdKR5Ga7mmruVArx2SJykc-M)3jKiDQBk1fq&key=${process.env.STACKEXCHANGE}`;

				getGzipped(website, function(err, data) {

					let fullJSON = JSON.parse(data);

					let turndownService = new TurndownService({
						headingStyle: "atx",
						bulletListMarker: "+",
						codeBlockStyle: "fenced",
					});
					turndownService.remove('style');
					let fullmd = turndownService.turndown(fullJSON['items'][0]['answers'][0]['body']).trim();

					let imageURL = "https://cdn.sstatic.net/Sites/stackoverflow/company/img/logos/so/so-icon.png";
					let v = new Vibrant(imageURL);
					v.getPalette().then((palette) => {

						let rgb_product = {
							red: palette['Vibrant']['rgb'][0],
							green: palette['Vibrant']['rgb'][1],
							blue: palette['Vibrant']['rgb'][2]
						};

						let embed = {
							author: {
								name: `${fullJSON['items'][0]['title']}`,
								url: fullJSON['items'][0]['link'],
								icon_url: imageURL
							},
							title: null,
							color: rgb(rgb_product),
							//description: fullJSON['items'][0]['body'],
							fields: [
								{
									name: fullJSON['items'][0]['title'],
									value: fullmd
								}
							],
							footer: {
								icon_url: null,
								text: "StackOverflow Question"
							}
						};

						RunCommandFile("./../../../CommandHandler/output/embed.js", client, object, embed, false, override)
					});
				});
			}
		});
	}


};