const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'love',
         enabled: true,
         description: 'Try a lovemeter',
         runIn : ['text', 'group'],
         cooldown: 10
      });
   }
   async run(msg, [...args]) {
      let user1 = msg.member;
      let user2 = msg.mentions.members.first();
      const love = Math.round(Math.random()*1000)/10;
      let res = '**Result:** ';

      if(!user2)
         return msg.reply('You need to mention a valid user');
      else if(user2.id === user1.id)
         return msg.reply('You need to mention a user other than yourself');

      if(love >= 90) res += 'Made for each other';
      else if(love >= 70) res += 'Sufficient enough';
      else if(love >= 40) res += 'Not bad';
      else res += 'Better luck next time';

      let desc = `**${user1.user.tag}**\n**${user2.user.tag}**\n\n${love}% \|`;
      for(let i = 0;i < Math.floor(love)-5; i += 5) {
         desc += String.fromCharCode(9608);
      }
      for(let i = Math.floor(love); i < 100; i += 5) {
         desc += String.fromCharCode(9617);
      }

      desc += '\|\n\n'+res;
      const Embed = {
         color: 0xb03060,
         thumbnail: {
            url : 'https://www.astrologygains.com/articles_uploads/Love%20Meter.jpg'
         },
         author: {
            name : `❤️Lovemeter❤️`
         },
         description: desc
      };
      return msg.channel.send({embed: Embed});
   }
};