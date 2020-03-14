const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         description: 'Give reputation points to someone',
         runIn: ['text'],
         usage: '<user:user>',
         cooldown: 15
      });
   }
   async run(message, [user]) {
      if(user.id === message.author.id) 
         return message.channel.send('You cannot give a reputation to point to yourself');
      else return this.client.pg_client.query(`select last_rep from users where userid = '${user.id}'`).then(res => {
         if(res.rows.length === 0) {
            return message.channel.send('The mentioned user hasn\'t registered yet');
         }
         else return this.client.pg_client.query(`select current_timestamp-last_rep from users where userid = '${message.author.id}'`).then(res => {
            let time = res.rows[0]['?column?'];
            let total = (time.hours||0)*60*60 + (time.minutes||0)*60 + (time.seconds||0);
            let diff = 43200 - total;
            let next_claim = {
               seconds: diff%60,
               minutes: Math.floor(diff/60)%60,
               hours: Math.floor(diff/3600)%60
            }
            if(diff < 0 || time.days)
               return this.client.pg_client.query(`update users set last_rep = current_timestamp where userid = '${message.author.id}';update users set reputations = reputations+1 where userid = '${user.id}'`).then(res => {
                  return message.channel.send(`You have given a reputation point to **${user.username}**`); 
               });
            else
               return message.channel.send(`You can give reputation points in ${next_claim.hours} hours ${next_claim.minutes} minutes ${next_claim.seconds} seconds`);
         });
      }).catch(err => {
         console.log(err);
      });
   }
}