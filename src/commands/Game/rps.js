const { Command } = require('klasa');

let startGame = (msg, player, IDS, ms) => {
   const client = msg.client;
   let count = [0, 0];
   let responses = [];
   let emojis = ['✊', '🖐', '✌'];
   player[0].send('React with ✊, 🖐 or ✌')
      .then(m => {
         m.react('✊');
         m.react('🖐');
         m.react('✌');
      })
      .catch(err => {
         msg.channel.send(`Error occured while trying to DM ${player[0]}`);
      });
   player[1].send('React with ✊, 🖐 or ✌')
      .then(m => {
         m.react('✊');
         m.react('🖐');
         m.react('✌');
      })
      .catch(err => {
         msg.channel.send(`Error occured while trying to DM ${player[1]}`);
      });
   client.on('messageReactionAdd', function Ready(reaction, user) {
      const MSG = reaction.message;
      if(MSG.channel.type == 'dm' && IDS.includes(user.id) && count[IDS.indexOf(user.id)] === 0) {
         let index = IDS.indexOf(user.id);
         let React = reaction.emoji.name;
         if(emojis.includes(React)) {
            responses[index] = React;
            ms = ms.then(MS => {
               MS.edit(`Got response from ${user}`);
               return MS;
            });
            count[index] += 1;
         }
         else {
            user.send('Invalid respose, try again');
         }
      }
      if(count[0] + count[1] === 2) {
      
         if((responses[0] == '✊' && responses[1] == '✌')  || 
            (responses[0] == '✌' && responses[1] == '🖐') ||
            (responses[0] == '🖐' && responses[1] == '✊')) {
            msg.channel.send(`${player[0]} won by choosing ${responses[0]} against ${player[1]} who chose ${responses[1]}`);
         }
         else if(responses[0] === responses[1]) {
            msg.channel.send(`The match was a draw, both ${player[0]} and ${player[1]} chose ${responses[0]}`);
         }
         else {
            msg.channel.send(`${player[1]} won by choosing ${responses[1]} against ${player[0]} who chose ${responses[0]}`);
         }
         client.removeListener('messageReactionAdd', Ready);
      }
   });
};

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'rps',
         enabled: true,
         description: 'Play a match of rock paper scissors with someone',
         runIn: ['text', 'group'],
         cooldown: 30
      });
   }
   async run(msg) {
      if(!msg.mentions.users.first()) {
         return msg.channel.send(`${msg.author} You need to mention a user`);
      }
      let player = [msg.author, msg.mentions.users.first()];
      let IDS = player.map(u => {return u.id});
      if(player[1].bot) {
         return msg.channel.send(`${player[0]} you cannot play against a bot`);
      }
      const YES = ['ya', 'ye', 'yo', 'yu', 'yi'];
      const NO = ['na', 'no', 'ni', 'ne', 'nu'];
      const filter = ms => (ms.author.id == IDS[1]);
      let ms = msg.channel.send(`${player[1]}, you've been challenged for rock paper scissor by ${player[0].username}\nReply with yes or no`).then(MS => {return MS;});
      msg.channel.awaitMessages(filter, {max: 1, time: 60000, errors: ['time']})
         .then(collected => {
            let res = collected.first().content.slice(0, 2).toLowerCase();
            if(YES.includes(res)) {
               ms = ms.then(MS => {
                  MS.edit(`Check your DMs ${player[0]} and ${player[1]} 📥`);
                  return MS;
               });
               startGame(msg, player, IDS, ms);
            }
            else if(NO.includes(res)) {
               msg.reply(`${player[1].username} has rejected your request.`);
            }
            else {
               msg.channel.send('Received invalid response');
            }
         }).catch(err => {
            msg.reply(`${player[1].username} didn't reply on time`);
            console.log(err);
         });
   }
};