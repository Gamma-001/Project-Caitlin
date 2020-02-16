const { Command } = require('klasa');

const p1 = ':red_square:';
const p2 = ':blue_square:';
const empty = ':black_square_button:';
const nums = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣'];

const strGrid = (grid) => {
   let str = ''
   for(let i = 0;i != 6; i++) {
      str += grid[i].join(' ')+'\n';
   }
   return str;
};

const reactAll = (msg, index) => {
   if(index > 6) return msg;
   msg.then(ms => {
      ms.react(nums[index]).then(m => {
         reactAll(msg, index+1);
      });
   })
};

const movesLeft = grid => {
   for(let i = 0;i != 6; i++) {
      for(let j = 0;j != 7; j++) {
         if(grid[i][j] === empty)
            return true;
      }
   }
   return false;
};

const highlight = (grid, a, b, c, d) => {
   grid[a[0]][a[1]] = '||'+grid[a[0]][a[1]]+'||';
   grid[b[0]][b[1]] = '||'+grid[b[0]][b[1]]+'||';
   grid[c[0]][c[1]] = '||'+grid[c[0]][c[1]]+'||';
   grid[d[0]][d[1]] = '||'+grid[d[0]][d[1]]+'||';
};

const checkWinner = grid => {
   for(let i = 0;i != 6; i++) {
      for(let step = 0;step != 4; step++) {
         let first = grid[i][step];
         if((first===grid[i][step+1])&&(first===grid[i][step+2])&&(first===grid[i][step+3])) {
            if([p1, p2].includes(first)) {
               highlight(grid, [i, step], [i, step+1], [i, step+2], [i, step+3]);
               return [p1, p2].indexOf(first);
            }
         }
      }
   }
   for(let j = 0;j != 7; j++) {
      for(let step = 0;step != 3; step++) {
         let first = grid[step][j];
         if((first===grid[step+1][j])&&(first===grid[step+2][j])&&(first===grid[step+3][j])) {
            if([p1, p2].includes(first)) {
               highlight(grid, [step, j], [step+1, j], [step+2, j], [step+3, j]);
               return [p1, p2].indexOf(first);
            }
         } 
      }
   }
   for(let i = 0; i!= 3; i++) {
      for(let j = 0;j != 4; j++) {
         let first = grid[i][j];
         let r_j = 6-j;
         let r_f = grid[i][r_j];
         if((first===grid[i+1][j+1])&&(first===grid[i+2][j+2])&&(first===grid[i+3][j+3])) {
            if([p1, p2].includes(first)) {
               highlight(grid, [i, j], [i+1, j+1], [i+2, j+2], [i+3, j+3]);
               return [p1, p2].indexOf(first);
            }
         }
         if((r_f===grid[i+1][r_j-1])&&(r_f===grid[i+2][r_j-2])&&(r_f===grid[i+3][r_j-3])) {
            if([p1, p2].includes(r_f)) {
               highlight(grid, [i, r_j], [i+1, r_j-1], [i+2, r_j-2], [i+3, r_j-3])
               return [p1, p2].indexOf(r_f);
            }
         }
      }
   }
   return -1;
};

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         name: 'c4',
         enabled: true,
         description: 'Play a game of connect 4 with someone',
         runIn: ['text', 'group'],
         cooldown: 20
      });
   }
   async run(msg, [...args]) {
      const client = msg.client;
      let players = [msg.author, msg.mentions.users.first()];
      if(!players[1]) {
         return msg.channel.send(`You need to mention a valid user`);
      }
      else {
         if(players[1].bot || players[1].id === players[0].id) {
            return msg.channel.send(`You need to mention a valid user`);
         }
      }
      const IDS = players.map(x => x.id);
      let buffer = msg.channel.send(`${players[1]}, You have been challenged on a game of connect 4 by ${players[0]}\nReply with yes/no`).then(ms => {
         return ms;
      });
      const filter = (ms) => {return ms.author.id === players[1].id;}
      msg.channel.awaitMessages(filter, {time: 30000, max: 1, errors: ['time']}).then(collected => {
         let ms = collected.first();
         if(ms.content.match(/(yes|yeah|yea|yas|yup)/gi)) {
            this.startGame(buffer, players);
         }
         else {
            buffer.then(newMSG => {
               newMSG.edit(`${players[0]}, ${players[1].tag} has denied your challenge`);
            });
            return;
         }
      }).catch(err => {
         buffer.then(newMSG => {
            newMSG.edit(`${players[1]} didn\'t respond on time`);
         });
         console.log(err);
      });
   }
   async startGame(msg, players) {
      const IDS = [players[0].id, players[1].id];
      let grid = [];
      let items = [p1, p2];
      let level = [5, 5, 5, 5, 5, 5, 5];
      for(let i = 0;i != 6; i++) {
         let row = [];
         for(let j = 0;j != 7; j++) {
            row.push(empty);
         }
         grid.push(row);
      }
      msg = msg.then(newMSG => {
         newMSG.edit(strGrid(grid));
         return newMSG;
      });
      reactAll(msg, 0);
      let turn = Math.floor(Math.random()*2);
      let buff = msg.then(ms => {
         return ms.channel.send(`Turn for ${players[turn]}, you have ${items[turn]}`).then(m => {
            return m;
         });
      });
      msg.then(message => {
         const filter = (reaction, user) => nums.includes(reaction.emoji.name);
         const reactionCollector = message.createReactionCollector(filter, {time: 600000});
         reactionCollector.on('collect', (reaction, user) => {
            const index = nums.indexOf(reaction.emoji.name);
            if(level[index] < 0) return;
            else if(user.id === IDS[turn] && grid[level[index]][index] === empty) {
               grid[level[index]][index] = items[turn];
               level[index] -= 1;
               turn = (turn + 1)%2;
               let winner = checkWinner(grid);
               if(!movesLeft(grid)) {
                  buff.then(ms => {
                     ms.edit(`The match between ${players[0]} and ${players[1]} was a draw`);
                  }).catch(err => console.log(err));
                  reactionCollector.stop();
               }
               else if(winner !== -1) {
                  buff.then(ms => {
                     ms.edit(`${players[winner]} won the game`);
                  }).catch(err => console.log(err));
                  reactionCollector.stop();
               }
               else {
                  buff = buff.then(MS => {
                     MS.edit(`Turn for ${players[turn]}, you have ${items[turn]}`);
                     return MS;
                  }).catch(err => console.log(err));
               }
               msg = msg.then(ms => {
                  ms.edit(strGrid(grid));
                  return ms;
               });
            }
         });
         reactionCollector.on('end', (collected, reason) => {
            message.reactions.removeAll();
         });
      });
   };
};