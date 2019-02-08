const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

    try {

      var emote_count = 0

      message.guild.emojis.array().forEach(emoji => {
        emote_count ++
      });
      let ban_count = 0
      let bannedUsers = await message.guild.fetchBans();
      bannedUsers = bannedUsers.map(user => user.username);
      for (let i = 0; i < bannedUsers.length; i++) {
        ban_count ++
      }

      let rolesmsg = [];
      let index = 0;
      rolesmsg[index] = "";

      message.guild.roles.array().forEach(role => {
          rolesmsg[index] += role.name;
          for (let i = role.name.length; i < 25; i++) {
          rolesmsg[index] += " ";
          } "\n";

          if (rolesmsg[index].length > 1500) {
              index++;
              rolesmsg[index] = "";
          }
      });
        let sicon = message.guild.iconURL;
        let serverembed = new Discord.RichEmbed()
        .setDescription("Server Information")
        .setColor("#ffff00")
        .setThumbnail(sicon)
        .addField("Server Name", message.guild.name)
        .addField("Created On", message.guild.createdAt)
        .addField("Guild Id", message.guild.id)
        .addField("Acronym", message.guild.nameAcronym)
        .addField("Verification Level", message.guild.verificationLevel)
        .addField("AFK Channel", message.guild.afkChannelID + " or " + message.guild.afkChannel)
        .addField("Total Members", message.guild.memberCount)
        .addField("Custom Emojis", emote_count)
        .addField("Server Id", message.guild.id)
        .addField("Server Owner", message.guild.owner)
        .addField("Server Region", message.guild.region)
        .addField("Roles", rolesmsg)
        .addField("Ban list", ban_count);

      message.channel.send(serverembed);
    }
    catch(err) {
      var emote_count = 0

      message.guild.emojis.array().forEach(emoji => {
        emote_count ++
      });

      let rolesmsg = [];
      let index = 0;
      rolesmsg[index] = "";

      message.guild.roles.array().forEach(role => {
          rolesmsg[index] += role.name;
          for (let i = role.name.length; i < 25; i++) {
          rolesmsg[index] += " ";
          } "\n";

          if (rolesmsg[index].length > 1500) {
              index++;
              rolesmsg[index] = "";
          }
      });
        let sicon = message.guild.iconURL;
        let serverembed = new Discord.RichEmbed()
        .setDescription("Server Information")
        .setColor("#ffff00")
        .setThumbnail(sicon)
        .addField("Server Name", message.guild.name)
        .addField("Created On", message.guild.createdAt)
        .addField("Guild Id", message.guild.id)
        .addField("Acronym", message.guild.nameAcronym)
        .addField("Verification Level", message.guild.verificationLevel)
        .addField("AFK Channel", message.guild.afkChannelID + " or " + message.guild.afkChannel)
        .addField("Total Members", message.guild.memberCount)
        .addField("Custom Emojis", emote_count)
        .addField("Server Id", message.guild.id)
        .addField("Server Owner", message.guild.owner)
        .addField("Server Region", message.guild.region)
        .addField("Roles", rolesmsg);

        message.channel.send(serverembed);
    };
}
module.exports.help = {
  name:"serverinfo"
}
