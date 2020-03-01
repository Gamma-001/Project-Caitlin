const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'wpoke',
         enabled: true,
         runIn: ['text', 'group'],
         description: 'Poke someone',
         cooldown: 5
      });
   }
   async run(message, [...args]) {
      const dir = 'https://github.com/Gamma-001/Project-Caitlin/blob/master/src/gifs/Pokes'
      const index = Math.ceil(Math.random()*7);
      const poke = {
         color: 0xff1493,
         image: {
            url: `${dir}/poke${index}.gif?raw=true`
         },
         footer: {
            text: 'Run again for a different GIF'
         }
      }
      const user = message.mentions.users.first();
      if(user && (user.id !== message.author.id)) {
         if(user.id === this.client.user.id)
            poke.description = `Huh, what do you want ${message.author}?`;
         else 
            poke.description = `**${message.author.username}** just poked you ${user}`;
      }
      else
         return message.channel.send('You need to mention a valid user');
      return message.channel.send({embed: poke});
   }
};