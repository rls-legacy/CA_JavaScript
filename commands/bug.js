const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  var args = message.content.split(' ').slice(1).join(' ');
  message.delete();
  if (args.length < 1) {
      return message.channel.send(`You must give me something to report first ${message.author}`);
  }
  var guild = message.guild;
  const cnl = bot.channels.get('474885350125207564');
  message.channel.send(`Hey, ${message.author}, we got your report! We will reply soon as possible! Here is the full ticket:`);
  const embed2 = new Discord.RichEmbed()
      .setAuthor(`Ticket from ${message.author.tag}`, message.author.displayAvatarURL)
      .addField('Ticket:', `**Tickets's Author:** ${message.author.tag}\n**Server:** ${guild.name}\n**Full ticket:** ${args}`)
      .setThumbnail(message.author.displayAvatarURL)
      .setColor("#ffff00");
  message.channel.send(embed2);
  message.delete(10000);
  const embed = new Discord.RichEmbed()
      .setAuthor(`Ticket from ${message.author.tag}`, message.author.displayAvatarURL)
      .addField('Ticket:', `**Report's Author:** ${message.author.tag}\n**Server:** ${guild.name}\n**Full report:** ${args}`)
      .setThumbnail(message.author.displayAvatarURL)
      .setColor("#ffff00");
  cnl.send(embed)
      .catch(e => console.log(e))
console.log("filed bug report")
}

module.exports.help = {
  name:"bug"
}
