const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
 let image = args[0]
 let embed = new Discord.RichEmbed()
 .setTitle("click here")
 .setURL(args[0])
 .setImage(image)
 await message.delete()
 message.channel.send(embed)
}

module.exports.help = {
  name:"enlarge"
}
