const { Command } = require('klasa');
const { MessageAttachment } = require('discord.js');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'wslap',
         enabled: true,
         runIn: ['text', 'group'],
         description: 'Slap someone with a weeb gif',
         cooldown: 10
      });
   }
   async run(msg, [...args]) {
      let usr = msg.author;
      if(msg.mentions.users.first() && (msg.mentions.users.first().id||0) !== msg.author.id) {
         usr = msg.mentions.users.first();
         let slap = new MessageAttachment(`./src/gifs/Slaps/slap${Math.ceil(Math.random()*8)}.gif`);
         return msg.channel.send(`${msg.author} Slapped ${usr}`, slap);
      }else {
         let slap = new MessageAttachment('./src/gifs/Slaps/slap0.gif');
         return msg.channel.send(`${msg.author} may your soul rest in peace`, slap);
      }
   }
};