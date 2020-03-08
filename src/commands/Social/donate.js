const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         description: 'Donate some credits to another user',
         runIn: ['text'],
         usage: '<user:user> <amount:integer>',
         usageDelim: ' ',
         cooldown: 15
      });
   }
   async run(message, [user, amount]) {
      if(user.id === message.author.id)
         return message.channel.send('You need to mention a user other than you');
      else return this.client.pg_client.query(`select credits from users where userid = '${user.id}'`).then(res => {
         if(res.rows.length === 0)
            return message.channel.send(`The mentioned user isn't registered yet`);
         else return this.client.pg_client.query(`select credits from users where userid = '${message.author.id}'`).then(res1 => {
            if(res1.rows.length === 0) 
               return message.channel.send(`You aren't registered yet, use c:daily to register`);
            else if(res1.rows[0].credits < amount)
               return message.channel.send(`You don't have enough credits to donate`);
            else {
               let donate  = `update users set credits = credits + ${amount} where userid = '${user.id}';`;
                   donate += `update users set credits = credits - ${amount} where userid = '${message.author.id}'`;
               return this.client.pg_client.query(donate).then(res2 => {
                  return message.channel.send(`**${message.author.username}** donated ${amount} credits to **${user.username}**`);
               });
            }
         });
      }).catch(err => {
         console.log(err);
      });
   }
};