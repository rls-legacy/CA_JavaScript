const Discord = require("discord.js");
const owner = 180639594017062912
var child_process = require('child_process');
module.exports.run = async (bot, message, args) => {
  if(message.author.id === owner){
    child_process.execute("C:/Users/tomb2/Desktop/Nova-bot-replacement/run.bat", function(error, stdout, stderr){
      console.log(stdout)
    });
    message.channel.send("reloading")
  }
}

module.exports.help = {
  name:"reload"
}
