const { Command } = require('klasa');
const { MessageAttachment } = require('discord.js');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'wpat',
         enabled: true,
         runIn: ['text', 'group'],
         description: 'Pat someone with a weeb gif',
         cooldown: 10
      });
   }
   async run(msg, [...args]) {
      let usr = msg.author;
         if(msg.mentions.users.first() && (msg.mentions.users.first().id||0) !== msg.author.id) {
         usr = msg.mentions.users.first();
         let att = new MessageAttachment('./src/gifs/Pats/pat'+Math.ceil(Math.random()*9)+'.gif');
         return msg.channel.send(`${usr} You\'ve been patted by ${msg.author}`, att);
      } else {
         return msg.channel.send(`${msg.author} You need to mention a valid user except yourself!`);
      }
   }
};