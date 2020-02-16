const { Command } = require('klasa');
const { fetchAvatar } = require('../../util/util.js');
const urllib = require('urllib');

const entity = {
   '&apos;':'\'',
   '&quot;':'\"',
   '&gt;':'>',
   '&lt;':'<',
   '&amp;':'&',
   '&commat':'@'
};

let stitch = array => {
   let result = '';
   for(let i = 0;i != array.length; i++) {
      let str = array[i].replace('>','');
      for(key in entity) {
         str = str.replace(new RegExp(key, 'gi'), entity[key]);
      }
      result += str;
   }
   return result;
};

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'urban',
         enabled: true,
         description: 'Fetch the meaning of a word from the urban dictionary',
         aliases: ['ud', 'def'],
         usage: '<word:string>',
         cooldown: 10
      });
   }
   async run(msg, [word])  {
      const client = this.client;
      if(word == '') {
         return msg.reply(`You need to provide a word`);
      }
      return urllib.request('https://www.urbandictionary.com/define.php?term='+word).then(res => {
         let html = res.data.toString();
         let index = 0;
         const content = html.match(/<[ ]*div[ ]+id+[ ]*=[ ]*('|")outer('|")[ ]*>.*<[ ]*a[ ]+class[ ]*=[ ]*("|')mug-ad("|')/gims)[0];
         const definition = stitch(content.match(/<[ ]*div[ ]+class[ ]*=[ ]*('|")meaning('|")(.*?)<\/div>/gi)[index].match(/>(.*?)(?=<)/gi));
         const example = stitch(content.match(/<[ ]*div[ ]+class[ ]*=[ ]*('|")example('|")(.*?)<\/div>/gi)[index].match(/>(.*?)(?=<)/gi));
         const tags = stitch(content.match(/<[ ]*div[ ]+class[ ]*=[ ]*('|")tags('|")(.*?)<\/div>/gi)[index].match(/>(.*?)(?=<)/gi));
         const contributor = content.match(/<[ ]*div[ ]+class[ ]*=[ ]*('|")contributor('|")(.*?)<\/div>/gi)[index].match(/>(.*?)(?=<)/gi)[1].replace('>','');
         const Definition = {
            color: 0xdc143c,
            title: word.split('%20').join(' '),
            thumbnail: {
               url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/UD_logo-01.svg/512px-UD_logo-01.svg.png',
            },
            author: {
               name: client.user.tag,
               icon_url: fetchAvatar(client.user, 256)
            },
            description: definition,
            fields: [
               {
                  name: 'Example',
                  value: '>>> '+example,
               },{
                  name: 'Tags',
                  value: '`'+tags.split('#').filter(a => {return a != '';}).map(a => {return '#'+a;}).join('\` \`')+`\`\n\n> _by [${contributor}](https://www.urbandictionary.com/author.php?author=${contributor})_`,
               }
            ],
            timestamp : new Date(),
            footer : {
               text: `Requested by ${msg.author.tag}`,
               icon_url: fetchAvatar(msg.author, 256)
            }
         }
         msg.channel.send({embed: Definition});
      }).catch(err => {
         console.log(err);
         return msg.channel.send(`Sorry, couldn't find the word you, you could try toggling the case of the first letter.`);
      })
   }
};