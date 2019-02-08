const Discord = require("discord.js");
const owner = "180639594017062912"
module.exports.run = async (bot, message, args) => {
  const logger = bot.channels.get('477841252763697154');
  if(message.author.id !== owner) return;
  const code = args.split(' ').join(',');
  var evaled = eval(code);

  try {
    if (typeof evaled !== "string")
    var success = new Discord.RichEmbed()
    .setTitle("SUCCESS!")
    .setColor("#00ff00")
    .addField("input", "```" + code + "```")
    .addField("output", "```"+evaled+"```", {code:"xl"})
    message.channel.send(success);
    logger.send(success)
  }catch(e) {
    console.error("encountered an error while evaluating");
    var error = new Discord.RichEmbed()
    .setTitle("ERROR!")
    .setColor("#00ff00")
    .addField("input", "```" + code + "```")
    .addField("output", "```ERROR```" + `${e}`, {code:"xl"})
    message.channel.send(error)
    logger.send(error)
  };
}
module.exports.help = {
  name:"eval"
}
