const Discord = require('discord.js');
const fs = require('fs')
module.exports.run = (client,message,args) => {
  if(message.member.hasPermission('MANAGE_MESSAGES')){
    if(message.channel.name.includes('ticket-')){
      var cnl = client.channels.get(message.channel.id)
      cnl.delete()
    } else {
      message.reply('i cannot close a ticket unless you run the command in that channel (this will however change soon :wink:')
    }
  } else return;


}

module.exports.help = {
  name:'close',
  description:'Closes a new Support Ticket',
  perms:'admin'
}
