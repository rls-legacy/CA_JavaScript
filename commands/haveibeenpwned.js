const superagent = require("superagent");
const Discord = require("discord.js");
exports.run = async (client, message, args, level) => {
    await message.delete(300);
    var headers = {

}
    var {body} = await superagent.get(`https://haveibeenpwned.com/api/v2/breachedaccount/${args[0]}`, JSON.stringify(headers)).set("User-Agent","capt'n Amelia")
      .catch(err => {
        message.channel.send(`Woops, encountering some trouble right now`)
        console.log(err)
      });

    let out = `Oh NO! breaches found for: ${args[0]}`;
    let po = 0;
    const format = body.forEach(i => {
        po++;
        out += `\n${po}.   ${i.Name}   breached on:   ${i.BreachDate}`
    })
    message.author.send(out);
};
module.exports.help = {
  name:"pwn",
  description:"check if you have been pwned"
}
//maam pwn tom.b.2k2@gmail.com
