const Discord = require("discord.js");

exports.run = async(client, message, args) => {
    message.delete();

    var savecode = args;
    var test = args.toString();
    var split = test.split(",");

    var language = split[0];
    var code = savecode.join(' ');
    code = code.substring(language.length + 1);

    code = "```" + language + "\n" + code + "\n```";

    message.channel.send(code);
}
module.exports.help = {
  name:"code"
}
