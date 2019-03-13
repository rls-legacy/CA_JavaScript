/*Global Packages*/
const glob = require("glob");

/*Local Variables*/
let commandFile;

/*Local Functions*/
//Run File
function RunCommandFile(file, client, object, intent, override, real_db) {
	commandFile = require(file);
	commandFile.run(client, object, intent, override, real_db);
}

//Description File
function DescriptionCommandFile(file) {
	commandFile = require(file);
	return commandFile.description();
}

//Return File
function ReturnCommandFile(file, object, joiner) {
	commandFile = require(file);
	return commandFile.return(object, joiner);
}

//Export: from @/router/index.js
exports.run = (client, object, commandDoc, database) => {

	let m_res = ReturnCommandFile('./parser/intent.js', object);

	let arr = m_res.arr;
	let joiner = m_res.joiner;

	for (let x = 0; x < arr.length; x++) {
		arr[x] = arr[x].trim();
	}

	let arr_go = arr.slice();
	let arr_g = [];
	let c = 0;
	let c_temp = [undefined];

	let origin = "store/modules";
	if (arr[0].startsWith(process.env.PREFIX)) {

		arr.shift();

		let getDirectories = async function (src, callback) {
			await glob(src + `/**/${arr[0]}*`, callback);
		};

		let allDirectories = function(source) {
			return new Promise(resolve => {
				return getDirectories(source, function (err, res){
					if (err) {
						console.log(err)
					} else {
						resolve(res)
					}
				})
			})
		};

		let arr_t = [];

		function file_source(source) {
			function extractJSON(obj) {
				for (const i in obj) {
					if ((Array.isArray(obj[i]) || typeof obj[i] === 'object')) {
						if (Array.isArray(obj[i])) {
							for (let x = 0; x < obj[i].length; x++) {
								if (typeof obj[i][x] === 'object') {
									for (let b = 0; b < obj[i][x]['aliases'].length; b++) {
										if (obj[i][x]['aliases'][b].startsWith(arr[0]) && (!arr_g[c] || c_temp === arr_g[c++])) {
											if (typeof obj[i][0] === 'object') {

												arr[0] = obj[i][0]['aliases'][0];
												c_temp = obj[i][0]['aliases'][0];
												arr_g.push(obj[i][0]['aliases'][0]);
												arr_go[c - 1] = obj[i][x]['aliases'][0];

											} else {

												arr[0] = obj[i][0];
												c_temp = obj[i][0];
												arr_g.push(obj[i][0]);
												arr_go[c] = obj[i][x]['aliases'][0];

											}
										}
									}
								} else {
									if (obj[i][x].startsWith(arr[0]) && (!arr_g[c] || c_temp === arr_g[c++])) {
										arr[0] = obj[i][0];
										c_temp = obj[i][0];
										arr_g.push(obj[i][0]);
									}
								}
							}
						}
						extractJSON(obj[i]);
					}
				}
			}

			extractJSON(commandDoc);

			let arrayParser = allDirectories(source);
			return arrayParser.then(async function(res) {
				let temp = arr[0];
				arr.shift();
				arr_go.shift();

				for (let x = 0; x < res.length; x++) {
					if (!res[x].endsWith(".js")){
						arr_t.push(res[x].substring(origin.length));
						await file_source(res[x]).then(value => arr_t.push(value))
					} else {
						arr_t.push(res[x].substring(origin.length))
					}
				}

				arr.unshift(temp);
				return await arr_t
			});
		}

		async function get_source(source) {

			let main_arr = await file_source(source);
			let file_arr = [];
			let fold_arr = [];
			try {
				for (let x = 0; x < main_arr.length; x++) {
					if (typeof main_arr[x] === 'string') {
						if (main_arr[x].endsWith(".js")) {
							file_arr.push(`./../modules${main_arr[x]}`)
						} else {
							fold_arr.push(`./../modules${main_arr[x]}`)
						}
					}
				}
			} catch (e) {

			}

			return [file_arr, fold_arr];
		}

		get_source(origin).then((arr_m) => {
			if (arr_m[0].length === 1) {

				let MemberPerms = object.member.permissions.toArray();
				let MustPerms = DescriptionCommandFile(`${arr_m[0].toString()}`);

				let filteredKeywords = MustPerms['permissions'].filter((word) => !MemberPerms.includes(word));
				let fullfilledKeywords = MustPerms['permissions'].filter((word) => !filteredKeywords.includes(word));

				if (client.owner.includes(object.author.id) || filteredKeywords.length === 0) {
					let override = false;
					if (client.owner.includes(object.author.id) && filteredKeywords.length !== 0) {
						override = true
					}

					let arguments = ReturnCommandFile('./parser/arguments.js', arr_go, joiner);
					RunCommandFile(`${arr_m[0].toString()}`, client, object, arguments, override, database)
				} else {
					let embed = {
						color: 16711744,
						author: {
							name: `Failed to execute the command: ${MustPerms['name'].charAt(0).toUpperCase() + MustPerms['name'].slice(1)}`,
							icon_url: object.author.avatarURL
						},
						title: null,
						description: "You are missing necessary permissions.\n_\n_",
						fields: [
							{
								name: "Necessary Permissions",
								value: `\`\`${MustPerms['permissions'].join("\`\`, \`\`")}\`\``
							},
							{
								name: "Missing Permissions",
								value: `\`\`${filteredKeywords.join("\`\`\n\`\`")}\`\``,
								inline: true
							},
							{
								name: "Fulfilled Permissions",
								value: `\`\`${fullfilledKeywords.join("\`\`\n\`\`")}\`\``,
								inline: true
							}
						],
						timestamp: null,
						footer: null
					};

					RunCommandFile("./output/embed.js", client, object, embed)
				}

			} else if (arr_m[0].length >= 1) {
				//object.channel.send("Multiple Commands found: " + arr[0].toString());
				//object.channel.send("Multiple Folders found: " + arr[1].toString());
			} else {
				//object.channel.send("No such Command found: " + arr[0].toString());
				//object.channel.send("Multiple Folders found: " + arr[1].toString());
			}
		})
	}

};
