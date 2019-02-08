const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  let newName = args[0] + " " + args[1] + " " + args[2]
  let oldName = message.guild.member(message.author).displayName
  try{
    message.member.setNickname(newName)
    .catch(error);
    let Uname = new Discord.RichEmbed()
    .setTitle("Username Changed")
    .setDescription(`${newName}, has changed their nickname`)
    .addField("Before", oldName)
    .addField("After", newName);
    message.channel.send(Uname)
  } catch(error){
    message.channel.send("i am missing permissions")
  }
}
module.exports.help = {
  name:"nick"
}
