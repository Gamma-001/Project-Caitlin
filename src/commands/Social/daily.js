const { Command } = require('klasa');
const { Client } = require('pg');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         description: 'Claim your semi dailies',
         runIn: ['text'],
      });
   }
   async run(message, [...args]) {
      const pg_client = new Client({
         connectionString: process.env.PG_TOKEN,
         ssl: true
      });
      pg_client.connect();
      pg_client.query(`select * from users where userid = '${message.author.id}'`).then(res => {
         if(res.rows.length === 0) {
            const add_user = 
            `insert into users (userid, credits, reputations, last_claim) 
            values 
            ('${message.author.id}', 0, 0, '2000-01-01T00:00:00.004Z')`;
            return pg_client.query(add_user);
         }
      }).then(() => {
         return pg_client.query(`select current_timestamp-last_claim from users where userid = '${message.author.id}'`).then(res => {
            let time = res.rows[0]['?column?'];
            let total = (time.hours||0)*60*60 + (time.minutes||0)*60 + (time.seconds||0);
            let diff = 43200 - total;
            let next_claim = {
               seconds: diff%60,
               minutes: Math.floor(diff/60)%60,
               hours: Math.floor(diff/3600)%60
            }
            if(diff > 0)
               return message.channel.send(`You can claim your dailies in ${next_claim.hours}hours ${next_claim.minutes}minutes ${next_claim.seconds}seconds`);
            else 
               return pg_client.query(`update users set credits = credits + 200, last_claim = current_timestamp where userid = '${message.author.id}'`).then(res => {
                  return message.channel.send(`Successfully claimed 200 dailies come back in 12hrs`); 
               });
         });
      }).then(() => {
         pg_client.end();
      }).catch(err => {
         console.log(err);
      });
   }
};