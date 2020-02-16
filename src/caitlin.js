const { Client } = require('klasa');

const Presence =  {
   status: 'idle',
   activity: {
      name: 'Caitlin.js|C:help for list of available commands',
      type: 'PLAYING'
   }
};

new Client({
   fetchAllMembers: false,
   presence: Presence,
   prefix: 'c:',
   cmdEditing: true,
   typing: true,
   readyMessage: (client) => `Logged in as caitlin in ${client.guilds.size} guilds`
}).login(process.env.BOT_TOKEN);