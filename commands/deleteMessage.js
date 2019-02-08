const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  let mID = args[0]
  await bot.messages.get(mID)
  mID.delete()
  message.channel.send(`Successfuly deleted mesage with ID: ${mID}`)
}

module.exports.help = {
  name:"prune"
}
