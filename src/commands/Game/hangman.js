const { Command } = require('klasa');
const { fetchAvatar } = require('../../util/util.js');

const words = ['hangman','recitation','volatile','sick','duck','loop','hatch','nibble',
             'giraffe','dolphin','rocket','christmas','vulture','anarchist','explosion',
             'rhythmic','insidious','zombie','awkward','absurd','double bass', 'super man',
             'shooting stars','arctic ocean','couch potato','washing machine', 'android',
             'endeavour','submarine','extrapolation'];

const getLives = lives => {
   let str = '';
   for(let i = 0;i != lives; i++) {
      str += '💙';
   }
   return str;
};

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'hangman',
         enabled: true,
         description: 'Start a game of hangman',
         runIn: ['text', 'group'],
         cooldown: 10
      });
   }
   async run(msg, [...args]) {
      const client = msg.client;
      const player = msg.author;
      const channel = msg.channel;
      const chosen = words[Math.floor(Math.random()*words.length)].split('');
      let guess = [], lives = 5;
      for(let i = 0;i != chosen.length; i++) {
         if(chosen[i] === ' ') guess.push(' ');
         else guess.push('_');
      }
      let Embed = {
         color: 0x66ff00,
         author: {
            name: getLives(lives),
         },
         description: `Guess a single letter of the word or the entire word\n**\`${guess.join(' ')}\`**\n`,
         footer: {
            text: msg.author.tag,
            icon_url: fetchAvatar(msg.author, 256)
         }
      };
      let buffer = msg.channel.send({embed: Embed}).then(ms => {
                     return ms;
                  }).catch(err => {
                     console.log('Error at Hangman', err);
                  });
      client.on('message', function Hangman(message) {
         if(message.channel.id === channel.id && message.author.id === player.id) {
            let content = message.content.toLowerCase();
            Embed.description = `Guess a single letter of the word or the entire word\n**\`${chosen.join(' ')}\`**\n`;
            if(content === chosen.join('')) {
               buffer.then(ms => {
                  ms.edit(`Correct! The word was **${chosen.join('')}**`,{embed: Embed});
               });
               client.removeListener('message', Hangman);
               return;
            }
            else if(content.length === 1 && chosen.includes(content) && !guess.includes(content)) {
               for(let i = 0;i != chosen.length; i++) {
                  if(chosen[i] === content) {
                     guess[i] = content;
                  }
               }
               Embed.author.name = getLives(lives);
               Embed.description = `Guess a single letter of the word or the entire word\n**\`${guess.join(' ')}\`**\n`;
               buffer.then(ms => {
                  ms.edit({embed: Embed});
               });
            }
            else {
               lives -= 1;
               Embed.author.name = getLives(lives);
               Embed.description = `Guess a single letter of the word or the entire word\n**\`${guess.join(' ')}\`**\n`;
               buffer.then(ms => {
                  ms.edit({embed: Embed});
               });
            }
            if(lives <= 0) {
               buffer.then(ms => {
                  ms.edit(`${player} Game over!, The correct word was **\`${chosen.join('')}\`**`);
               });
               client.removeListener('message', Hangman);
               return;
            }
            if(guess.join('') === chosen.join('')) {
               buffer.then(ms => {
                  ms.edit(`Correct! The word was **${chosen.join('')}**`);
               });
               client.removeListener('message', Hangman);
            }
         }
      });
   }
};