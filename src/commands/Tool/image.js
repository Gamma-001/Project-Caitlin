const { Command } = require('klasa');
const GoogleImages = require('google-images')
const client = new GoogleImages(CSE_ID, GOOGLE_API_KEY);

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'image',
         enabled: true,
         description: 'Fetch an image from google images',
         runIn: ['text', 'group'],
         cooldown: 10
      });
   }
   async run(msg, [...args])  {
      let image = msg.content.split(' ').slice(1).join(' ');
      return client.search(image, {safe: 'active'}).then(results => {
         const Embed = {
            image: {
               url: results[0].url
            }
         };
         return msg.channel.send({embed: Embed});
      }).catch(err => {
         console.log(err);
         return msg.channel.send('The image could not be found');
      });
   }
};