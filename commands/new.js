const Discord = require('discord.js');
const fs = require('fs')
module.exports.run = (client,message,args) => {
  var tNum = Math.floor(Math.random() * (100 - 1) + 20)
  message.channel.send(`Your ticket number is: ${tNum}`)
  var channel = message.guild.createChannel(`ticket-${tNum}`, 'text').then(channel => {
    channel.setParent('526385026993094662')
    channel.setTopic(`Support ticket for <@${message.author.id}>`)

    channel.overwritePermissions(message.author, )
    channel.send(`<@&526397130173054977>, please support this kind person.`)
    channel.send(`<@${message.author.id}>, please explain your problem as clearly as possible so we can help you faster.`)
  }).catch(console.error);


}

module.exports.help = {
  name:'...',
  description:'Creates a new Support Ticket',
  perms:'none'
}
