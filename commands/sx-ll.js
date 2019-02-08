const Discord = require('discord.js');
const superagent = require("superagent");
module.exports.run = async (bot, message, args) => {
  var {body} = await superagent.get("https://api.spacexdata.com/v2/launches/latest")
  var obj = {body}
  data = obj.body
  var NLEmbed = new Discord.RichEmbed()
  .setTitle(`Next SpaceX launch (#${data.flight_number})`)
  .setDescription(`information for SpaceX flight number ${data.flight_number}`)
  .setColor("#005288")
  .addField("Launch Date", `${data.launch_date_utc}`, false)
  .addField("Rocket Type", `${data.rocket.rocket_name}`, true)
  .addField("Mission Name", `${data.mission_name}`, true)
  .addField("Launch Site", `${data.launch_site.site_name_long}`, true)
  message.channel.send(NLEmbed)
};

module.exports.help = {
  name: "sx-ll"
}
