const { Client } = require('pg');
const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         description: 'Give reputation points to someone',
         runIn: ['text'],
         usage: '<user:user>'
      });
   }
   async run(message, [user]) {
      const pg_client = new Client({
         connectionString: process.env.DATABASE_URL,
         ssl: true
      });
      pg_client.connect();
      pg_client.query(`select last_rep from users where userid = '${user.id}'`).then(res => {
         if(res.rows.length === 0) {
            return message.channel.send('The mentioned user hasn\'t registered yet');
         }
         else return pg_client.query(`select current_timestamp-last_rep from users where userid = '${message.author.id}'`).then(res => {
            let time = res.rows[0]['?column?'];
            let total = (time.hours||0)*60*60 + (time.minutes||0)*60 + (time.seconds||0);
            let diff = 43200 - total;
            let next_claim = {
               seconds: diff%60,
               minutes: Math.floor(diff/60)%60,
               hours: Math.floor(diff/3600)%60
            }
            if(diff < 0 || time.days)
               return pg_client.query(`update users set reputations = reputations + 1, last_rep = current_timestamp where userid = '${message.author.id}'`).then(res => {
                  return message.channel.send(`You have given a reputation point to **${user.username}**`); 
               });
            else
               return message.channel.send(`You can give reputation points in ${next_claim.hours} hours ${next_claim.minutes} minutes ${next_claim.seconds} seconds`);
         });
      }).catch(err => {
         console.log(err);
      }).finally(() => {
         pg_client.end();
      });
   }
}