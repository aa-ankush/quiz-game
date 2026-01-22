document.addEventListener("DOMContentLoaded", function() {
  // 1. Get data from LocalStorage
  // (We convert strings back to numbers using parseInt, or default to 0 if missing)
   // 1. Get data from LocalStorage
  var data = localStorage.getItem("quizResults");
  
  // Calculate Incorrect
  var incorrect = total - correct;
  
  // Calculate Percentage
   if(data) {
    var results = JSON.parse(data);
     var incorrect = results.total - results.correct;

  // 2. Update the HTML elements
  document.getElementById("correct-val").innerText =  results.correct;
  document.getElementById("incorrect-val").innerText = incorrect;
  document.getElementById("total-val").innerText =  results.total;
  document.getElementById("score-percent").innerText = results.percentage + "%";
  
  // Optional: Customize message based on score
  var messageEl = document.querySelector(".message");
  var feedbackEl = document.querySelector(".feedback-text");
  
  if (percent === 100) {
    messageEl.innerText = "Excellent Work!";
    feedbackEl.innerText = "Outstanding performance! You've mastered this topic.";
  } else if (percent >= 70) {
    messageEl.innerText = "Great Job!";
    feedbackEl.innerText = "You have a good grasp of the subject.";
  } else {
    messageEl.innerText = "Keep Practicing!";
    feedbackEl.innerText = "Don't give up, review the material and try again.";
  }
  }
});
