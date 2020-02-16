const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'kick',
         enabled: true,
         description: 'Kick a member out of the server',
         runIn: ['text', 'group'],
         cooldown: 30
      });
   } 
   async run(msg, [...args]) {
      try {
         let usr = msg.mentions.members.first();
         let name = msg.mentions.users.first().username;
         if(!usr.kickable) 
            return msg.channel.send('Lacking permissions to kick the member.');
         else if(!msg.member.hasPermission('KICK_MEMBERS')) 
            return msg.channel.send('You can\'t kick this member.');
         else {
            let reason = msg.content.split(' ').slice(2).join(' ');
            return usr.kick(reason).then(user => {
               msg.channel.send(`User **${name}** has been kicked out of the server by **${msg.author.tag}**`);
               if(reason !== '') msg.channel.send(`**Reason: ** _${reason}_`);
            });
         }
      } catch(err) {
         return msg.channel.send('An error occured');
      }
   }
};