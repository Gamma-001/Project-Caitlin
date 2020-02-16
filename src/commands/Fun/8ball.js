const { Command } = require('klasa');

const WHAT = ['car', 'ship', 'bus', 'spaceship', 'human', 'ghost', 'a mystery', 'alien', 'robot', 'animal', 'inanimate object'];
const WHY = ['why not', 'stuff happens', 'of you', 'no one cares', 'the universe is indefinite', 'everything is relative'];
const WHEN = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'];
const WHERE = ['Asia', 'Africa', 'Australia', 'Antarctica', 'Europe', 'North America', 'South America', 'the Universe', 'the Milky way', 'the Earth'];
const WHO = ['You', 'Your friend', 'Someone you know', 'A murderer', 'A scientist', 'A doctor', 'An engineer', 'A politician', 'A hero', 'A common person', 'I don\'t know'];
const ELSE = ['Yes!', 'No!', 'Maybe.', 'Definitely yes', 'Of course NO.', 'Didn\'t understand, can you repeat?'];

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: '8ball',
         enabled: true,
         description: 'Ask me a question',
         runIn: ['text', 'group'],
         cooldown: 0
      });
   }
   async run(msg, [...args]) {
      let index = 0;
      let rpl = '';
      let msg2 = msg.content.split(' ').slice(1).join(' ');
      if(msg2 == '') {
         return msg.reply(`you didn't even ask a question`);
      }
      if(msg2.search(/why/gi) === 0) {
         index = Math.floor(Math.random()*WHY.length);
         rpl = '```css\nBecause ' + WHY[index] + '.```';
      }
      else if(msg2.search(/what/gi) === 0) {
         index = Math.floor(Math.random()*WHAT.length);
         rpl = WHAT[index];
         if(rpl.match(/^[aeiou]{1}/gi)) rpl = 'An '+rpl;
         else rpl = 'A '+rpl;
         rpl = '```css\n' + rpl +'.```';
      }
      else if(msg2.search(/who/gi) === 0) {
         index = Math.floor(Math.random()*WHO.length);
         rpl = WHO[index];
         rpl = '```css\n' + rpl + '.```';
      }
      else if(msg2.search(/where/gi) === 0) {
         index = Math.floor(Math.random()*WHERE.length);
         rpl = WHERE[index];
         let dir = ['Northern', 'Southern', 'Eastern', 'Western', 'South Western', 'South Eastern', 'Noth Western', 'North Eastern'];
         let pre = dir[Math.floor(Math.random()*dir.length)];
         if(rpl.split(' ').length === 1 && rpl !== 'Antarctica') rpl = pre +' '+rpl;
         rpl = '```css\nSomewhere in ' + rpl + '.```';
      }
      else if(msg2.search(/when/gi) === 0) {
         index = Math.floor(Math.random()*WHEN.length);
         let count = 2 + Math.floor((Math.random()*1000));
         let dir = ['ago', 'later'];
         rpl = '```css\n'+count + ' ' + WHEN[index] + ' ' +dir[Math.floor(Math.random()*2)]+'```';
      }
      else {
         console.log(msg.mentions.users.array);
         index = Math.floor(Math.random()*ELSE.length);
         rpl = '```css\n'+ELSE[index]+'```';
      }
      return msg.channel.send(`>>> ${msg2} ${rpl}`).then(console.log("message sent")).catch(er=>console.log("error occured!"));
   }
};