const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'wcuddle',
         enabled: true,
         runIn: ['text', 'group'],
         description: 'Cuddle someone using a weeb gif',
         cooldown: 5
      });
   }
   async run(message, [...args]) {
      const dir = 'https://github.com/Gamma-001/Project-Caitlin/blob/master/src/gifs/Cuddles'
      const index = Math.ceil(Math.random()*7);
      const cuddle = {
         color: 0xff1493,
         image: {
            url: `${dir}/cuddle${index}.gif?raw=true`
         },
         footer: {
            text: 'Run again for a different GIF'
         }
      }
      const user = message.mentions.users.first();
      if(user && (user.id !== message.author.id)) {
         if(user.id === this.client.user.id)
            cuddle.description = `No one to cuddle ${message.author}? Fine you can cuddle me`;
         else 
            cuddle.description = `Aww **${message.author.username}** cuddled **${user.username}**`;
      }
      else if(user && (user.id === message.author.id))
         cuddle.description = `Someone seems lonely, here have a cuddle ${message.author}`;
      else
         return message.channel.send('You need to mention a valid user');
      return message.channel.send({embed: cuddle});
   }
};