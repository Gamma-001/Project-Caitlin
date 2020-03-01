const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         aliases: ['addpr'],
         runIn: ['text'],
         description: 'Add a permission to a role',
         usage: '<role:Role> <permissions:string> [...]',
         usageDelim: ' ',
         cooldown: 5
      });
   }
   async run(message, [role, ...permissions]) {
      const flags = message.language.get('PERMISSION_FLAGS')
      const client = message.guild.member(this.client.user);
      const user = message.member;
      let allPerms = role.permissions.toArray();
      permissions = permissions.filter(x => flags.includes(x) && !allPerms.includes(x));
      if(!client.hasPermission('MANAGE_ROLES'))
         return message.channel.send('I do not have the permission to manage roles, try giving me first');
      if(!user.hasPermission('MANAGE_ROLES'))
         return message.channel.send('You are lacking the permission to manage roles');
      if(!permissions.length)
         return message.channel.send('No valid permission flags specified');
      allPerms.push(permissions);
      return role.setPermissions(allPerms).then(() => {
         return message.channel.send(`Added ${permissions.length} permissions to ${role}`);
      }).catch(err => {
         console.log(err);
         return message.channel.send(`An error occured while trying to add permissions to ${role}`);
      })
   }
}