const Discord = require("discord.js");
const ms = require("ms");

module.exports.run = async (bot, message, args) => {
  var toSend = args.slice(1)
  var remindr = toSend.join(' ')
  var timerTime = args[0]
  var toRemind = message.author
  message.channel.send(`i will remind you in ${timerTime}`)
  setTimeout(function(){
    var hexCode = '#'+Math.floor(Math.random()*16777215).toString(16);
    var embed = new Discord.RichEmbed()
    .setTitle("**BEEP BEEP BEEP**")
    .setColor(hexCode)
    .setDescription(`I am reminding you: ${remindr}`)
    .setFooter(`To set another timer, use Nova:remind <time> <action>`)
    .addField(`Time:`, `${timerTime}`)
    message.reply(embed)
  }, ms(timerTime));
}

module.exports.help = {
  name:"remind"
}
