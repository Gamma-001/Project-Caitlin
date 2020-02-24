const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'wkiss',
         enabled: true,
         runIn: ['text', 'group'],
         description: 'Give someone a kiss with a weeb gif',
         cooldown: 5
      });
   }
   async run(message, [...args]) {
      const dir = 'https://github.com/Gamma-001/Project-Caitlin/blob/master/src/gifs/Kisses'
      const index = Math.ceil(Math.random()*7);
      const kiss = {
         color: 0xff1493,
         image: {
            url: `${dir}/kiss${index}.gif?raw=true`
         },
         footer: {
            text: 'Run again for a different GIF'
         }
      }
      const user = message.mentions.users.first();
      if(user && (user.id !== message.author.id)) {
         let user = message.mentions.users.first();
         if(user.id === this.client.user.id) 
            return message.channel.send(`We really shouldn\'t go that far right now ${message.author}`);
         else 
            kiss.description = `**${message.author.username}** kissed **${user.username}** how cute`;
      }
      else if(user && (user.id === message.author.id))
         return message.channel.send('You can\'t really kiss yourself, and don\'t expect me to kiss you either');
      else
         return message.channel.send(`You need to mention a valid user`);
      return message.channel.send({embed: kiss});
   }
};