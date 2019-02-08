const Discord = require("discord.js");
const errors = require("../utils/errors.js");

module.exports.run = async (client, message, args) => {

    if(!message.member.hasPermission("KICK_MEMBERS")) {
      message.reply('only admins can kick folk')
    }
    if(args[0] == "help"){
      message.reply("Usage: !kick <user> <reason>");
      return;
    }
    let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kUser) return errors.cantfindUser(message.channel);
    let kReason = args.join(" ").slice(22);
    if(kUser.hasPermission("MANAGE_MESSAGES")) {
      message.reply('sod off, that user is an admin, i wont be kicking them any time soon.')
    }
    kUser.kick(kReason);
}

module.exports.help = {
  name:"kick",
  category:'admin'
}
