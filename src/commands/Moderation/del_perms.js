const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         aliases: ['delpr'],
         runIn: ['text'],
         description: 'Delete a permission from a role',
         usage: '<role:role> <permissions:string> [...]',
         usageDelim: ' ',
         cooldown: 5
      });
   }
   async run(message, [role, ...permissions]) {
      const client = message.guild.member(this.client.user);
      const user = message.member;
      const flags = message.language.get('PERMISSION_FLAGS');
      let allPerms = role.permissions.toArray();
      if(!client.hasPermission('MANAGE_ROLES'))
         return message.channel.send('I do not have the permission to manage roles, try giving me first');
      if(!user.hasPermission('MANAGE_ROLES'))
         return message.channel.send('You are lacking the permission to manage roles');
      permissions = permissions.filter(x => flags.includes(x) && allPerms.includes(x));
      if(!permissions.length)
         return message.channel.send('No valid permission falgs specified');
      allPerms = allPerms.filter(x => !permissions.includes(x));
      return role.setPermissions(allPerms).then(() => {
         return message.channel.send(`Removed ${permissions.length} permissions from ${role}`);
      }).catch(err => {
         console.log(err);
         return message.channel.send(`An error occured while trying to remove permissions from ${role}`);
      });
   }
}