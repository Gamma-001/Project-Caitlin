const { Command } = require('klasa');
const { fetchAvatar, searchWiki } = require('../../util/util.js');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         aliases: ['search'],
         description: 'Search something up on wikipedia',
         usage: '<query:string> [...]',
         usageDelim: ' ',
         cooldown: 15,
      });
   }
   async run(message, [...query]) {
      let name = query.join(' ');
      return searchWiki(name).then(result => {
         const Embed = {
            color: 0xdfdfdf,
            title: query.join(' '),
            author: {
               name: this.client.user.tag,
               icon_url: fetchAvatar(this.client.user, 512)
            },
            thumbnail: {
               url: result.imageURL
            },
            description: result.firstPara + `\n[Read more](${result.link})`,
            timestamp: new Date(),
            footer: {
               text: `Requested by ${message.author.tag}`
            }
         }
         return message.channel.send({embed: Embed});
      }).catch(err => {
         console.log(err);
         message.channel.send('\`No results found!\`\nMake sure the spellings are correct or try toggling the case of the first letters of the words');
      })
   }
};