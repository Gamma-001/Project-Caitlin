const { fetchAvatar } = require('../../util/util.js');
const { Command } = require('klasa');
const urllib = require('urllib');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         description: 'Fetch the information about an anime',
         runIn: ['text'],
         cooldown: 10,
         usage: '<name:string>',
      });
   }
   async run(message, [name]) {
      return urllib.request(`https://kitsu.io/api/edge/anime?page[limit]=1&page[offset]=0&filter[text]=${name}`).then(res => {
         const anime = JSON.parse(res.data.toString()).data[0].attributes;
         let synopsis = anime.synopsis.slice(0, 700)+`[...read more](https://kitsu.io/anime/${anime.canonicalTitle.toLowerCase().replace(/[ ]/g, '-')})`;
         const Embed = {
            author: {
               name: this.client.user.tag,
               icon_url: fetchAvatar(this.client.user, 512)
            },
            thumbnail: {
               url: anime.posterImage.medium
            },
            fields: [
               { name: 'English Title',  value: anime.titles.en, inline: true },
               { name: 'Japanese Title', value: anime.titles.ja_jp, inline: true },
               { name: 'Start Date',     value: anime.startDate, inline: true },  
               { name: 'Status',         value: anime.status, inline: true },
               { name: 'Episodes',       value: (anime.episodeCount||'Still airing'), inline: true },
               { name: 'Age Rating',     value: `${anime.ageRating}, ${anime.ageRatingGuide||''}`, inline: true },
               { name: 'Synopsis',       value: synopsis }
            ],
            title: anime.canonicalTitle,
            timestamp: Date.now(),
            footer: {
               text: `Requested by ${message.author.tag}`
            }
         }
         return message.channel.send({embed: Embed});
      }).catch(err => {
         console.log(err);
         return message.channel.send('Could not find any results matching your query.');
      });
   }
};