const { Command } = require('klasa');

const FLAGS = [
   'ADMINISTRATOR',
   'CREATE_INSTANT_INVITE',
   'KICK_MEMBERS',
   'BAN_MEMBERS',
   'MANAGE_CHANNELS',
   'MANAGE_GUILD',
   'ADD_REACTIONS',
   'VIEW_AUDIT_LOG',
   'PRIORITY_SPEAKER',
   'STREAM',
   'VIEW_CHANNEL',
   'SEND_MESSAGES',
   'SEND_TTS_MESSAGES',
   'MANAGE_MESSAGES',
   'EMBED_LINKS',
   'ATTACH_FILES',
   'READ_MESSAGE_HISTORY',
   'MENTION_EVERYONE',
   'USE_EXTERNAL_EMOJIS',
   'CONNECT',
   'SPEAK',
   'MUTE_MEMBERS',
   'DEAFEN_MEMBERS',
   'MOVE_MEMBERS',
   'USE_VAD',
   'CHANGE_NICKNAME',
   'MANAGE_NICKNAMES',
   'MANAGE_ROLES',
   'MANAGE_WEBHOOKS',
   'MANAGE_EMOJIS'
];

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         enabled: true,
         description: 'Fetch the permissions of a user in the guild',
         runIn: ['text', 'group'],
         cooldown: 10
      });
   }
   async run(msg, [...args]) {
      let perms = '';
      let tmp = '';
      let Member = msg.mentions.members.first()||msg.member;
      for(let i = 0;i != FLAGS.length; i++) {
         tmp = FLAGS[i];
         let space = '';
         for(let i = 0;i < 27-tmp.length; i++) space += ' ';
         if(Member.hasPermission(tmp)) tmp = '☑️ '+tmp+space;
         else tmp = '❌ ' + tmp + space;
         perms += tmp + '\n';
      }
      let Embed = {
         title: `Permissions of ${Member.user.tag}`,
         thumbnail: {
            url: Member.avatarURL
         },
         description: perms,
         footer: {
            text: `Requested by ${msg.author.tag}`
         }
      };
      return msg.channel.send({embed: Embed});
   }
};

