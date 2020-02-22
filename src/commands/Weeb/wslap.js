const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'wslap',
         enabled: true,
         runIn: ['text', 'group'],
         description: 'Slap someone with a weeb gif',
         cooldown: 5
      });
   }
   async run(message, [...args]) {
      const dir = 'https://github.com/Gamma-001/Project-Caitlin/blob/master/src/gifs/Slaps';
      const index = Math.ceil(Math.random()*8);
      const slap = {
         color: 0xff1493,
         image: {
            url: `${dir}/slap${index}.gif?raw=true`
         },
         footer: {
            text: 'Run again for a different gif'
         }
      }
      const user = message.mentions.users.first();
      if(user && (user.id !== message.author.id)) {
         if(user.id !== this.client.user.id) slap.description = `Watch out ${user}, you've been slapped by **${message.author.username}**`;
         else slap.description = `😢 I hope your hand recovers soon`
      }
      else if(user && (user.id === message.author.id))
         slap.description = `You really wanted a slap?`;
      else 
         return message.channel.send('You need to mention a valid user');

      return message.channel.send({embed: slap});
   }
};