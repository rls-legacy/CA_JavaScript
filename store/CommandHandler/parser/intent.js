
//Export: from @/store/CommandHandler/index.js
exports.return = (object) => {
	let joiner = " ";

	if (object.content.includes("|")) {
		joiner = "|"
	} else {
		joiner = " "
	}

	let arr = object.content.toLowerCase().split(joiner);

	return {arr, joiner};
};