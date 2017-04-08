var inquirer = require('inquirer');
//import questions from questions.js
var questions = require('./questions.js').allQuestions;
 
//create a constructor for playing both cloze and basic cards
  var Flashcard = function(format, cloze) {
    this.format = format;
    this.cloze = cloze;
    this.partial = format.replace(cloze, '......');
  }

//create constructor to add cloze cards
 var Clozecard = function(text, usercloze){
    this.text = text;
    this.usercloze = usercloze;
    this.match = function(){
    	//make sure that the user cloze entery is part of the the whole statemet 
            if (!text.toLowerCase().includes(usercloze.toLowerCase())) {
               console.log('ERROR: oh no make sure that your cloze is included in your text' );
               return;
            }
            var object = {ask: "", complete: text , cloze: usercloze};

            var flashcardObject = new Flashcard(text, usercloze);
            completeArray.push(flashcardObject);
           // console.log(completeArray);
    }                 
 }
//create a constructor to add basic cards
var Basiccard = function(front, back){
    this.front = front;
    this.back = back;
    this.prepare = function(){
            var object = {ask: "", complete: front , cloze: back};

            var flashcardObject2 = new Flashcard(front, back);
            askArray.push(flashcardObject2);
    }                
 }


var completeArray = [];
var askArray = [];
for (var i = 0; i < questions.length; i++) {
    var x = new Flashcard(questions[i].complete, questions[i].cloze);
    var y = new Flashcard(questions[i].ask, questions[i].cloze);
    completeArray.push(x);
    // console.log(completeArray);
    askArray.push(y);
}
var index = 0;
var correctAnswer = 0;
var wrongAnswer = 0;
function start() {
  inquirer.prompt([{
                type: 'list',
                name: 'basicvscloze',
                message: 'choose one',
        choices: ['play basic cards', 'play cloze cards', 'add cloze cards', 'add basic cards','Exit']
            }
  ]).then(function(response) {
    function play (){

          if (response.basicvscloze === 'Exit') {
          	 console.log('byebye');
          }
          else if(response.basicvscloze === 'add basic cards'){
            inquirer.prompt([{
            message: 'create a front for the card ' + '\ntext: ',
            name: 'userinputtext'
            },
            {
            name: "userinputcloze",
            message: 'create a back for the card ' + '\nanswer: '
            }
      ]).then(function (answers) {
        var newQuestion = new Basiccard(answers.userinputtext, answers.userinputcloze);
        newQuestion.prepare();
        askArray.push(newQuestion);
        inquirer.prompt([
            {
              type: 'confirm',
              message: 'Would you like to add another text?',
              name: 'add'
            }
            ]).then(function (answers) {
                if (answers.add) {
                    play();
                    
                } else {
                    start();
                }    
    })
    })
}


      if(response.basicvscloze === 'add cloze cards'){
            inquirer.prompt([{
            message: 'create a text ' + '\ntext: ',
            name: 'userinputtext'
            },
            {
            name: "userinputcloze",
            message: 'create a cloze ' + '\ncloze: '
            }
      ]).then(function (answers) {
        // console.log('\n');
        var newQuestion = new Clozecard(answers.userinputtext,answers.userinputcloze);
        newQuestion.match();
        completeArray.push(newQuestion);
        inquirer.prompt([
            {
              type: 'confirm',
              message: 'Would you like to add another text?',
              name: 'add'
            }
            ]).then(function (answers) {
                if (answers.add) {
                    play();
                    
                } else {
                    start();
                }    
    })
    })
}
      else if(response.basicvscloze === 'play basic cards'){
            inquirer.prompt([{
            type: 'input',
            message: askArray[index].format + '\nAnswer: ',
            name: 'userAnswer'
            }
    ]).then(function (answers) {
        console.log('\n');
        if (answers.userAnswer.toLowerCase() === askArray[index].cloze) {
            console.log('Correct!');
            correctAnswer++;
        } else {
            console.log('Incorrect!');
            wrongAnswer++;
        }
        console.log(askArray[index].cloze);
        // console.log(questions[index].complete);
        console.log('-------------------------------------\n');
        if (index < askArray.length - 1) {
            index++;
            play();
        } else {
            console.log('Game Over!');
            console.log('Correct Answers: ' + correctAnswer);
            console.log('Incorrect Answers: ' + wrongAnswer);
            console.log('-------------------------------------\n');
            // Prompt the user to play again
            inquirer.prompt([
                {
                    type: 'confirm',
                    message: 'Would you like to play again?',
                    name: 'replay'
                }
            ]).then(function (answers) {
                if (answers.replay) {
                    // Reset the game
                    index = 0;
                    correctAnswer = 0;
                    wrongAnswer = 0;
                    // Begin asking the questions!
                    start();
                } else {
                    // Exit the game
                    console.log("byebye");
                }
            })
        }
    })
    }else if(response.basicvscloze === 'play cloze cards'){
            inquirer.prompt([
        {
            type: 'input',
            message: completeArray[index].partial + '\nAnswer: ',
            name: 'userAnswer'
        }
    ]).then(function (answers) {

        if (answers.userAnswer.toLowerCase() === completeArray[index].cloze) {
            console.log('Correct!');
            correctAnswer++;
        } else {
            console.log('Incorrect!');
            wrongAnswer++;
        }
        // Show the answer
        console.log(completeArray[index].cloze);
        // console.log(questions[index].complete);
        console.log('-------------------------------------\n');
        // proceed to next question
        if (index < completeArray.length - 1) {
            index++;
            play();
        } else {
            console.log('Game Over!');
            console.log('Correct Answers: ' + correctAnswer);
            console.log('Incorrect Answers: ' + wrongAnswer);
            console.log('-------------------------------------\n');
            // Prompt to replay
            inquirer.prompt([
                {
                    type: 'confirm',
                    message: 'Would you like to play again?',
                    name: 'replay'
                }
            ]).then(function (answers) {
                if (answers.replay) {
                    // Reset
                    index = 0;
                    correctAnswer = 0;
                    wrongAnswer = 0;
                    // start again
                    start();
                } else {
                    // Exit 
                    console.log("byebye");
                }
            })
        }
    })
    }
}
play()
})
}
start();