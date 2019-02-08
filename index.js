const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const config = require('./data.js');
client.login(config.token);
boot()
client.on('ready', ()=>{
  console.log(`Capt'n Amelia is now ready for ${client.guilds.size} servers`)
})

client.on('message', async(message)=>{
  if(message.author.bot === true){
    return;
  } else {
    var prefix = config.prefix
    var messageArray = message.content.split(' ')
    if(messageArray.includes(prefix)){
      var cmd = messageArray[1]
      var args = messageArray.slice(2)
      var commandfile = client.commands.get(cmd);
      if(commandfile) {
        await commandfile.run(client, message, args)
      } else {
        return;
      }
    } else {
      return;
    }
  }
})
function boot() {
  client.commands = new Discord.Collection();
  fs.readdir("./commands/", (err, files) => {

    if(err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0){
      console.log("Failed to load commands");
      console.log("--------------------------------------")
      return;
    }
    console.log(`[SYSTEM] Loading ${jsfile.length} commands`)
  	station_count = jsfile.length
    console.log(">>>")
    jsfile.forEach((f, i) =>{
      let props = require(`./commands/${f}`);
			console.log("Loading command : "+props.help.name)
			client.commands.set(props.help.name, props);
    });
  })
}
