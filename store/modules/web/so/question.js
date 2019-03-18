/*Global Variables*/
const zlib = require('zlib');
const http = require("http");
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
	console.log(urlstring);

	let website = `http://api.stackexchange.com/2.2/search/advanced?order=desc&answers=1&sort=activity&title=${urladder}&site=stackoverflow&key=${process.env.STACKEXCHANGE}`;

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

	getGzipped(website, function(err, data) {
		//console.log(JSON.parse(data));
		let fullJSON = JSON.parse(data);

		let field_val = [];
		let subfield = [];
		let c = 0;
		field_val[c] = [];
		let longest = [];
		longest[c] = 0;
		let g = 0;

		for (let n = 0; n < fullJSON['items'].length; n++) {

			if (fullJSON['items'][n]) {
				fl_name = fullJSON['items'][n]['title'];

				function cutStr(fl_name, sub) {

					if (fl_name.length > 70) {
						if (sub === true) {
							g = g + 2;
						} else {
							g++;
						}
						let length = fl_name.length + n.toString().length + 2;
						let middle = 70;
						let spaceNearMiddle = fl_name.lastIndexOf(' ', middle);
						let string1 = cutStr(fl_name.substring(0, spaceNearMiddle), false)/*.padEnd(30, `~`).replace(/~/g, "⠀")*/;
						let string2 = cutStr(fl_name.substring(spaceNearMiddle + 1, length), false)/*.padEnd(30, `~`).replace(/~/g, "⠀")*/;
						return flx_name = string1 + "\n".padEnd(n.toString().length, `~`).replace(/~/g,"⠀") + "⠀ ⠀" + string2;
					} else {
						if (sub === true) {
							g++;
						}
						return "⠀" + fl_name
					}
				}

				fl_name = cutStr(fl_name, true);

				if (fl_name.length > longest[c]) {
					longest[c] = fl_name
				}

				//console.log(fl_name);
				field_val[c].push(`${n + 1}. ${fl_name/*.padEnd(30, `~`).replace(/~/g, "⠀")*/}`);
				if ((g % 10 === 0) || (g % 11 === 0)) {
					g = 0;
					c++;
					field_val[c] = [];
					longest[c] = [];
				}
			}

		}

		while (c !== -1) {
			subfield.push({name: ("List " + (c+1)).padEnd(25, `~`).replace(/~/g, "⠀"),value: `\`\`${field_val[c].join("\n")}\`\``, inline: true})
			c--
		}

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
				fields: subfield.reverse(),
				footer: {
					icon_url: null,
					text: "StackOverflow Question"
				}
			};

			RunCommandFile("./../../../CommandHandler/output/embed.js", client, object, embed, false, override)
		});
	});

};