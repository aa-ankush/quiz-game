
document.addEventListener('DOMContentLoaded', function() {
    const addQuestionBtn = document.getElementById('add-question');
    const questionsContainer = document.getElementById('questions-container');
    const savedQuizzesContainer = document.getElementById('saved-quizzes-container');
    
    let quizCounter = 0;

    // Listen for clicks on the "Add question to quiz" button
    addQuestionBtn.addEventListener('click', function(event) {
        event.preventDefault(); // Stop the form from submitting

        const form = questionsContainer.querySelector('form');
        
        // --- 1. Read data from the form ---
        const questionText = form.querySelector('#question').value.trim();
        const options = [];
        form.querySelectorAll('.option input[type="text"]').forEach(input => {
            options.push(input.value.trim());
        });
        
        // Find which answer was marked as correct by clicking the letter
        // Note: You need to add the logic to mark a letter as correct first.
        // For now, let's assume the first option is correct if none is marked.
        let correctAnswer = options[0]; // Default to first option
        const correctLetterSpan = form.querySelector('.option-letter.correct');
        if (correctLetterSpan) {
            const correctIndex = 'ABCD'.indexOf(correctLetterSpan.textContent);
            correctAnswer = options[correctIndex];
        }

        // Basic validation
        if (!questionText || options.some(opt => opt === '')) {
            alert('Please fill in the question and all four options.');
            return;
        }

        quizCounter++;
        const quizData = {
            id: `quiz-${quizCounter}`,
            title: `Quiz #${quizCounter}`,
            question: questionText,
            options: options,
            correctAnswer: correctAnswer
        };

        // --- 2. Create a new block for the quiz ---
        const newQuizBlock = document.createElement('div');
        // Use the 'content2' class to get a similar style
        newQuizBlock.className = 'content2 saved-quiz-block'; 
        
        newQuizBlock.innerHTML = `
            <h2>${quizData.title}</h2>
            <p>${quizData.question}</p>
            <button class="play-quiz-btn" data-quiz-id="${quizData.id}">Play Quiz</button>
        `;
        
        // --- 3. Append the new block to the page ---
        savedQuizzesContainer.appendChild(newQuizBlock);

        // --- 4. Add "Play" functionality ---
        newQuizBlock.querySelector('.play-quiz-btn').addEventListener('click', function() {
            playQuiz(quizData);
        });

        // --- 5. Clear the form for the next entry ---
        form.reset();
        // You may need to also remove any 'correct' class from the letters
        form.querySelectorAll('.option-letter.correct').forEach(el => {
            el.classList.remove('correct');
        });
    });

    /**
     * A simple function to "play" the quiz using alerts.
     */
    function playQuiz(quiz) {
        // Create a prompt with the options
        const answer = prompt(
            `${quiz.question}\n\n` +
            `1. ${quiz.options[0]}\n` +
            `2. ${quiz.options[1]}\n` +
            `3. ${quiz.options[2]}\n` +
            `4. ${quiz.options[3]}\n\n` +
            `Enter the number of your answer (1-4).`
        );
        
        if (answer) {
            const selectedOption = quiz.options[parseInt(answer) - 1];
            if (selectedOption && selectedOption === quiz.correctAnswer) {
                alert('Correct! Well done.');
            } else {
                alert(`Sorry, that's incorrect. The correct answer was: ${quiz.correctAnswer}`);
            }
        }
    }

    // You should also add the click listener to mark an answer as correct
    questionsContainer.querySelectorAll('.option-letter').forEach(letter => {
        letter.addEventListener('click', () => {
            // First, remove 'correct' from any other letter in the same form
            letter.closest('.answer-options').querySelectorAll('.option-letter').forEach(el => el.classList.remove('correct'));
            // Then, add it to the one that was clicked
            letter.classList.add('correct');
        });
    });
});


// ... (Keep your existing quizQuestions array here) ...
// Example:
var quizQuestions = [
  { question: "what is the 8*14 ?", options: ["84", "112", "144", "256"], correctAnswer: "84" },
  // ... other questions
];

var currentIndex = 0;
var correctCount = 0; // Track correct answers specifically for scoreboard
var timerValue = 60;
var timerId = null;
var timeOver = false;

// ... (Keep your existing showQuestion function) ...

// UPDATE: Modified click event inside showQuestion to track score
// Inside showQuestion function loop:
    // ...
    label.onclick = function () {
      if (timeOver) return;
      
      // Remove old styles
      var allLabels = document.querySelectorAll(".option-label");
      for (var k = 0; k < allLabels.length; k++) {
        allLabels[k].classList.remove("correct");
        allLabels[k].classList.remove("wrong");
      }

      var chosen = this.querySelector("input").value;
      var correctAns = quizQuestions[currentIndex].correctAnswer;

      // Check answer
      if (chosen === correctAns) {
        this.classList.add("correct");
        // Only increment if not already answered correctly (to avoid double counting if user clicks multiple times)
        if (!this.dataset.alreadyCorrect) {
            correctCount++;
            this.dataset.alreadyCorrect = "true"; 
        }
      } else {
        this.classList.add("wrong");
        // If they change from correct to wrong, decrement
        if (this.dataset.alreadyCorrect) {
            correctCount--;
            delete this.dataset.alreadyCorrect;
        }
      }
    };
    // ...

// UPDATE: Finish Quiz Function
function finishQuiz() {
  clearInterval(timerId);
  
  // 1. Save results to LocalStorage
  localStorage.setItem("quizCorrect", correctCount);
  localStorage.setItem("quizTotal", quizQuestions.length);
  
  // 2. Redirect to scoreboard page
  window.location.href = "score.html";
}

// UPDATE: Next Button Logic
document.getElementById("next-btn").onclick = function () {
  if (currentIndex < quizQuestions.length - 1) {
    currentIndex++;
    showQuestion(currentIndex);
  } else {
    // If it's the last question, clicking Next finishes the quiz
    finishQuiz();
  }
};

// UPDATE: Timer Logic
function startTimer() {
  timerId = setInterval(function () {
    var timeSpan = document.getElementById("time");
    if (timerValue > 0) {
      timerValue--;
      timeSpan.innerText = "0:" + (timerValue < 10 ? "0" + timerValue : timerValue);
    } else {
      // Time is up!
      clearInterval(timerId);
      timeOver = true;
      // Optional: Show correct answer first, then redirect after a delay
      showCorrectAnswer();
      setTimeout(finishQuiz, 2000); // Wait 2 seconds then go to scoreboard
    }
  }, 1000);
}

// ... (Keep the rest of your initialization code) ...
