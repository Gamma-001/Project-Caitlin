const { Command } = require('klasa');
const { MessageAttachment } = require('discord.js');
const Util    = require('util');

const clean = text => {
   if(typeof(text) === 'string') return text.replace(/`/g, '`'+String.fromCharCode(8203)).replace(/@/g, '@'+String.fromCharCode(8203));
   else return text;
};

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         description: 'evaluate an arbitrary javascript code',
         aliases: ['ev'],
         permLevel: 10
      });
   }
   async run(msg, [...args]) {
      let time1 = await this.getMicro(process.hrtime());
      let msg2 = msg.content.split(' ').slice(1).join(' ');
      let evaled = '', sym = '✅';
      if(msg2.endsWith('`')) {
         if(msg2.match(/```.*```/gims)) {
            msg2 = msg2.replace(/```(js)*/, '');
            msg2 = msg2.slice(0, msg2.length-3);
         }
         else {
            msg2 = msg2.slice(1, msg2.length-1);
         } 
      }
      try {
         evaled = eval(msg2);
      } catch(err) {
         evaled = err;
         sym = '❌';
      }
      if(typeof(evaled) !== 'string') evaled = Util.inspect(evaled);
      evaled = clean(evaled);
      let time2 = await this.getMicro(process.hrtime());
      time2 -= time1;
      if(time2 > 1000) time2 = Math.round(time2/10)/100+'ms';
      else time2 = Math.round(time2*10)/10 + 'μs';

      const Embed = {
         color: 0x1e90ff,
         description: '```js\n'+evaled+'\n```',
         footer: {
            text: `⏱️ Executed in ${time2}`
         }
      };
      if(evaled.length > 2000) {
         let out = new MessageAttachment(Buffer.from(evaled), 'result.txt');
         return msg.channel.send('The result was too long to be printed, click the file below for the result', out)
            .then(ms => {
               msg.react(sym);
            })
            .catch(err => console.log(err));
      }
      return msg.channel.send({embed: Embed}).then(ms => msg.react(sym).catch(err=> console.log(err)));
   }
   async getMicro(arr) {
      return arr[0]*1000000 + arr[1]/1000;
   };
};