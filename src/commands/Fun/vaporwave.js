const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         aliases: ['vwv'],
         description: 'Converts text to vaporwave characters',
         usage: '<text:string>'
      });
   }
   async run(message, [text]) {
      text = text.split('');
      const regular = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const font1 = ['𝕒','𝕓','𝕔','𝕕','𝕖','𝕗','𝕘','𝕙','𝕚','𝕛','𝕜','𝕝','𝕞','𝕟','𝕠',
                     '𝕡','𝕢','𝕣','𝕤','𝕥','𝕦','𝕧','𝕨','𝕩','𝕪','𝕫','𝔸','𝔹','ℂ','𝔻',
                     '𝔼','𝔽','𝔾','ℍ','𝕀','𝕁','𝕂','𝕃','𝕄','ℕ','𝕆','ℙ','ℚ','ℝ','𝕊',
                     '𝕋','𝕌','𝕍','𝕎','𝕏','𝕐','ℤ','𝟘','𝟙','𝟚','𝟛','𝟜','𝟝','𝟞','𝟟',
                     '𝟠','𝟡'];
      for(let i = 0;i != text.length; i++) {
         if(text[i].match(/[a-zA-Z0-9]/)) 
            text[i] = font1[regular.indexOf(text[i])];
      }
      return message.channel.send(text.join(''));
   }
}