const dJSON = require("dirty-json");
//Export: from @/store/CommandHandler/index.js
exports.return = (object, joiner) => {
	let command = object[0];
	let string = object.splice(1).join(joiner).trim();

	let caseSt;

	let f_string;
	if (string.includes(":")) {
		string = string.replace(/([a-zA-Z0-9-]+)[\s]+:[\s]+([a-zA-Z0-9-]+)/g, "\"$1: $2").replace(/'+(?=([^"]*"[^"]*")*[^"]*$)/g, "\"");

		if (!string.startsWith("\"")) {
			/*
			if (!string.includes("\"")) {
			*/
			string = "\"" + string.replace(/\s+(?=([^"]*"[^"]*")*[^"]*$)/g, ' ').replace(/:/g, "\": ");
			/*
			} else {
				string = string.replace(/([^,]*)(,|$)/g, "$1").replace(/([^\s]*)(\s|$)/g, "$1")
			}
			*/
		}

		let regex = /"([^"])*"[\s]*:|(?<=([^w]["|\[|,|{]([^"])*["|\]|,|}](\s)*((\s)*|(,)*|(\])*)*(\s)*))[\w]*:((?=([^w]"([^"])*")) | (?=(([^w]([^\[])*\]))))/g;
		let subobj = string.match(regex);
		let str = string.replace(regex, process.env.STRINGSECRET).split(process.env.STRINGSECRET).splice(1);

		for (let x = 0; x < subobj.length; x++) {
			subobj[x] = subobj[x].replace(/\s/g, '').trim();
			str[x] = str[x].trim();

			if (str[x].includes("\"") && !str[x].includes(",")) {
				str[x] = str[x].match(/[^\s"']+|"([^"]*)"|'([^']*)'/g).join(",")
			}

			if (str[x].includes(",")) {
				let temp_str = str[x].split(",");
				for (let y = 0; y < temp_str.length; y++) {
					temp_str[y] = temp_str[y].trim();
					if (!temp_str[y].startsWith("\"")) {
						temp_str[y] = "\"" + temp_str[y]
					}
					if (!temp_str[y].endsWith("\"")) {
						temp_str[y] = temp_str[y] + "\""
					}
				}
				str[x] = temp_str.join(",")
			}

			str[x] = str[x].replace(/\s+(?=([^"]*"[^"]*")*[^"]*$)/g, '\"');

			if (!str[x].includes("\"")) {
				str[x] = str[x].replace(/""/g, "\",\"");
			} else {
				str[x] = str[x].replace(/""/g, "\",\"");
			}


			if (!str[x].startsWith("[")) {
				str[x] = "[" + str[x]
			}

			if (!str[x].endsWith("]")) {
				str[x] = str[x] + "]"
			}

			subobj[x] = subobj[x] + str[x];
			console.log(subobj[x])
		}

		string = subobj.join(",")


	} else {
		string = string.replace(/\s+(?=([^"]*"[^"]*")*[^"]*$)/g, ',');

		if (!string.startsWith("[")) {
			string = "[" + string
		}

		if (!string.endsWith("]")) {
			string = string + "]"
		}

		f_string = "default:" + string;
		caseSt = "fullCase:" + string;
	}

	if (!f_string.startsWith("{")) {
		f_string = "{" + f_string
	}

	if (!f_string.endsWith("}")) {
		f_string = f_string + "}"
	}

	if (!caseSt.startsWith("{")) {
		caseSt = "{" + caseSt
	}

	if (!caseSt.endsWith("}")) {
		caseSt = caseSt + "}"
	}

	let mapper = dJSON.parse(f_string.toLowerCase());
	let case_mapper = dJSON.parse(caseSt);

	return { mapper, case_mapper, command };

};