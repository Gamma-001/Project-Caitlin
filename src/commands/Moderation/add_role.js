const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         aliases: ['addr'],
         description: 'Create a new role',
         runIn: ['text'],
         usage: '<name:string> <color:string> [...]',
         usageDelim: ', ',
         cooldown: 5
      });
   }
   async run(message, [name, ...color]) {
      const client = message.guild.member(this.client.user);
      const user = message.member;
      if(!client.hasPermission('MANAGE_ROLES'))
         return message.channel.send('I do not have the permissions to manage roles, try giving me first');
      if(!user.hasPermission('MANAGE_ROLES'))
         return message.channel.send('You are lacking the permission to manage roles');
      color = color.join(', ');
      color = color.toUpperCase();
      if(color.match(/rgb/gi))
         color = color.match(/\d+/g).map(x => Number(x));
      if(typeof(color) === 'string')
         color = color.replace(/[ ]+/g, '');
      const emojiData = {
         name: name,
         color: color
      };
      return message.guild.roles.create({data: emojiData}).then(role => {
         return message.channel.send(`Created new role **${role.name}** with id **${role.id}**`);
      }).catch(err => {
         console.log(err);
         let msg  = 'An error occured while trying to create the role';
         return message.channel.send(msg);
      })
   }
};