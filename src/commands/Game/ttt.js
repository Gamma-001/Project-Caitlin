const { Command } = require('klasa');
const zero  = ':o2:';
const cross = ':regional_indicator_x:';

const strGrid = (grid) => {
   let str = ''
   for(let i = 0;i != 3; i++) {
      str += grid[i].join(' ')+'\n';
   }
   return str;
};

const reactAll = (nums, ms, index) => {
   if(index > 8) {
      return;
   }
   ms.then(m => {
      m.react(nums[index]).then(m1 => {
         return reactAll(nums, ms, index+1);
      });
   });
};

const movesLeft = (grid) => {
   for(let i = 0;i != 3; i++) {
      for(let j = 0;j != 3; j++) {
         if(grid[i][j] === ':white_large_square:')
            return true;
      }
   }
   return false;
};

const highlight = (points, grid) => {
   for(let i = 0;i != 3; i++) {
      grid[points[i][0]][points[i][1]] = `||${grid[points[i][0]][points[i][1]]}||`;
   }
   return;
}

const checkWinner = (grid) => {
   for(let i = 0;i != 3; i++) {
      if((grid[i][0] === grid[i][1]) && (grid[i][0] === grid[i][2])) {
         if(grid[i][0] == cross) return [0, [[i, 0], [i, 1], [i, 2]]];
         if(grid[i][0] == zero) return [1, [[i, 0], [i, 1], [i, 2]]];
      }
      else if((grid[0][i] === grid[1][i]) && (grid[0][i] === grid[2][i])) {
         if(grid[0][i] == cross) return [0, [[0, i], [1, i], [2, i]]];
         if(grid[0][i] == zero) return [1, [[0, i], [1, i], [2, i]]];
      }
   }
   if((grid[0][0] === grid[1][1]) && (grid[0][0] == grid[2][2])) {
      if(grid[0][0] == cross) return [0, [[0, 0], [1, 1], [2, 2]]];
      if(grid[0][0] == zero) return [1, [[0, 0], [1, 1], [2, 2]]];
   }
   if ((grid[0][2] === grid[1][1]) && (grid[0][2] == grid[2][0])) {
      if(grid[0][2] == cross) return [0, [[0, 2], [1, 1], [2, 0]]];
      if(grid[0][2] == zero) return [1, [[0, 2], [1, 1], [2, 0]]];
   }
   return -1;
};

let time = 0;

module.exports = class extends Command{
   constructor(...args) {
      super(...args, {
         name: 'ttt',
         enabled: true,
         description: 'Start a game of tictactoe with someone',
         runIn: ['text', 'group'],
         cooldown: 30
      });
   }
   async run(msg, [...args]) {
      let players = [msg.author, msg.mentions.users.first()||0];
      if(!players[1] || players[1].id == msg.author.id) {
         return msg.channel.send('You need to mention a user');
      }
      else if(players[1]) {
         if(players[1].bot) {
            return msg.channel.send('You can\'t play against a bot');
         }
      }
      let confirm = msg.channel.send(`${players[1]}, you have been challenged by ${players[0]} for a match of tic tac toe \nReply with yes/no`);
      const filter = (ms) => {return ms.author.id === players[1].id};
      msg.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time']}).then(collected => {
         let response = collected.first();
         if(response.content.match(/(yes|yeah|yea|yas|yup)/gi)) {
            confirm.then(ms => ms.delete());
            this.startGame(msg, players);
         }
         else {
            return confirm.then(ms => ms.edit(`${players[0]}, **${players[1]}** has denied your challenge.`));
         }
      });
   }
   async startGame(msg, players) {
      const sym = [cross, zero];
      const empty = ':white_large_square:';
      const nums = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣'];
      let grid = [];
      for(let i = 0;i != 3; i++) {
         grid.push([empty, empty, empty]);
      }
      let Embed = {
         description: strGrid(grid)
      }
      let ms = msg.channel.send({embed: Embed}).then(ms => {return ms;});
      reactAll(nums, ms, 0);
      let turn = Math.floor(Math.random()*2);
      let buffer = msg.channel.send(`Turn for ${players[turn]},  you have ${sym[turn]}`).then(m => {return m;});
      const filter = (reaction, user) => {return true};
      ms.then(message => {
         const reactionCollector =  message.createReactionCollector(filter, {time: 600000});
         reactionCollector.on('collect', (reaction, user) => {
            const index = nums.indexOf(reaction.emoji.name);
            const y = Math.floor(index/3);
            const x = index%3;
            if(index === -1 ) return;
            else if(user.id == players[turn].id && grid[y][x] === ':white_large_square:') {
               grid[y][x] = sym[turn];
               turn = (turn + 1)%2;
               buffer = buffer.then(m => {
                  let winner = checkWinner(grid);
                  if(movesLeft(grid) && checkWinner(grid) === -1) {
                     m.edit(`Turn for ${players[turn]},  you have ${sym[turn]}`);
                     return m;
                  }
                  else if(winner !== -1) {
                     highlight(winner[1], grid);

                     m.edit(`${players[winner[0]]} won the game`);
                     reactionCollector.stop();
                     return m;
                  }
                  else if(!movesLeft(grid)) {
                     m.edit(`The match between ${players[0]} and ${players[1]} was a draw`);
                     reactionCollector.stop();
                     return m;
                  }
               });
               ms = ms.then(m => {
                  let Embed = {
                     color: 0xdc143c,
                     description: strGrid(grid)
                  }
                  m.edit({embed: Embed});
                  return m;
               });
            }
         });
         reactionCollector.on('end', (collection, reason) => {
            message.reactions.removeAll();
         });
      });
   }
};