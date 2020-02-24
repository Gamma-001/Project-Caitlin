const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'wstare',
         enabled: true,
         runIn: ['text', 'group'],
         description: 'Stare at someone with a weeb gif',
         cooldown: 5
      });
   }
   async run(message, [...args]) {
      const dir = 'https://github.com/Gamma-001/Project-Caitlin/blob/master/src/gifs/Stares'
      const index = Math.ceil(Math.random()*7);
      const stare = {
         color: 0xff1493,
         image: {
            url: `${dir}/stare${index}.gif?raw=true`
         },
         footer: {
            text: 'Run again for a different GIF'
         }
      }
      const user = message.mentions.users.first();
      if(user && (user.id !== message.author.id)) {
         if(user.id === this.client.user.id)
            stare.description = `Keep your eyes wide open **${message.author.username}**\nYou can\'t win against me`;
         else 
            stare.description = `O_O Watch out **${user}**, **${message.author.username}** is staring at you`;
      }
      else if(user && (user.id === message.author.id))
         stare.description = `I have an eye on you ${message.author}`
      else
         return message.channel.send(`You need to mention a valid user`);
      return message.channel.send({embed: stare});
   }
};