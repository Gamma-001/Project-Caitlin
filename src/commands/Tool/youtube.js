const { Command } = require('klasa');
const YouTube = require('youtube-node');
let youtube = new YouTube();

youtube.setKey(process.env.GOOGLE_API_KEY);

const entity = {
   '&apos;':'\'',
   '&#39;':'\'',
   '&quot;':'\"',
   '&gt;':'>',
   '&lt;':'<',
   '&amp;':'&',
   '&commat':'@'
};

let clean_str = str => {
   let result = str.split(' ');
   for(let i = 0;i != result.length; i++) {
      for(key in entity) {
         result[i] = result[i].replace(new RegExp(key, 'gi'), entity[key]);
      }
   }
   return result.join(' ');
};

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'youtube',
         aliases: ['yt'],
         enabled: true,
         runIn: ['text', 'group'],
         description: 'Fetch a video from youtube',
         usage: '<video:string>',
         cooldown: 20
      });
   }
   async run(msg, [video]) {
      youtube.search(video, 10, {type: 'video', safeSearch: 'strict'}, (err, results) => {
         if(err) {
            console.log(err);
            msg.channel.send('An error occured!');
            return;
         }
         let videos = results.items.map(x => {
            let video = {
               name : clean_str(x.snippet.title),
               id   : x.id.videoId 
            };
            return video;
         });
         let str = '';
         for(let i = 0;i != 10; i++) {
            str += `[ ${i+1} ]: ${videos[i].name}\n`;
         }
         let buffer = msg.channel.send('```ml\n'+str+'```'+'\nChoose a number from 1-10');
         const filter = (ms) => {
            if(ms.author.id !== msg.author.id) return false;
            let num = parseInt(ms.content, 10);
            if(isNaN(num)) return false;
            if(num <= 0 || num > 10) return false;
            return true;
         }
         return msg.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time']}).then(collected => {
            let num = parseInt(collected.first().content);
            buffer.then(ms => {
               ms.edit(`https://www.youtube.com/watch?v=${videos[num-1].id}`);
            }).catch(console.log);
         }).catch(err => {
            console.log(err);
            msg.channel.send(`Didn't recieve a valid response on time`);
         });
      });
   }
};