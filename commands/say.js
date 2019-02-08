const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  // makes the bot say something and delete the message. As an example, it's open to anyone to use.
  // To get the "message" itself we join the `args` back into a string with spaces:
  const sayMessage = args.join(" ");
  // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
  message.delete(1).catch(O_o=>{});
  // And we get the bot to say the thing:
  message.channel.send(sayMessage);
  console.log(`${message.user.name}, asked me to say "${sayMessage}" in server: ${message.guild.name}`);
}

module.exports.help = {
  name:"say"
}
