const { Command } = require('klasa');
const { MessageAttachment } = require('discord.js');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'wdance',
         enabled: true,
         runIn: ['text', 'group'],
         description: 'dance with someone',
         cooldown: 10
      });
   }
   async run(msg, [...args]) {
      let usr = msg.author;
      if(msg.mentions.users.first() && (msg.mentions.users.first().id||0) !== msg.author.id) {
         usr = msg.mentions.users.first();
         let att = new MessageAttachment('./src/gifs/Dances/dance_couple'+Math.ceil(Math.random()*5)+'.gif');
         return msg.channel.send(`${msg.author} is dancing with ${usr}`, att);
      } else {
         let att = new MessageAttachment('./src/gifs/Dances/dance_alone'+Math.ceil(Math.random()*5)+'.gif');
         return msg.channel.send(`${msg.author} is dancing all alone, someone wanna join?`, att);
      }
   }
};