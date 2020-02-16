const { Command } = require('klasa');
const { fetchAvatar } = require('../../util/util.js');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'avatar',
         enabled: true,
         description: 'Fetch the full avatar of a user',
         runIn: ['text', 'group'],
         cooldown: 5
      });
   }
   async run(msg, [...args]) {
      const user = msg.mentions.users.first() || msg.author;
      const Embed = {
         image: {
            url: fetchAvatar(user)
         },
         description: `Avatar of ${user}`,
         footer: {
            text: `Requested by ${msg.author.tag}`
         }
      }
      return msg.channel.send({embed: Embed});
   }
};