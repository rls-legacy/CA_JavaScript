const Discord = require("discord.js");
const owner = 180639594017062912
const owner2 = 464050769453252609
module.exports.run = async (bot, message, args) => {
  if(message.author.id === owner || message.author.id === owner2){
    message.channel.send("i am now leaving")
    await guild.leave()
  }
}

module.exports.help = {
  name:"leave"
}
