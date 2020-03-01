const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         aliases: ['delem'],
         runIn: ['text'],
         description: 'Remove one or multiple emojis from a server',
         usage: '<emoji:string> [...]',
         cooldown: 10
      });
   }
   async run(message, ...emoji) {
      const guildEmojis = message.guild.emojis;
      const client = message.guild.member(this.client.user);
      emoji = emoji.join(' ').match(/:\d+>/g).map(x => x.match(/\d+/g)[0]);
      let count = 0;
      if(!client.hasPermission('MANAGE_EMOJIS')) 
         return message.channel.send('I do not have the permission to manage emojis, try giving me the permission first');
      if(!message.member.hasPermission('MANAGE_EMOJIS'))
         return message.channel.send('You need permission to manage emojis to delete an emoji');
      emoji.map(id => {
         if(guildEmojis.get(id)) {
            guildEmojis.get(id).delete();
            count += 1;
         }
      });
      return message.channel.send(`Deleted ${count} emojis successfully`);
   }
};