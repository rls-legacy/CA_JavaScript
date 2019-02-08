const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  let inviteembed = new Discord.RichEmbed()
  .setURL("https://discordapp.com/oauth2/authorize?client_id=476414571163156480&scope=bot&permissions=2146958591")
  .setTitle("Invite link")
  .setColor("#0645AD");
  message.channel.send(inviteembed)
}

module.exports.help = {
  name:"invite"
}
