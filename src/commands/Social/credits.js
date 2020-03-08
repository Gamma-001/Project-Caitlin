const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         description: 'Check how much credits you have',
         runIn: ['text'],
         cooldown: 15
      });
   }
   async run(message, [...args]) {
      return this.client.pg_client.query(`select credits from users where userid = '${message.author.id}'`).then(res => {
         let credits
         if(res.rows.length)
            credits = res.rows[0].credits;
         else 
            credits = 0
         return message.channel.send(`You have a total of ${credits} credits`);
      }).catch(err => {
         console.log(err);
      });
   }
};