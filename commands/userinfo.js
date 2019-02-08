const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  var iUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  var colorofembed = args[1]
  var finalcolor = `#ffff00`
  const UserInfo1 = new Discord.RichEmbed()
  .setAuthor(iUser.user.username) //Heading With Username & Their Avatar
  .setTitle('User Info')
  .setColor(finalcolor)
  .addField('Bot', iUser.user.bot, true) //Returns True If Message Author = Bot || False If Message Author not Bot.
  .addField('Created At', iUser.user.createdAt, false) //The time the user was created || .createdTimestamp - The timestamp the user was created at
  .addField('Discrim', iUser.user.discriminator, true) //A discriminator/tag based on username for the user Ex:- 0001
  .addField('ID', iUser.user.id) //The ID of the User/author
  .addField('Deaf', iUser.user.deaf)
  .addField('Display Color Hex', iUser.user.displayHexColor)
  .addField('Kickable (by the bot)', iUser.user.kickable)
  .addField('Bannable', iUser.user.bannable)
  .addField('Last Message', iUser.user.lastMessage)
  .addField('Muted', iUser.user.muted)
  .addField('Presence', iUser.user.presence)
  .addField('Roles', iUser.user.roles)
  .addField('Permissions', iUser.user.permissions)
  .addField('Tag', iUser.user.tag) //The Discord "tag" for this user || Ex:- Sai Chinna#6718
  .addField('Username', iUser.user.username) //The username of the user || Ex:- Sai Chinna
  .addField('Nick Name', iUser.guild.member(iUser).displayName) //Nick Name In That (message sent) server || Define target as message Author Ex:- var target = message.author; || Add This Line in Top
  .setTimestamp(); //The timestamp of this embed
  message.channel.send(UserInfo1);
}

module.exports.help = {
  name:"uinfo"
}
