const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         description: 'Claim your semi dailies',
         runIn: ['text'],
         cooldown: 30
      });
   }
   async run(message, [...args]) {
      return this.client.pg_client.query(`select * from users where userid = '${message.author.id}'`).then(res => {
         if(res.rows.length === 0) {
            const add_user = 
            `insert into users (userid, credits, reputations, last_claim, last_rep) 
            values 
            ('${message.author.id}', 0, 0, '2000-01-01T00:00:00.004Z', '2000-01-01T00:00:00.004Z')`;
            return this.client.pg_client.query(add_user);
         }
      }).then(() => {
         return this.client.pg_client.query(`select current_timestamp-last_claim from users where userid = '${message.author.id}'`).then(res => {
            let time = res.rows[0]['?column?'];
            let total = (time.hours||0)*60*60 + (time.minutes||0)*60 + (time.seconds||0);
            let diff = 43200 - total;
            let next_claim = {
               seconds: diff%60,
               minutes: Math.floor(diff/60)%60,
               hours: Math.floor(diff/3600)%60
            }
            if(diff < 0 || time.days)
               return this.client.pg_client.query(`update users set credits = credits + 200, last_claim = current_timestamp where userid = '${message.author.id}'`).then(res => {
                  return message.channel.send(`Successfully claimed 200 dailies come back in 12hrs`); 
               });
            else return message.channel.send(`You can claim your dailies in ${next_claim.hours} hours ${next_claim.minutes} minutes ${next_claim.seconds} seconds`);
         });
      }).catch(err => {
         console.log(err);
      });
   }
};