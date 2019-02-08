const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  const server = bot.channels.get(args[0])
  var toSend = args.slice(1)
  var massage = toSend.join(' ')
  var hexCode = '#'+Math.floor(Math.random()*16777215).toString(16);
  var embed = new Discord.RichEmbed()
  .setTitle("Ring Ring")
  .setColor(hexCode)
  .setDescription(`you have received a message from ${message.author.username}`)
  .addField("```MESSAGE```", "```"+massage+"```")
  .setFooter(`To send a reply, use Nova:ring ${message.channel.id} and the message (the color of this embed is ${hexCode})`)
  .addField("```Sent From```", "```" + message.channel.name + " in " + message.guild.name + "```")
  await server.send(embed)
  message.channel.send(`successfully sent message to ${server.name}`)
}

module.exports.help = {
  name:"ring"
}
