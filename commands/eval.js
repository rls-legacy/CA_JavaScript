const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
  if(message.author.id !== '180639594017062912') return;
  const code = args.join(' ');
  var evaled = eval(code);

  try {
    if (typeof evaled !== "string")
    var success = new Discord.RichEmbed()
    .setTitle("SUCCESS!")
    .setColor("#00ff00")
    .addField("input", "```js\n" + code + "```")
    .addField("output", "```js\n"+evaled+"```")
    message.channel.send(success);
  }catch(e) {
    console.error("encountered an error while evaluating");
    var error = new Discord.RichEmbed()
    .setTitle("ERROR!")
    .setColor("#ff0000")
    .addField("input", "```js\n" + code + "```")
    .addField("output", "```js\n"+e+"```")
    message.channel.send(error)
  };
}
module.exports.help = {
  name:"eval",
  description:"evaluate code on the go"
}
