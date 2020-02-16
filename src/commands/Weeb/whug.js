const { Command } = require('klasa');
const { MessageAttachment } = require('discord.js');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'whug',
         enabled: true,
         runIn: ['text', 'group'],
         description: 'Give someone a hug with a weeb gif',
         cooldown: 10
      });
   }
   async run(msg, [...args]) {
      let att = new MessageAttachment('./src/gifs/Hugs/hug'+Math.ceil(Math.random()*9)+'.gif');
      let usr = msg.author;
      if(msg.mentions.users.first()) {
         usr = msg.mentions.users.first();
         return msg.channel.send(`${msg.author} hugged ${usr}`, att);
      }
      else {
         return msg.channel.send(`${msg.author}, You need to mention a valid user`);
      }
   }
};