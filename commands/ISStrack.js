const superagent = require('superagent')
const Discord = require('discord.js')

module.exports.run = async (client, message, args) => {
  console.log("running")
  var url = "https://api.wheretheiss.at/v1/satellites/25544"
  var {body} = await superagent.get(url)
  var issTracker = new Discord.RichEmbed()
  .setTitle("ISS Location")
  .setURL(`https://maps.google.com/maps?q=${body.latitude},${body.longitude}`)
  .setThumbnail("https://openclipart.org/image/2400px/svg_to_png/289012/ISS_closeup.png")
  .addField("Latitude", body.latitude+"°", true)
  .addField("Longitude", body.longitude+"°", true)
  .addField("Altitude", body.altitude+" km", true)
  .addField("Velocity", body.velocity+" km/h", true)
  .addField("Visibility", body.visibility, true)
  .addField("NORAD ID", body.id, true)
  var {body} = await superagent.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${body.latitude}&lon=${body.longitude}&addressdetails=1`)
  if(body.display_name === undefined) {
     issTracker.addField("Location", "The Ocean", true)
     .setColor(0x103A9F)
   } else {
     issTracker.addField("Location", body.display_name, true)
     .setColor(0x00cc00)
   }
  message.channel.send(issTracker)
}
module.exports.help = {
  name:"iss"
}
