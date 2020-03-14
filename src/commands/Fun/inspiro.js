const { Command } = require('klasa');
const urllib = require('urllib');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         description: 'Generate super inspirational quotes from inspirobot.me',
         runIn: ['text'],
         cooldown: 5
      });
   }
   async run(message, [...args]) {
      return urllib.request('https://inspirobot.me/api?generate=true').then(res => {
         const Embed = {
            description: `Here you go [->](${res.data.toString()}) `,
            image: {
               url: res.data.toString()
            },
            footer: {
               text: 'powered by inspirobot.me'
            }
         }; 
         return message.channel.send({embed: Embed});
      });
   }
};