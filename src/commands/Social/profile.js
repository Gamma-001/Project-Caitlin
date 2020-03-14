const { loadImage, createCanvas } = require('canvas');
const { Command } = require('klasa');
const { MessageAttachment } = require('discord.js');
const { fetchAvatar } = require('../../util/util.js');

const card = createCanvas(600, 400);
const pfp = createCanvas(144, 144);
const slider = createCanvas(400, 10);

const ctx = card.getContext('2d');
const ctx1 = pfp.getContext('2d');
const ctx2 = slider.getContext('2d');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         description: 'Get your profile card',
         runIn: ['text'],
         usage: '[user:user]',
         usageDelim: ' ',
         cooldown: 15
      });
   }
   async run(message, [user]) {
      user = user||message.author;
      let i1 = loadImage(fetchAvatar(user)).then(image => {
         ctx1.drawImage(image, 0, 0, 144, 144);
      }).catch(err => {
         // nothing
      });

      let i2 = loadImage('../Caitlin/src/images/profile.png').then(image => {
         ctx.drawImage(image, 0, 0, 600, 400);
      });

      let i3 = loadImage('../Caitlin/src/images/slider.png').then(image => {
         ctx2.drawImage(image, 0, 0, 400, 10);
      });

      ctx1.arc(72, 72, 72, 0, Math.PI*2, false);
      ctx1.clip();
      ctx2.rect(0, 0, 350, 10);
      ctx2.clip();

      return Promise.all([i1, i2, i3]).then(() => {
         return this.client.pg_client.query(`select credits, reputations from users where userid = '${user.id}'`).then(res => {
            if(res.rows.length === 0) {
               if(user.id === message.author.id)
                  return message.channel.send('You haven\'t been registered yet, use c:daily');
               else
                  return message.channel.send('No such user found');
            }
            ctx.drawImage(pfp, 28 ,25, 144, 144);
            ctx.drawImage(slider, 225, 167, 400, 10);
            ctx.fillStyle = 'white';
            ctx.font = 'bold 32px Maiandra GD';
            ctx.fillText(user.username, 230, 70);
            let level = 'Level 1';
            ctx.fillText(level, 100-ctx.measureText(level).width/2, 215);
            ctx.font = '20px Maiandra GD';
            ctx.fillText(`#${user.discriminator}`, 235, 100);
            ctx.font = 'bold 20px Maiandra GD';
            ctx.fillText(`: ${res.rows[0].credits}`, 470, 238);
            ctx.fillText(`: ${res.rows[0].reputations}`, 470, 268);
            ctx.fillText(': 1', 470, 298);
            return message.channel.send(new MessageAttachment(card.toBuffer()));
         });
      }).catch(err => {
         console.log(err);
         return message.channel.send('An error occured');
      })
   }
}