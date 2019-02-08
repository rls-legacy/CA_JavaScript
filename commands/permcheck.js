exports.run = async (bot, message, args) => {
    let Discord = require("discord.js")
    let string = '```md\n';
    let embed = new Discord.MessageEmbed()
       .setTitle(`Permissions for ${user.user.tag}`)
       .setDescription(finalStr)
       .setColor("RANDOM")
    let user = bot.id
    let strong = message.channel.permissionsFor(user)
    await strong.forEach(function(strong){
      try {
        embed.addField("i have:", strong)
      } catch(error) {
        return
      }
    })
    let finalStr = strong + "```"

    message.channel.send(embed)
}
module.exports.help = {
    name: "checkperms"
}
