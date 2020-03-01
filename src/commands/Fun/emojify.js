const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         aliases: ['emf'],
         description: 'Emojify a sentence',
         usage: '<text:string>'
      });
   }
   async run(message, [text]) {
      text = text.toLowerCase().split('');
      const nums = {
         '1': 'one',   '2': 'two',
         '3': 'three', '4': 'four',
         '5': 'five',  '6': 'six',
         '7': 'seven', '8': 'eight',
         '9': 'nine',  '0': 'zero'
      }
      for(let i = 0;i != text.length; i++) {
         if(text[i].match(/[a-z]/))
            text[i] = ':regional_indicator_'+text[i]+': ';
         else if(text[i].match(/[0-9]/))
            text[i] = ':'+nums[text[i]]+': ';
         else 
            text[i] = '**'+text[i]+'** ';
      }
      return message.channel.send(text.join(''));
   }
}