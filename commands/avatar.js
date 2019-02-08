const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  var user = message.mentions.users.first(); // Mentioned user
  var image = user.displayAvatarURL; // Get image URL
  var aembed = new Discord.RichEmbed()
  .setAuthor(`${user.username}#${user.discriminator}`) // Set author
  .setColor("RANDOM") // Set color (If you don't have ideas or preference, use RANDOM for random colors)
  .setImage(image) // Set image in embed
  message.channel.send(aembed); // Send embed
}

module.exports.help = {
  name:"avatar"
}
