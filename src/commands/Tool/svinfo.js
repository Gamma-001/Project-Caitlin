const { Command } = require('klasa');
const { fetchGuildIcon, fetchAvatar } = require('../../util/util.js');

module.exports = class extends Command{
   constructor(...args) {
      super(...args, {
         name: 'svinfo',
         enabled: true,
         description: 'Fetch the information of your server',
         runIn: ['text', 'group'],
         cooldown: 20
      });
   }
   async run(msg, [...args]) {
      const guild = msg.guild;
      const created_at = guild.createdAt;
      let online = 0;
      for(let member of msg.guild.members.values()) {
         if(member.presence.status !== 'offline')
            online += 1;
      };
      let roles = new Array();
      for(let role of msg.guild.roles.values()) {
         if(role.name.search('everyone') === -1 && roles.length <= 50) {
            let botCount = 0;
            let total = 0;
            for(let member of role.members.values()) {
               if(member.user.bot) botCount += 1;
               total += 1;
            }
            if(botCount !== total || total == 0)
               roles.push(`<@&${role.id}>`);
         }
      }
      let channels = 0;
      for(let channel of msg.guild.channels.values()) {
         if(channel.type !== 'category') channels += 1;
      }
      let desc = `\`Created at      : \` ${created_at.toString().split(' ').reverse().splice(5).reverse().join(' ')} ${created_at.toString().match(/\d\d:\d\d:\d\d/)}`+'\n';
         desc += `\`Owner           : \` ${guild.owner}`+'\n';
         desc += `\`Region          : \` ${guild.region}`+'\n'
         desc += `\`System channel  : \` ${guild.systemChannel.name}`+'\n';
         desc += `\`Total members   : \` ${guild.memberCount}`+'\n';
         desc += `\`Total online    : \` ${online}`+'\n';
         desc += `\`Total channels  : \` ${channels}`;
      const Embed = {
         color: 0x046307,
         author: {
            name : `${guild.name} (id:${guild.id})`,
         },
         thumbnail: {
            url : fetchGuildIcon(guild, 256)
         },
         description : desc,
         timestamp : new Date(),
         footer: {
            text     : `Requested by ${msg.author.username}`,
            icon_url : fetchAvatar(msg.author, 256)
         },
         fields: [
            {
               name : 'Available roles',
               value: roles.join(', ')
            }
         ]
      };
      return msg.channel.send({embed: Embed});
   }
}