const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         description: 'Check how much credits you have',
         runIn: ['text'],
         usage: '[user:user]',
         usageDelim: ' ',
         cooldown: 15
      });
   }
   async run(message, [user]) {
      user = user||message.author;
      return this.client.pg_client.query(`select credits from users where userid = '${user.id}'`).then(res => {
         let credits
         if(res.rows.length)
            credits = res.rows[0].credits;
         else 
            credits = 0
         if(message.author.id === user.id) 
            return message.channel.send(`You have a total of ${credits} credits`);
         return message.channel.send(`${user} has a total of ${credits} credits`);
      }).catch(err => {
         console.log(err);
      });
   }
};