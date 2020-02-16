const { Command } = require('klasa');
const { MessageAttachment } = require('discord.js');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'emote',
         enabled: true,
         description: 'Fetch the original image of an emote',
         runIn: ['text', 'group'],
         cooldown: 5
      });
   }
   async run(msg, [...args]) {
      let emote = msg.content.match(/:(\d)+\>/gi);
      if(emote) {
         emote = emote[0].match(/\d+/gi)[0];
         let att = new MessageAttachment('https://cdn.discordapp.com/emojis/'+emote+'.png');
         return msg.channel.send(att).catch(err=>console.log('Error!'));
      }
      else {
         return msg.channel.send('No emoji detected or URL not available');
      }
   }
};