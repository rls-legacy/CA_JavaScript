const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  try{
    var hexCode = '#'+Math.floor(Math.random()*16777215).toString(16);
    const color1 = new Discord.RichEmbed()
    .setTitle("Here is your color")
    .setDescription(`<-- this is ${hexCode}`)
    .setColor(hexCode);
    message.channel.send(color1);
  }catch (err){
    console.log(err)
    message.channel.send("i have encountered an error, please try again")
  }
}

module.exports.help = {
  name:"random-hex"
}
