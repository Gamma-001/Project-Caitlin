const { Command } = require('klasa');
const { MessageAttachment } = require('discord.js');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         aliases: ['addem'],
         description: 'Add a new emoji to the server',
         runIn: ['text'],
         usage: '[name:string] <image:attachment>',
         usageDelim: ' ',
         cooldown: 10
      });

      this.createCustomResolver('attachment', (arg, possible, message) => {
         const att = message.attachments.first();
         if(!att) throw "image is a required argument";
         return message.attachments.first();
      });
   }
   async run(message, [name, image]) {
      const client = message.guild.member(this.client.user);
      const user = message.member;
      name = name || image.name.replace(/\..+/, '');
      if(!client.hasPermission('MANAGE_EMOJIS'))
         return message.channel.send('I do not have the permission to manage emojis, try giving me the permission first');
      if(!user.hasPermission('MANAGE_EMOJIS'))
         return message.channel.send('You need the permission to manage emojis to add one');
      if(name !== '') {
         return message.guild.emojis.create(image.attachment, name).then(emoji => {
            return message.channel.send(`Created emoji **${emoji.name}** with id **${emoji.id}**`);
         }).catch(err => {
            console.log(err);
            let msg  = 'An error occured while trying to add the emoji';
                msg += '\n   -> Make sure the attachment is an image';
                msg += '\n   -> Make sure the image isn\'t larger than 256kb';
                msg += '\n   -> Make sure the name of the emoji is at least 2 characters long';
            return message.channel.send(msg);
         })
      }
   }
};