const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  try{
    var colorofembed1 = args[0]
    var finalcolo1r = `0x${colorofembed1}`
    const color1 = new Discord.RichEmbed()
    .setTitle("Here is your color")
    .setDescription(`<-- this is ${colorofembed1}`)
    .setColor(finalcolo1r);
    message.channel.send(color1);
  }catch (err){
    message.channel.send("i have encountered an error, please try again")
  }
}

module.exports.help = {
  name:"hex"
}
