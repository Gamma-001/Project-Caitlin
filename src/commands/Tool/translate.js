const { Command } = require('klasa');
const Languages = require('../../util/JSON/yandex-langs.json');
const { MessageAttachment } = require('discord.js');
const yandexTranslate = require('yandex-translate')('trnsl.1.1.20200218T134153Z.b2924664c2fe62d7.87e299d721c0818ad6c9b01652e01375a1c30845');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         aliases: ['tl'],
         description: 'translate something to another langauge',
         usage: '<conversion:string> [text:string]',
         usageDelim: ' ',
         cooldown: 10
      });
   }
   async run(message, [conversion, text]) {
      const lang = {
         from: conversion.split('->')[0],
         to  : conversion.split('->')[1]
      };
      if(conversion === 'langs') {
         return message.channel.send(new MessageAttachment('src/util/JSON/yandex-langs.json'));
      }
      text = message.content.split(' ').slice(2).join(' ');
      if((await this.checkLang(lang.from)) === false || (await this.checkLang(lang.to)) === false) {
         return message.channel.send('Invalid language, use \'c:translate langs\' for the list of language codes supported');
      }
      if(text.length > 500) {
         return message.channel.send('Sorry! You can\'t translate more than 500 characters at a time');
      }
      try {
         return yandexTranslate.translate(text, {from: lang.from, to: lang.to}, (err, res) => {
            return message.channel.send(res.text);
         });
      } catch(err) {
         console.log(err);
         return message.channel.send('An error occured while trying to translate.');
      }
   }
   async checkLang(name) {
      for(let key in Languages)
         if(Languages[key] === name) return true;
      return false;
   }
};