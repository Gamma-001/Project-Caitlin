const { Command } = require('klasa');
const { fetchAvatar } = require('../../util/util.js');
const Util = require('util');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         enabled: true,
         description: 'Fetch the permissions of a user or role in the guild',
         runIn: ['text', 'group'],
         usage: '[User:member|Role:role]',
         cooldown: 10
      });
   }
   async run(message, [User = message.member]) {
      let HAS, name, avatar;
      let user = User.user;
      try {
         avatar = fetchAvatar(user, 512);
      } catch(err) {
         avatar = '';
      }
      this.FLAGS = message.language.get('PERMISSION_FLAGS'); 
      if(User.name) {
         HAS = permission => User.permissions.has(permission);
         name = User.name;
      }
      else {
         HAS = permission => User.hasPermission(permission);
         name = user.tag;
      }
      let perms = '';
      let tmp = '';
      for(let i = 0;i != this.FLAGS.length; i++) {
         tmp = this.FLAGS[i];
         let space = '';
         for(let i = 0;i < 27-tmp.length; i++) space += ' ';
         if(HAS(tmp)) tmp = '☑️ '+tmp+space;
         else tmp = '❌ ' + tmp + space;
         perms += tmp + '\n';
      }
      let Embed = {
         title: `Permissions of ${name}`,
         thumbnail: {
            url: avatar
         },
         description: perms,
         footer: {
            text: `Requested by ${message.author.tag}`
         }
      };
      return message.channel.send({embed: Embed});
   }
};

