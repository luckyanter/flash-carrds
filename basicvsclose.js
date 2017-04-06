var inquirer = require('inquirer');
var questions = [
	{
        ask: "what is the biggest animal?",
 		complete: "the whale is the biggest animal",
		cloze: "whale"
	},
	{
		ask:"which country has the most population?",
		complete: "china has the most population",
		cloze: "china"
	},
	{
        ask: "which state is the sun state?",
 		complete:  "florida is the sun state",
		cloze: "florida"
	},	
]
  
  var Flashcard = function(format, cloze) {
	this.format = format;
	this.cloze = cloze;
	this.partial = format.replace(cloze, '......');
  }

var completeArray = [];
var askArray = [];

for (var i = 0; i < questions.length; i++) {
	var x = new Flashcard(questions[i].complete, questions[i].cloze);
	var y = new Flashcard(questions[i].ask, questions[i].cloze);
	completeArray.push(x);
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
                choices: ['play basic cards', 'play cloze cards']
            }

  ]).then(function(response) {
  	function play (){
      if(response.basicvscloze === 'play basic cards'){
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
		console.log(questions[index].complete);
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
		console.log('\n');

		// Check if the user has guessed correctly
		if (answers.userAnswer.toLowerCase() === completeArray[index].cloze) {
			console.log('Correct!');
			correctAnswer++;
		} else {
			console.log('Incorrect!');
			wrongAnswer++;
		}

		// Show the correct answer
		console.log(questions[index].complete);
		console.log('-------------------------------------\n');

		// Advance to the next question
		if (index < completeArray.length - 1) {
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
    }
}
play()
})
}


start();
