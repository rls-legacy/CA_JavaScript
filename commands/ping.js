const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    const embed = new Discord.RichEmbed()
   .setTitle("Nova: Ping")
   .setDescription("Pong! :ping_pong:\nTime taken: Please wait...")
   .setFooter("Requested by: "+message.author.tag)
   .setColor("#ffff00")
   .setTimestamp()
   message.channel.send(embed).then(m => {
   const embed = new Discord.RichEmbed()
   .setTitle("Nova: Ping")
   .setDescription("Pong! :ping_pong:\nTime taken: "+(new Date().getTime() - message.createdTimestamp)+" ms")
   .setFooter("Requested by: "+message.author.tag)
   .setColor("#ffff00")
   .setTimestamp()
   m.edit(embed)
  })
}

module.exports.help = {
  name:"ping"
}
