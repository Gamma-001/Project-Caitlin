const urllib = require('urllib');

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
   static searchWiki(name) {
      name = name.replace(/[ ]+/g, '_');
      return urllib.request(`https://en.wikipedia.org/wiki/${name}`).then(res => {
         const data = {};
         const page = res.data.toString();
         const bodyContent = page.match(/<[ ]*div[ ]+class[ ]*=[ ]*('|")mw-parser-output('|")(.*?)<noscript/gims)[0];
   
         let firstPara = bodyContent.match(/<p>(.*?)<\/p>/gims)[0];
         firstPara = firstPara.replace(/<[ ]*a[ ]+href[ ]*=[ ]*('|")#cite_note-(.+?)('|")>(.*?)(?=>)/gims, '');
         firstPara = firstPara.replace(/<(.*?)(?=>)/gi, '').replace(/>/g, '');
         data.firstPara = firstPara;

         let imageURL = bodyContent.match(/<[ ]*img[ ]+(.*)src[ ]*=[ ]*('|")(.*?)('|")(?=>)/gi)[0].match(/('|")(.*?)('|")/gi)[1];
         imageURL = 'https:'+imageURL.replace(/("|')/g, '');
         data.imageURL = imageURL;

         data.link = `https://en.wikipedia.org/wiki/${name}`;
         return data;
      }).catch(err => {
         throw err;
      });
   }
};

module.exports = Util;