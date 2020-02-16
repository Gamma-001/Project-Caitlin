const { Command } = require('klasa');

const invite_max = 'https://discordapp.com/oauth2/authorize?client_id=613749030799015942&scope=bot&permissions=1343089911';
const invite_min = 'https://discordapp.com/oauth2/authorize?client_id=613749030799015942&scope=bot&permissions=380097';

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         description: 'invite me to your server',
         runIn: 'text',
         guarded: true
      });
   }
   async run(message, [...args]) {
      const Embed = {
         author: {
            name: this.client.user.tag,
            icon_url: this.client.user.avatarURL
         },
         description: '',
         footer: {
            text: `Requested by ${message.author.tag}`,
            icon_url: message.author.avatarURL
         }
      }
      Embed.description += `\`Without moderation (minimum permissions) : \` [Click here](${invite_min}) \n`;
      Embed.description += `\`With moderation (full permissions)       : \` [Click here](${invite_max}) \n`;
      Embed.description += `**Feel free to uncheck some permission if you like**`;
      message.channel.send({embed: Embed});
   }
};