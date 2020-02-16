const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'choose',
         enabled: true,
         description: 'Choose between multiple things separated by \',\'',
         runIn: ['text', 'group'],
         cooldown: 5
      });
   }
   async run(msg, [...args]) {
      let chosen = msg.content.split(' ').splice(1).join(' ').split(',');
      let index = Math.floor(Math.random()*chosen.length);
      return msg.channel.send(`${msg.author} I choose ${chosen[index]}`);
   }
};