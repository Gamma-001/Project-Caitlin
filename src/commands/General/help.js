const { Command } = require('klasa');
const { fetchAvatar } = require('../../util/util.js');

module.exports = class extends Command {
   constructor(...args) {
		super(...args, {
         description: 'Display help for a command.',
         gaurded: 'true',
         usage: '(command:command)'
      });
      this.createCustomResolver('command', (arg, possible, message) => {
			if (!arg || arg === '') return undefined;
			return this.client.arguments.get('command').run(arg, possible, message);
		});
	}
	async run(message, [command]) {
      const Help = {
         color: 0xdc143c,
         author: {
            name: `Hey, I'm ${this.client.user.username}`,
            icon_url: fetchAvatar(this.client.user, 512)
         },
         description: `Below is the list of all commands currently available`,
         footer: {
            text: `Requested by ${message.author.tag}`,
            icon_url: fetchAvatar(message.author, 512)
         },
         timestamp: message.createdTimestamp
      };
      if (command) {
         Help.author.name = this.client.user.username;
         Help.description  = `\`Name        : \` ${command.name}\n`;
         Help.description += `\`Description : \` ${command.description}\n`;
         Help.description += `\`Usage       : \` ${command.usage.fullUsage(message)}`;
         return message.channel.send({embed: Help});
		}
      let Commands = await this.constructHelpMessage();
      let categories = Object.keys(Commands);
      categories.splice(categories.indexOf('Admin'), 1);
      let general = categories.indexOf('General');
      let temp = categories[general];
      categories[general] = categories[0];
      categories[0] = temp;
      Help.fields = [];
      categories.forEach(command => {
         Help.fields.push({
            name: command + ' Commands',
            value: '`'+Commands[command].join('`,`')+'`'
         });
      });
      Help.fields[categories.length-1].value += `\n\nType **c:help <command>** for more help regarding a specific command\n`;
      return message.channel.send({embed: Help});
	}
   async constructHelpMessage() {
      const helpMsg = {};
      this.client.commands.map(command => {
         if(!helpMsg.hasOwnProperty(command.category)) helpMsg[command.category] = [];
         helpMsg[command.category].push(command.name);
      });
      return helpMsg;
   }
};