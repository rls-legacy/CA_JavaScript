const Discord = require("discord.js");
const superagent = require('superagent');

module.exports.run = async (bot, message, args) => {
var uid = args[0]
if(uid > 0) {
  var {body} = await superagent.get(`https://api.truckersmp.com/v2/player/${uid}`)
  try{
    var embed = new Discord.RichEmbed()
    .setTitle("Truckers MP user info")
    .setDescription("this is information pulled from Truckers MP and Steam")
    .setImage(body.response.avatar)
    .setColor("#ffff00")
    .addField("TMP ID", body.response.id, true)
    .addField("Username", body.response.name, true)
    .addField("Join Date", body.response.joinDate, true)
    .addField("Steam ID", body.response.steamID64, true)
    .addField("Admin", body.response.permissions.isGameAdmin, true);
    message.channel.send(embed)
  } catch(error) {
    var embed = new Discord.RichEmbed()
    .setTitle("Truckers MP user info")
    .setDescription("this is information pulled from Truckers MP and Steam")
    .setImage(body.response.avatar)
    .setThumbnailURL("https://pbs.twimg.com/profile_images/1017606928413929472/tSa1hsSe_400x400.jpg")
    .setColor("#ffff00")
    .addField("TMP ID", body.response.id, true)
    .addField("Username", body.response.name, true)
    .addField("Join Date", body.response.joinDate, true)
    .addField("Steam ID", body.response.steamID64, true)
    .addField("Admin", "we encountered an error here", true);
    message.channel.send(embed)
  }
}
if(uid === null) {
  message.channel.send("You must provide either a steam ID or a Truckers Mp ID")
}
}

module.exports.help = {
  name:"tmp-info"
}
