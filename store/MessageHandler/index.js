

/*Local Functions*/
//Get Commands
function GetUsers(path, bot_id, guild_id, input) {
	//Firebase: Get Command Document
	let getuser = path.set(
		{
			"catcher": {
				[bot_id]: {
					"guilds": {
						[guild_id]: {"messages": input}
					}
				}
			}
			
		}, {
			merge: true
		});
}

//Set User Profile
function GetBotUp(client, path, input) {
	return new Promise(function(resolve) {
	//Firebase: Create User Document
	let getBotUp = path.get()
		.then(doc => {
			if (doc.exists) {
				resolve(doc.data())
			}
		});
	});
}

exports.run = async (client, object, database) => {

	if (object['embeds'][0] && object['embeds'][0]['type'] === "rich") {
		let bot_msg = await GetBotUp(client, database.collection("bots").doc(object.author.id));
		if (bot_msg['catcher'][object.guild.id]) {
			for (let x of bot_msg['catcher'][object.guild.id]['messages']){

				let ender = "";
				// noinspection JSUnfilteredForInLoop
				switch (x['search_in']['search_arg'][0]) {
					case "StartsWith":
						ender = ".StartsWith(";
						break;
					case "EndsWith":
						ender = ".EndsWith(";
						break;
				}
				// noinspection JSUnfilteredForInLoop
				if(object['embeds'][0][x['search_in']['search_for']] && object['embeds'][0][x['search_in']['search_for']].startsWith(x['search_in']['search_arg'][1])) {
					// noinspection JSUnfilteredForInLoop
					switch (x['search_us']['search_arg'][0]) {
						case "StartsWith":
							ender = ".StartsWith(";
							x['search_in']['search_arg'][1] = 0;
							break;
						case "EndsWith":
							ender = ".EndsWith(";
							x['search_in']['search_arg'][1] = x['search_in']['search_arg'][1];
							break;
					}
					// THIS IS MANUAL ATM.
					// noinspection JSUnfilteredForInLoop
					let userb = object['embeds'][0][x['search_in']['search_for']].substring(x['search_in']['search_arg'][1].length).trim();
					// noinspection JSUnfilteredForInLoop
					let val = x['search_us']['search_arg'][1];
					let user;

					userb = userb.toLowerCase();
					if (val === "username") {
						userb = userb.toLowerCase();
						user = object.guild.members.get(userb).user;
					} else if (val === "displayName") {
						userb = userb.toLowerCase();
						user = object.guild.members.find(value => value.displayName.toLowerCase().startsWith(userb)).user
					} else if (val === "id") {
						user = object.guild.members.find(value => value.id.startsWith(userb)).user
					} else if (val === "username2") {
						userb = userb.toLowerCase();
						user = client.users.find(value => value.username.toLowerCase().startsWith(userb))
					}

					let points;
					if (x['search_va']['search_for'] === "fields") {
						points = object['embeds'][0][x['search_va']['search_for']][x['search_va']['search_arg']].value
					} else {
						points = object['embeds'][0][x['search_va']['search_for']].value
					}

					await GetUsers(database.collection("users").doc(user.id), object.author.id, object.guild.id, points)
				}
			}
		}


	}
	
};