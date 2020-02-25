const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'wwave',
         enabled: true,
         runIn: ['text', 'group'],
         description: 'Wave at someone with a weeb gif',
         cooldown: 5
      });
   }
   async run(message, [...args]) {
      const dir = 'https://github.com/Gamma-001/Project-Caitlin/blob/master/src/gifs/Waves'
      const index = Math.ceil(Math.random()*7);
      const wave = {
         color: 0xff1493,
         image: {
            url: `${dir}/wave${index}.gif?raw=true`
         },
         footer: {
            text: 'Run again for a different GIF'
         }
      }
      const user = message.mentions.users.first();
      if(user && (user.id !== message.author.id)) {
         if(user.id === this.client.user.id)
            wave.description = `👋 ${message.author}`;
         else 
            wave.description = `**${message.author.username}** is waving at you ${user}`;
      }
      else if(user && (user.id === message.author.id))
         wave.description = `👋 ${message.author}`;
      else
         wave.description = `**${message.author}** is waving at someone, i wonder who`;
      return message.channel.send({embed: wave});
   }
};