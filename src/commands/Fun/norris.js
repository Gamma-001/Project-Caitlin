const { Command } = require('klasa');
const urllib = require('urllib');

const entity = {
   '&apos;':'\'',
   '&quot;':'\"',
   '&gt;':'>',
   '&lt;':'<',
   '&amp;':'&',
   '&commat':'@'
};

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         description: 'Fetch a random chuck norris joke',
         cooldown: 5
      });
   }
   async run(message, [...args]) {
      return urllib.request(`https://api.icndb.com/jokes/random`).then(async res => {
         let joke = await this.filter(JSON.parse(res.data.toString()).value.joke);
         return message.channel.send(`>>> ${joke}`);
      }).catch(err => {
         console.log(err);
         return message.channel.send('An error occured, please try again');
      });
   }
   async filter(str) {
      for(let i in entity) {
         let pattern = new RegExp(i, 'gi');
         str = str.replace(pattern, entity[i]);
      }
      return str;
   }
};