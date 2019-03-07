let path;

//Export: from server.js
exports.run = (client, object, database, intent) => {

	database.collection(intent['collection']).doc(intent['document']).get().then(function(doc) {
		if (doc.exists) {
			return doc.data();
		} else {
			console.log("No such document!");
		}
	}).catch(function(error) {
		console.log("Error getting document:", error);
	});

};