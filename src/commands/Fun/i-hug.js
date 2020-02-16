const { Command } = require('klasa');
const { createCanvas, loadImage } = require('canvas');
const { MessageAttachment } = require('discord.js');
const { fetchAvatar } = require('../../util/util.js');

let canvas = createCanvas(250, 250);
let ctx = canvas.getContext('2d');

let canvas1 = createCanvas(100, 100);
let ctx1 = canvas1.getContext('2d');

let canvas2 = createCanvas(100, 100);
let ctx2 = canvas2.getContext('2d');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'i-hug',
         enabled: true,
         description: 'Give someone a hug with a custom made image',
         runIn: ['text', 'group'],
         cooldown: 5
      });
   }
   async run(msg, [...args]) {
      let user1 = msg.author;
      let user2 = msg.mentions.users.first();
      if(!user2 || (user2 && user2.id === user1.id)) {
         user1 = msg.client.user;
         user2 = msg.author;
      }
      let avatar1 = loadImage(fetchAvatar(user1)).then(image => {
         ctx1.drawImage(image, 0, 0, 100, 100);
      });

      let avatar2 = loadImage(fetchAvatar(user2)).then(image => {
         ctx2.drawImage(image, 0, 0 , 100, 100);
      });

      let hug = loadImage('./src/images/i-hug.jpeg').then(image => {
         ctx.drawImage(image, 0, 0 , 250, 250);
      });

      ctx1.arc(50, 50, 50, 0, Math.PI*2, false);
      ctx1.clip();

      ctx2.arc(50, 50, 50, 0, Math.PI*2, false);
      ctx2.clip();

      return Promise.all([avatar1, avatar2, hug]).then(promise => {
         ctx.drawImage(canvas1, 22, 50, 70, 70);
         ctx.drawImage(canvas2, 95, 47, 70, 70);
         const att = new MessageAttachment(canvas.toBuffer(), "hug.png");
         return msg.channel.send(att);
      });
   }
};