const { Command } = require('klasa');
const { getLyrics } = require('genius-lyrics-api');

const sendArray = (channel, arr, index = 0) => {
   if(index === arr.length) {
      return;
   }
   else {
      channel.send('```css\n'+arr[index]+'```');
      sendArray(channel, arr, index+1);
   }
}

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'lyrics',
         enabled: true,
         description: 'Fetch the lyrics of a song from genius',
         usage: '<song:string> <artist:string>',
         usageDelim: '::',
         cooldown: 20
      });
   }
   async run(msg, [song, artist]) {
      const options = {
         apiKey: process.env.GENIUS_API_KEY,
         title: song,
         artist: artist,
         optimiseQuery: true
      };
      getLyrics(options).then(lyrics => {
         let trimmed = [];
         lyrics = lyrics.split('\n');
         while(lyrics.length > 0) {
            trimmed.push(lyrics.slice(0, 15).join('\n'));
            lyrics = lyrics.slice(15);
         }
         return sendArray(msg.channel, trimmed);
      }).catch(err => {
         console.log(err);
         msg.channel.send(`Seems like the song you mentioned doesn't exist! \nMake sure you use the right spellings`);
      })
   }
};
