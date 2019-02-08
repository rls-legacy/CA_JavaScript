const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const config = require('./data.js');
client.login(config.token);
client.on('ready', ()=>{
  console.log(`Capt'n Amelia is now ready for ${client.guilds.size} servers`)
})

client.on('message', (message)=>{
  if(message.author.bot === true){
    return;
  } else {
    var prefix = config.prefix
    var messageArray = message.content.split(' ')
    if(messageArray.includes(prefix)){
      var cmd = messageArray[0].slice(prefix.length)
      var args = messageArray.slice(1)
      console.log("Cmd : " + cmd + " Args : " + args)
    } else {
      return;
    }
  }
})
