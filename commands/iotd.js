const Discord = require("discord.js");
const superagent = require("superagent")
module.exports.run = async (bot, message, args) => {
  var url = "https://api.nasa.gov/planetary/apod?api_key=FYZKx6A5lNP5689ocisVrpjprS6usPz9d8BEPbR7"
  var {body} = await superagent.get(url)
  var hexCode = '#'+Math.floor(Math.random()*16777215).toString(16);
  var iotd = new Discord.RichEmbed()
  .setTitle("Nasa Image of the Day")
  .setURL(body.url)
  .setColor(hexCode)
  .setImage(body.url)
  .addField("Title", body.title)
  .setFooter(`copyright: ${body.copyright}`)
  message.channel.send(iotd)
}

module.exports.help = {
  name:"iotd"
}
