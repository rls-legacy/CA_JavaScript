const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    let invites = await message.guild.fetchInvites().catch(error => {
        return message.channel.send('Sorry, I don\'t have the proper permissions to view invites!');
    });
    const embed = new Discord.RichEmbed()
      .setTitle(`**INVITE LIST**`)
      .setColor(0xCB5A5E)
      .setDescription(`Total Invites: ${invites.size}`)
      .setTimestamp();


    let possibleinvites = [];

    invites.forEach(function(invites) {
      try {
        embed.addField(invites, "Made By: " + invites.inviter.tag + ". Uses: " + invites.uses)
      } catch(error) {
        return
      }
    })

    message.channel.send(embed);
}

module.exports.help = {
    name: "invites"
}
