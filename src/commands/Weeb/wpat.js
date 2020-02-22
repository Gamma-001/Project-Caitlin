const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'wpat',
         enabled: true,
         runIn: ['text', 'group'],
         description: 'Pat someone with a weeb gif',
         cooldown: 5
      });
   }
   async run(message, [...args]) {
      const dir = 'https://github.com/Gamma-001/Project-Caitlin/blob/master/src/gifs/Pats';
      const index = Math.ceil(Math.random()*9);
      const pat = {
         color: 0xff1493,
         image: {
            url: `${dir}/pat${index}.gif?raw=true`,
         },
         footer: {
            text: 'Run again for a different GIF'
         }
      }
      const user = message.mentions.users.first();
      if(user && (user.id !== message.author.id)) {
         if(user.id !== this.client.user.id) pat.description = `**${user.username}**, you've got a pat from **${message.author.username}**`;
         else pat.description = `UwU Thanks ${message.author}, what made me deserve that?`;
      }
      else if(user && (user.id === message.author.id))
         pat.description = `Here is a pat for you ${message.author}, you deserve it`;
      else
         return message.channel.send(`You need to mention a valid user`);

      return message.channel.send({embed: pat});
   }
};