const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'purge',
         enabled: true,
         description: 'Delete multiple messages from a channel',
         runIn: ['text', 'group'],
         cooldown: 10
      });
   }
   async run(msg, [...args]) {
      let number = Number(msg.content.match(/\d+/g)[0]);
      if(msg.member.hasPermission('MANAGE_MESSAGES') && number > 2 && number < 100) {
         return msg.channel.bulkDelete(number).catch(err=>msg.channel.send('An error occured!',{code:'xl'}));
      }
      else if(number < 2 || number > 100) 
         return msg.channel.send('Please specify a number between 2 and 100 [exclusive]');
      else 
         return msg.channel.send('Sorry! You don\'t have the permission to manage messages.');
   }
};