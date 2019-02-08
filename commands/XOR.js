const Discord = require("discord.js");
const synaptic = require('synaptic');

module.exports.run = async (bot, message, args) => {


const { Layer, Network } = synaptic;
 var  inputLayer = new Layer(2);
 var  hiddenLayer = new Layer(3);
 var  outputLayer = new Layer(1);

 inputLayer.project(hiddenLayer);
 hiddenLayer.project(outputLayer);
 var  myNetwork = new Network({
  input: inputLayer,
  hidden: [hiddenLayer],
  output: outputLayer
 });

 // train the network - learn XOR
 var  learningRate = .3;
 for (var  i = 0; i < 20000; i++) {
   // 0,0 => 0
   myNetwork.activate([0,0]);
   myNetwork.propagate(learningRate, [0]);
   // 0,1 => 1
   myNetwork.activate([0,1]);
   myNetwork.propagate(learningRate, [1]);
   // 1,0 => 1
   myNetwork.activate([1,0]);
   myNetwork.propagate(learningRate, [1]);
   // 1,1 => 0
   myNetwork.activate([1,1]);
   myNetwork.propagate(learningRate, [0]);
 }

 //Test it out in the console
 var XORembed = new Discord.RichEmbed()
 .setTitle("XOR equation solved by neural network")
 .setColor("RANDOM")
 .addField("value close to 0", myNetwork.activate([0,0])) //Expect value close to 0
 .addField("value close to 1", myNetwork.activate([0,1])) //Expect value close to 1
 .addField("value close to 1", myNetwork.activate([1,0])) //Expect value close to 1
 .addField("value close to 0", myNetwork.activate([1,1])); // Expect value close to 0
 message.channel.send(XORembed);
 console.log(`${message.author.username}`)
}

module.exports.help = {
  name:"xor"
}
