const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'wdance',
         enabled: true,
         runIn: ['text', 'group'],
         description: 'dance with someone',
         cooldown: 5
      });
   }
   async run(message, [...args]) {
      let usr = message.author;
      const dir = 'https://github.com/Gamma-001/Project-Caitlin/blob/master/src/gifs/Dances';
      const dance = {
         color: 0xff1493,
         image: {},
         footer: {
            text: 'Run again for a different GIF'
         }
      }
      if(message.mentions.users.first() && (message.mentions.users.first().id||0) !== message.author.id) {
         usr = message.mentions.users.first();
         let index = Math.ceil(Math.random()*5);
         dance.image.url = `${dir}/dance_couple${index}.gif?raw=true`;
         if(usr.id === this.client.user.id) dance.description = `OwO **${message.author.username}** dancing with me 😳`;
         else dance.description = `**${message.author.username}** is dancing with **${usr.username}**`;
      } else {
         let index = Math.ceil(Math.random()*5);
         dance.image.url = `${dir}/dance_alone${index}.gif?raw=true`;
         dance.description = `**${message.author.username}** is dancing all alone`;
      }
      return message.channel.send({embed: dance});
   }
};