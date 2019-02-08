const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const config = require('./data.js');
client.login(config.token);
client.on('ready', ()=>{
  console.log('Capt\'n Amelia is now ready')
})
