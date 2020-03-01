const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         aliases: ['delr'],
         runIn: ['text'],
         description: 'Delete a role or multiple from the guild',
         usage: '<roles:Role> [...]',
         usageDelim: ' ',
         cooldown: 5
      });
   }
   async run(message, [...roles]) {
      const client = message.guild.member(this.client.user);
      const user = message.member;
      if(!client.hasPermission('MANAGE_ROLES'))
         return message.channel.send('I do not have permission to manage roles, try giving me first');
      if(!user.hasPermission('MANAGE_ROLES'))
         return message.channel.send('You are lacking permission to manage roles');
      let count = 0;
      return roles.map(role => {
         role.delete().then(dRole => {
            message.channel.send(`Deleted role **${dRole.name}**`);
         }).catch(err => {
            message.channel.send(`Error deleting role **${role.name}**`);
         });
      });
   }
};