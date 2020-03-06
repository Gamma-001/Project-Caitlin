const { Client } = require('pg');
const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         description: 'Check how much credits you have',
         runIn: ['text'],
      });
   }
   async run(message, [...args]) {
      const pg_client = new Client({
         connectionString: process.env.DATABASE_URL,
         ssl: true
      });
      pg_client.connect();
      return pg_client.query(`select credits from users where userid = '${message.author.id}'`).then(res => {
         let credits
         if(res.rows.length)
            credits = res.rows[0].credits;
         else 
            credits = 0
         return message.channel.send(`You have a total of ${credits} credits`);
      }).catch(err => {
         console.log(err);
      }).finally(() => {
         pg_client.end();
      })
   }
};