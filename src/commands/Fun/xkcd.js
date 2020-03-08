const { Command } = require('klasa');
const { MessageAttachment } = require('discord.js');
const urllib = require('urllib');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         description: 'Fetch a random xkcd comic',
         usage: '[index:integer]',
         cooldown: 10,
      });
   }
   async run(message, [index]) {
      if(!index) index = Math.ceil(Math.random()*2277);
      return urllib.request(`https://xkcd.com/${index}/`).then(res => {
         let html = res.data.toString();
         let image = html.match(/<[ ]*img[ ]+src[ ]*=(.*?)(?=>)/gims)[1];
         image = 'https:'+image.split('=')[1].match(/("|')\D+('|")/)[0].replace(/('|")/g, '');
         let att = new MessageAttachment(image);
         return message.channel.send(att);
      }).catch(err => {
         console.log(err);
         return message.channel.send('An error occured, please try again');
      });
   }
};