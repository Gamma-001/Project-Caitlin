const { Command } = require('klasa');
const math = require('mathjs');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         description: 'Evaluate a mathematical expression',
         usage: '<expression:string> [...]',
         cooldown: 5
      });
   }
   async run(message, [...expression]) {
      expression = expression.join(' ');
      let res;
      try {
         res = math.eval(expression).toString();
      } catch(err) {
         res = 'Invalid Expression';
      }
      return message.channel.send('```matlab\n'+res+'```');
   }
};