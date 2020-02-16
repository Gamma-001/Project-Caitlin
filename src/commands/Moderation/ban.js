const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'ban',
         enabled: true,
         description: 'Ban a member from a server',
         runIn: ['text'],
         cooldown: 10
      });
   }
   async run(msg, [...args]) {
      let member = msg.mentions.members.first();
      let author = msg.member;
      if(!member) {
         return msg.channel.send('No user specified');
      }
      if(!author.hasPermission('BAN_MEMBERS') || !member.bannable) {
         return msg.channel.send('Lacking permission to ban the member');
      }
      let user_tag = member.user.tag;
      let reason = msg.content.split(' ').slice(2);
      return member.ban(reason).then(() => {
         return msg.channel.send(`User **${user_tag}** has been banned from the server by **${author.user.tag}**`)
      }).catch(console.log);
   }
};