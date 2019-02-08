const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    let bicon = bot.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
    .setDescription("Bot Information")
    .setColor("#15f153")
    .setThumbnail(bicon)
    .addField("Bot Name", bot.user.username, true)
    .addField("Created On", bot.user.createdAt, true)
    .addField("server count", bot.guilds.size, true)
    .addField("total users", bot.users.size, true);

    message.channel.send(botembed);
}

module.exports.help = {
  name:"info"
}
