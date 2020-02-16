const { Command } = require('klasa');
const { fetchAvatar } = require('../../util/util.js');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'info',
         enabled: true,
         description: 'Fetch the basic information of a user',
         runIn: ['text'],
         cooldown: 10
      });
   }
   async run(msg, [...args]) {
      let User = msg.author;
      let Member = msg.member;
      if(msg.mentions.users.first()) {
         User = msg.mentions.users.first();
         Member = msg.mentions.members.first();
      }

      const created_at = User.createdAt;
      let game = 'nothing';
      let status = User.presence.status;
      let roles = [];
      for(let role of Member.roles.values()) {
         if(role.name !== '@everyone')
            roles.push(`<@&${role.id}>`);
      }
      if(roles.length == 0) roles = ['none'];
      if(status == 'offline') status = 'invisible/offline';

      if(User.presence.activities[0]) {
         const index = User.presence.activities.length-1;
         const activity = User.presence.activities[index];
         const type = activity.type;
         const name = activity.name;
         let join = '';
         if(type === 'LISTENING') join = 'to';
         else if(type === 'STREAMING') join = 'on';
         game = type[0] + type.toLowerCase().slice(1) + ` ${join} ` + name;
         game = game.replace ('  ', ' ');
         if(type === 'CUSTOM_STATUS') game = activity.state;
      }

      let nick = Member.nickname||User.username;
      let user_info = `**\`Created at     : \`** ${created_at.toString().split(' ').reverse().splice(5).reverse().join(' ')} ${created_at.toString().match(/\d\d:\d\d:\d\d/)}` + '\n';
         user_info += `**\`Current status : \`** ${status}` + '\n';
         user_info += `**\`Current game   : \`** ${game}` + '\n';

      let member_info = `**\`Joined at    : \`** ${Member.joinedAt.toString().split(' ').reverse().splice(5).reverse().join(' ')} ${Member.joinedAt.toString().match(/\d\d:\d\d:\d\d/)}` + '\n';
         member_info += `**\`Nick Name    : \`** ${nick}`+'\n';
         member_info += `**\`Roles        : \`** ${roles.join(', ')}` + '\n';
         member_info += `**\`Highest role : \`** <@&${Member.roles.highest.id}>` + '\n';
      let embedOBJ = {
         color : 0x1287a9,
         author : {
            name : `${User.tag}  (id: ${User.id})`
         },
         thumbnail: {
            url: fetchAvatar(User, 512)
         },
         fields: [
            {
               name : 'Basic user information',
               value: user_info
            }, {
               name : 'Guild member information',
               value: member_info
            }
         ],
         footer: {
            text: `Requested by ${msg.author.tag}`
         }
      };
      return msg.channel.send({embed : embedOBJ});
   }
};
// github:discordjs/discord.js#master