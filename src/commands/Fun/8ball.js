const { Command } = require('klasa');
const random_name = require('node-random-name');

const WHAT = function(action, tense) {
   this.phrases = {
      "do": {
         "past": [
            'Cooked something', 'Ate something', 'Slept', 'Ran on the treadmill','Planned something evil', 'Changed the world',
            'Played video games', 'Studied', 'Procrastinated', 'Went outside', 'Focused on work', 'Spent time with someone',
            'Cured cancer', 'Worked out', 'Fed animals', 'Got a job'
         ],
         "present": [
            'Cook something', 'Eat something', 'Sleep', 'Run on the treadmill','Plan something evil', 'Change the world',
            'Play video games', 'Study', 'Procrastinate', 'Go outside', 'Focus on work', 'Spend time with someone',
            'Cure cancer', 'Work out', 'Feed animals', 'Get a job'
         ]
      },
      "is": [
         'A vehicle', 'An animal', 'A human', 'A robot', 'An alien', 'Something humans haven\'t discovered yet',
         'A non living thing', 'An insect', 'A coward', 'A very brave person', 'A boy', 'A girl', 'A kid',
         'A very old person', 'A superhero', 'A doctor', 'A scientist', 'An engineer', 'A janitor', 'A psychopath',
         'A genius', 'A teacher', 'Unemployed', 'A gamer'
      ]
   };
   this.fetch = () => {
      let answer = '';
      if(action === 'do') answer = this.phrases.do[tense];
      else if(action === 'is') answer = this.phrases.is
      return answer[Math.floor(Math.random()*answer.length)];
   };
};

const HOW = function(action) {
   this.phrases = {
      "many": [
         'Too many', 'Very few', 'Infinitely less', 'Infinitely many', 'About ...', 'Between ... and ___', 'Zero',
         'Numerous', 'More than ...', 'Less than ...'
      ],
      "much": [
         'about ...', 'Too much', 'A little', 'Zero', 'More than ...', 'Less than ...', 'Just enough', 'I don\'t know',
         'cant\'t be expressed with words'
      ],
      "do": [
         'By using martial arts', 'By using brain', 'Using a deadly weapon', 'Using a soft toy', 'Using a vehicle',
         'By using common sense', 'Using demonic powers', 'Using wit', 'Using physical strength'
      ],
      "is": [
         'No one knows', 'I think you know the answer', 'Don\'t ask me that', 'It is cuz it is','Just fine', 
         'No one knows', 'Really good', 'Worse than anything', 'More than best', 'cant\'t be expressed in words'
      ]
   }
   this.fetch = () => {
      let answers = this.phrases[action];
      answer = answers[Math.floor(Math.random()*answers.length)];
      let first = Math.floor(Math.random()*1000) + Math.floor(Math.random()*(Math.floor(Math.random()*10000)));
      answer = answer.replace('...', first);
      answer = answer.replace('___', first + Math.floor(Math.random()*1000));
      return answer;
   };
}

const WHY = function() {
   this.reasons = [
      'Why not?', 'To seek vengeance', 'Because stuff happens', 'Because no one cares', 'Because of you',
      'No one knows', 'I don\'t really know', 'Only you know the answer', 'Anything can happen in this world',
      'For yourself', 'To get to the other side', 'To get eaten by animals', 'To become eternal', 
      'To find the meaning of life', 'It\'s a secret I can\'t disclose'
   ];
   this.fetch = () => {
      return this.reasons[Math.floor(Math.random()*this.reasons.length)];
   };
}

const WHEN = function(tense) {
   this.times = {
      "past": ['before ...', '... before now', '... ago', 'right now'],
      "future": ['after ...', '... later', '... after now', 'right now']
   };
   this.types = [
      'centuries', 'years', 'months', 'weeks', 'days', 'hours', 'minute', 'seconds'
   ];
   this.fetch = () => {
      let answer = this.times[tense][Math.floor(Math.random()*this.times[tense].length)];
      answer = answer.replace('...', `${Math.floor(Math.random()*500)} ${this.types[Math.floor(Math.random()*this.types.length)]}`);
      return answer;
   };
}

const WHERE = function() {
   this.places = [
      'North America', 'South America', 'Europe', 'Africa', 'Asia', 'Antarctica', 'Australia',
      'Pacific Ocean', 'Arctic Ocean', 'Antarctic Ocean', 'Indian Ocean', 'Atlantic Ocean',
      'the Universe', 'on Earth', 'on Mars', 'on a habitual planet', 'in a building', 'in heaven',
      'in hell'
   ];
   this.fetch = () => {
      let place = 'Somewhere in ' + this.places[Math.floor(Math.random()*this.places.length)];
      return place;
   }
}

const WHO = function() {
   this.names = [
      random_name(), 'You', 'Me', 'Your friend', 'Your relative', 'A stranger', 'Someone you know',
      'Sorry, but I don\'t really know'
   ];
   this.fetch = () => {
      return this.names[Math.floor(Math.random()*this.names.length)];
   };
}

const ELSE = function() {
   this.reply = [
      'Yes!', 'No!', 'Maybe', 'I don\'t know', 'I think you know the answer', 'Of course yes.',
      'Of course no.', 'Ask the person next to you.', 'I\'ll pass', 'I can\'t understand, can you repeat?',
      'Use your own brain', 'Okay'
   ];
   this.fetch = () => {
      return this.reply[Math.floor(Math.random()*this.reply.length)];
   }
}

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         description: 'Ask me a question.',
         usage: '<question:string> [...]',
         usageDelim: ' ',
      });
   }
   async run(message, [...question]) {
      let answer = '';
      question = question.join(' ');
      if(question.match(/what/gi)) {
         if(question.match(/ (did||was||done) /gi)) answer = new WHAT('do', 'past');
         else if(question.match(/ (do||will||should||can||must||may||would||could) /gi)) answer = new WHAT('do', 'present');
         else if(question.match(/ (is||are||am) /gi)) answer = new WHAT('is', '');
      }
      else if(question.match(/how/gi)) {
         if(question.match(/ many[^a-zA-Z]*/gi)) answer = new HOW('many');
         else if(question.match(/ much[^a-zA-Z]*/gi)) answer = new HOW('much');
         else if(question.match(/ (was||is||am||are) /gi)) answer = new HOW('is');
         else if(question.match(/ (do||did||should||will||can||must||may||could||would) /gi)) answer = new HOW('do');
      }
      else if(question.match(/why/gi)) 
         answer = new WHY();
      else if(question.match(/when/gi)) {
         if(question.match(/[( did )( was )]/gi)) answer = new WHEN('past');
         else answer = new WHEN('future');
      }
      else if(question.match(/where/gi))
         answer = new WHERE();
      else if(question.match(/who/gi)) answer = new WHO();
      if(!answer || answer === '') {
         answer = new ELSE();
      }
      message.channel.send(`>>> :8ball: ${question}\n\`\`\`css\n${answer.fetch()}\`\`\``);
   }
};
