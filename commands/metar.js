const Discord = require("discord.js");
const superagent = require('superagent');
const METAR = "https://avwx.rest/api/metar/"

module.exports.run = async (bot, message, args) => {
  var code1 = args[0]
  var code = code1.toUpperCase();
  var url = `${METAR}${code}`
  console.log(url)
  var {body} = await superagent.get(url)
  let Membed = new Discord.RichEmbed()
  .setTitle(`METAR info for ${code}`)
  .setDescription("please note this command could be buggy")
  .setColor("#ffff00")
  .addField("Station:", code)
  .addField("Temp:", body.Temperature)
  .addField("Wind Speed:", body["Wind-Speed"])
  .addField("Visibility:", body.Visibility)
  .addField("Flight Rules:", body["Flight-Rules"])
  .addField("Altimiter:", body.Altimeter)
  .addField("Dew Point:", body.Dewpoint);
  message.channel.send(Membed)
}

module.exports.help = {
  name:"metar"
}
