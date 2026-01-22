// Beginner-friendly script to load scores

document.addEventListener("DOMContentLoaded", function() {
  
  // 1. Get data from LocalStorage
  var data = localStorage.getItem("quizResults");
  
  if(data) {
    var results = JSON.parse(data);
     var incorrect = results.total - results.correct;
    
    // 2. Update HTML elements
    document.getElementById("score-percent").innerText = results.percentage + "%";
    document.getElementById("correct-val").innerText = results.correct;
    document.getElementById("total-val").innerText = results.total;
    
    // Calculate incorrect
    var incorrect = results.total - results.correct;
    document.getElementById("wrong-val").innerText = incorrect;

    // Optional: Change text based on score
    var title = document.querySelector(".main-title");
    var feedback = document.querySelector(".feedback-text");
    
    if(results.percentage < 50) {
      title.innerText = "Keep Trying!";
      feedback.innerText = "Don't give up, practice makes perfect.";
      document.querySelector(".trophy-icon").style.color = "#f39c12"; // Orange trophy
    } else {
      title.innerText = "Excellent Work!";
      feedback.innerText = "Outstanding performance! You've mastered this topic.";
    }
  } else {
    // If no data found (user opened page directly)
    document.querySelector(".scoreboard-container").innerHTML = "<h2>No quiz results found. Play the quiz first!</h2>";
  }

});
