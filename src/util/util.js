const Util = class {
   static fetchAvatar(user, size = 2048) {
      let URL = 'https://cdn.discordapp.com/avatars/';
      URL += user.id+'/';
      URL += user.avatar+`.jpg?size=${size}`;
      return URL;
   }
   static fetchGuildIcon(guild, size = 2048) {
      let URL = 'https://cdn.discordapp.com/icons/';
      URL += guild.id+'/';
      URL += guild.icon+`.jpg?size=${size}`;
      return URL;
   }
};

module.exports = Util;