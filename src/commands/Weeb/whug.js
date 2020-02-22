const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'whug',
         enabled: true,
         runIn: ['text', 'group'],
         description: 'Give someone a hug with a weeb gif',
         cooldown: 5
      });
   }
   async run(message, [...args]) {
      const dir = 'https://github.com/Gamma-001/Project-Caitlin/blob/master/src/gifs/Hugs'
      const index = Math.ceil(Math.random()*9);
      const hug = {
         color: 0xff1493,
         image: {
            url: `${dir}/hug${index}.gif?raw=true`
         },
         footer: {
            text: 'Run again for a different GIF'
         }
      }
      const user = message.mentions.users.first();
      if(user && (user.id !== message.author.id)) {
         let usr = message.mentions.users.first();
         if(usr.id === this.client.user.id) hug.description = `Aww, thanks for the hug ${message.author}`;
         else hug.description = `**${usr.username}**, you have been hugged by **${message.author.username}**`;
      }
      else if(user && (user.id === message.author.id))
         hug.description = `Here is a nice hug for you **${message.author.username}**`;
      else
         return message.channel.send(`You need to mention a valid user`);
      return message.channel.send({embed: hug});
   }
};