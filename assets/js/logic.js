// variables to keep track of quiz state
var currentQuestionIndex = 0;
//time left value here
var time = 100 ;
var timerId;
var correct;

// variables to reference DOM elements
var questionsEl = document.getElementById('questions');
var timerEl = document.getElementById('time');
var choicesEl = document.getElementById('choices');
var submitBtn = document.getElementById('submit');
var startBtn = document.getElementById('start');
var initialsEl = document.getElementById('initials');
var feedbackEl = document.getElementById('feedback');


function startQuiz() {
  console.log("Clicked start")
  // hide start screen
  var startScreenEl = document.getElementById('start-screen');
  startScreenEl.setAttribute('class', 'hide');

  // un-hide questions section
  questionsEl.removeAttribute('class');

  // start timer
  timerId = setInterval(clockTick, 1000);

  // show starting time
  timerEl.textContent = time.toString();

  getQuestion();
}

function getQuestion() {
  // get current question object from array
  var currentQuestion = questions[currentQuestionIndex];
  // console.log(currentQuestion)
  // console.log(currentQuestion.title)


  // update title with current question
  var titleEl = document.getElementById('question-title');
  titleEl.textContent = currentQuestion.title.toString(); //think dot notation


  // clear out any old question choices
  var choicesEl = document.getElementById('choices');
  choicesEl.innerHTML = '';


  // loop over choices
  for (var i = 0; i < currentQuestion.choices.length ; i++) {
    // create new button for each choice
    var choice = currentQuestion.choices[i];
    var choiceNode = document.createElement('button');
    choiceNode.setAttribute('class', 'choice');
    choiceNode.setAttribute('value', choice);

    choiceNode.textContent = choice;

    // display on the page
    choicesEl.appendChild(choiceNode);
  }
}


function questionClick(event) {
  let questionCorrect = false;
  var buttonEl = event.target;

  // if the clicked element is not a choice button, do nothing.
  if (!buttonEl.matches('.choice')) {
    return;
  }


  // check if user guessed wrong
  if (buttonEl.textContent !== questions[currentQuestionIndex].answer) {
    console.log(buttonEl.textContent)
    console.log(questions[currentQuestionIndex].answer)


    // penalize time
    time = time - 10

    // display new time on page
    timerEl.textContent = time.toString();
    } else { // user is correct :D
      correct++
    questionCorrect = true;
    console.log("User is Right!");
  }


  // https://www.sitepoint.com/delay-sleep-pause-wait/
  if (questionCorrect) { // Flash correct feedback
    let feedbackText = document.getElementById("feedbacktext");
    feedbackText.textContent = "Correct!";
    feedbackEl.setAttribute('class', 'feedback');
    setTimeout(() => {
      feedbackEl.setAttribute('class', 'feedback hide');
      }, 500); // 500 milliseconds
  } else { // Flash wrong feedback
    let feedbackText = document.getElementById("feedbacktext");
    feedbackText.textContent = "Wrong!";
    feedbackEl.setAttribute('class', 'feedback');
    setTimeout(() => {
      feedbackEl.setAttribute('class', 'feedback hide');
    }, 500); // 500 milliseconds
  }


    // check if we've run out of questions or if time ran out?
  console.log(currentQuestionIndex)
  console.log(questions.length)
    if (currentQuestionIndex+1 === questions.length || time <= 0) {
      quizEnd();
    } else {
      currentQuestionIndex++
      getQuestion();
    }
}
function quizEnd() {
  // stop timer
  clearInterval(timerId);

  // show end screen
  var endScreenEl = document.getElementById('end-screen');
  endScreenEl.setAttribute('class', "");

  // show final score
  var finalScoreEl = document.getElementById('final-score');
  finalScoreEl.textContent = time.toString();

  // hide questions section
  var questionsSectionEl = document.getElementById('questions');
  questionsSectionEl.setAttribute('class', 'hide');

}

function clockTick() {
  // update time
  time--
  // decrement the variable we are using to track time
  timerEl.textContent = time.toString() ; // update our time

  // check if user ran out of time
  if (time <= 0) {
    quizEnd();
  }
}

function saveHighscore() {
  // get value of input box
  var initials = initialsEl.value.trim();

  // make sure initials isnt empty
  if (initials !== '') {

    // get saved scores from localstorage, or if not any, set to empty array
    var highscores =
      JSON.parse(localStorage.getItem('highscores')) /* what would go inside the PARSE??*/ || [];

    // format new score object for current user
    var newScore = {
      score: time,
      initials: initials,
    };

    // save to localstorage
    highscores.push(newScore);
    window.localStorage.setItem('highscores', JSON.stringify(highscores));

    // redirect to next page
    window.location.href = '';
  }
}

function checkForEnter(event) {
  // "13" represents the enter key
  if (event.key === 'Enter') {
    saveHighscore();
  }
}

// user clicks button to submit initials
submitBtn.onclick = saveHighscore;

// user clicks button to start quiz
startBtn.onclick = startQuiz;

// user clicks on element containing choices
choicesEl.onclick = questionClick;

initialsEl.onkeyup = checkForEnter;
