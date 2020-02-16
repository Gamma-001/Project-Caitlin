const { Command } = require('klasa');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'ping',
         enabled: true,
         description: 'Ping me to check the connection',
         runIn: ['dm', 'group', 'text'],
         cooldown: 0
      });
   }
   async run(msg, [...args]) {
      const client = this.client;
      msg.channel.send('Ping?').then(ms => {
         ms.edit(`Pong! 🏓\n 💫 | Roundtrip took ${ms.createdTimestamp - msg.createdTimestamp}ms \n 💞 | Heartbeat ${Math.round(client.ws.ping*10)/10}ms`);
      });
   }
}