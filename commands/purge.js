const Discord = require("discord.js");
const owner = 180639594017062912
module.exports.run = async (bot, message, args) => {
  if(!message.member.hasPermission("MANAGE_MESSAGES")) {
    message.channel.send("you dont have the perms SUCKA")
  }
  if(!args[0]) return message.channel.send("oof");
  message.channel.bulkDelete(args[0]).then(() => {
  message.channel.send(`Cleared ${args[0]} messages.`).then(msg => msg.delete(5000));
  });
  if(owner === message.author.id){
    message.channel.bulkDelete(args[0]).then(() => {
    message.channel.send(`Cleared ${args[0]} messages.`).then(msg => msg.delete(5000));
    });
  } else {
    return;
  }
  const logs = bot.channels.get('477841252763697154');
  var log = new Discord.RichEmbed()
  .setTitle("log")
  .setDescription("~purge~")
  .addField("Total Purged", args[0])
  .addField("Channel", message.channel.name)
  .addField("Server", message.guild.name);
  await logging.send(log);
}

module.exports.help = {
  name:"purge"
}
