
var quizQuestions = [
  {
    question: "What is the 8*14 ?",
    options: ["84", "112", "144", "256"],
    correctAnswer: "84"
  },
  {
    question: "What is 5*7 ?",
    options: ["35", "22", "12", "50"],
    correctAnswer: "35"
  },
  {
    question: "2+5 = ?",
    options: ["3", "7", "10", "8"],
    correctAnswer: "7"
  },
  {
    question: "Which is largest?",
    options: ["15", "7", "3", "12"],
    correctAnswer: "15"
  }
];

var currentQuestionIndex = 0;
var selectedAnswer = 0;
var timer = 60; // seconds
var timerInterval = null;
var quizDone = false;
var timeOver = false;
var correctCount = 0;
var answeredCount = 0;

// Show question and options
function showQuestion(index) {
  var quiz = quizQuestions[index];
  var quizContainer = document.getElementById("quiz-container");
  quizContainer.innerHTML = "";

  // Question text
  var qText = document.createElement("div");
  qText.className = "question-text";
  qText.innerText = quiz.question;
  quizContainer.appendChild(qText);

  // Subtext
  var subText = document.createElement("div");
  subText.className = "sub-text";
  subText.innerText = "select the best option";
  quizContainer.appendChild(subText);

  // Options
  var optionsDiv = document.createElement("div");
  optionsDiv.className = "options-list";
  for(var i=0;i<quiz.options.length;i++) {
    var opt = quiz.options[i];
    var label = document.createElement("label");
    label.className = "option-label";
    label.setAttribute("for", "option" + i);

    // Letter Circle
    var letter = document.createElement("span");
    letter.className = "letter";
    letter.innerText = String.fromCharCode(65+i); // A, B, C, D
    label.appendChild(letter);

    // Radio button (hidden visually)
    var input = document.createElement("input");
    input.type = "radio";
    input.id = "option" + i;
    input.name = "option";
    input.value = opt;
    input.style.display = "none";
    label.appendChild(input);

    // Option Text
    var txt = document.createElement("span");
    txt.innerText = opt;
    label.appendChild(txt);

    // Click event for answer selection
    label.onclick = function(e) {
      // Prevent showing answer if quiz ended
      if(timeOver || quizDone) return;

      // Remove all borders first
      var allLabels = document.querySelectorAll('.option-label');
      var alreadyAnswered = false;
     
      for (var j = 0; j < allLabels.length; j++) {
    if (
      allLabels[j].classList.contains("correct") ||
      allLabels[j].classList.contains("wrong")
    ) {
      alreadyAnswered = true;
      break;
    }
  }

   // If already answered once, do not change score again
  if (alreadyAnswered) {
    return;
  }

  // 2. Clear old borders
  for (var k = 0; k < allLabels.length; k++) {
    allLabels[k].classList.remove("correct");
    allLabels[k].classList.remove("wrong");
  }


      // Mark correct/wrong
        // 3. Get chosen answer and correct answer
  selectedAnswer = this.querySelector("input").value;
  var correctAnswer = quizQuestions[currentQuestionIndex].correctAnswer;

      if(selectedAnswer === correctAnswer) {
        this.classList.add("correct");
        document.getElementById("status").innerText = "Correct!";
        correctCount = correctCount + 1;
        }
       else {
        this.classList.add("wrong");
        
        document.getElementById("status").innerText = "Wrong!";
         answeredCount = answeredCount + 1;
        
      }
    };

    optionsDiv.appendChild(label);
  }
  quizContainer.appendChild(optionsDiv);

  // Clear status
  document.getElementById("status").innerText = "";

  // Progress bar and text
  var percent = Math.round(((index+1) / quizQuestions.length) * 100);
  document.getElementById("progress-bar").style.width = percent + "%";
  document.getElementById("progress-text").innerText = percent + "% completed";

  // Disable/enable navigation buttons
   document.getElementById("prev-btn").disabled = (index === 0);
   //document.getElementById("next-btn").disabled = (index === quizQuestions.length-1);

  // Reset selected answer for next/prev question
  selectedAnswer = null;
}

// UPDATE: Finish Quiz Function
// function finishQuiz() {
//   // clearInterval(timerId);
  
//   // // 1. Save results to LocalStorage
//    localStorage.setItem("quizCorrect", selectedAnswer);
//    localStorage.setItem("quizTotal", quizQuestions.length);
  
//   // 2. Redirect to scoreboard page
//   window.location.href = "scoreboard.html";
// }

function finishQuiz() {
  quizDone = true;

  var totalQuestions = quizQuestions.length;
  var percentage = Math.round((correctCount / totalQuestions) * 100);

  var results = {
    correct: correctCount,
    total: totalQuestions,
    percentage: percentage
  };

  localStorage.setItem("quizResults", JSON.stringify(results));
  window.location.href = "scoreboard.html";
}


// Next button logic
document.getElementById("next-btn").onclick = function() {
  
   var checkedOption = document.querySelector('input[name="option"]:checked');

   if (!checkedOption) {
    alert("Please select one of the options.");
    return; // stop here, don't go to next question
  }

  if(currentQuestionIndex < quizQuestions.length - 1) {
    currentQuestionIndex += 1;
    showQuestion(currentQuestionIndex);
    resetTimer();
  }else{
    finishQuiz();
  }
};

// Previous button logic
document.getElementById("prev-btn").onclick = function() {
  if(currentQuestionIndex > 0) {
    currentQuestionIndex -= 1;
    showQuestion(currentQuestionIndex);
    resetTimer();
  }
};

// Timer function
function startTimer() {
  timerInterval = setInterval(function() {
    if(timer > 0) {
      timer -= 1;
      document.getElementById("time").innerText = timer;
    } else {
      clearInterval(timerInterval);
      showCorrectOption();
      quizDone = true;
      document.getElementById("status").innerText = "Time is over! Correct answer is shown.";
    }
  }, 1000);
}

// When time is up, show the correct answer in green automatically
function showCorrectOption() {
  var quiz = quizQuestions[currentQuestionIndex];
  var allLabels = document.querySelectorAll('.option-label');
  for(var i=0;i<allLabels.length;i++) {
    var userAns = allLabels[i].querySelector("input").value;
    if(userAns === quiz.correctAnswer) {
      allLabels[i].classList.add("correct");
    } else {
      allLabels[i].classList.remove("correct");
      allLabels[i].classList.remove("wrong");
    }
  }
}

// Reset timer and quizDone status for next/prev questions
function resetTimer() {
  clearInterval(timerInterval);
  timer = 60;
  quizDone = false;
  document.getElementById("time").innerText = timer;
  startTimer();
}

// Show first question and start timer on page load
showQuestion(currentQuestionIndex);
startTimer();
