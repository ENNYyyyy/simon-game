// game.js

var buttonColours      = ["red", "blue", "green", "yellow"];
var gamePattern        = [];
var userClickedPattern = [];
var level              = 0;

// gameState: "notStarted" → "playing" → "gameOver"
var gameState = "notStarted";


// 1) START the game when you tap/click, but only if we're in "notStarted"
$(document).on("pointerup", function(e) {
  if (
    gameState === "notStarted" &&
    (e.pointerType === "mouse" || e.pointerType === "touch")
  ) {
    startGame();
  }
});

// 2) BUTTON TAPS only do something if we're "playing"
$(".btn").on("pointerup", function(e) {
  if (
    gameState !== "playing" ||
    (e.pointerType !== "mouse" && e.pointerType !== "touch")
  ) return;

  var userChosenColour = this.id;
  userClickedPattern.push(userChosenColour);

  playSound(userChosenColour);
  animatePress(userChosenColour);
  checkAnswer(userClickedPattern.length - 1);
});


/** ---- CORE LOGIC ---- **/

function startGame() {
  gamePattern = [];
  level       = 0;
  gameState   = "playing";
  $("#level-title").text("Level " + level);
  nextSequence();
}

function nextSequence() {
  if (gameState !== "playing") return;  // guard!

  userClickedPattern = [];
  level++;
  $("#level-title").text("Level " + level);

  var randomChosenColour = buttonColours[Math.floor(Math.random() * 4)];
  gamePattern.push(randomChosenColour);

  $("#" + randomChosenColour)
    .fadeIn(100)
    .fadeOut(100)
    .fadeIn(100);

  playSound(randomChosenColour);
}

function checkAnswer(currentIndex) {
  if (gamePattern[currentIndex] === userClickedPattern[currentIndex]) {
    // correct so far
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(nextSequence, 1000);
    }
  } else {
    triggerGameOver();
  }
}

function triggerGameOver() {
  // Enter gameOver state immediately
  gameState = "gameOver";
  playSound("wrong");
  $("body").addClass("game-over");
  $("#level-title").text("Game Over");

  // 1) Keep the red flash for 700ms
  setTimeout(function() {
    $("body").removeClass("game-over");
  }, 700);

  // 2) After flash + 300ms pause, go back to notStarted
  setTimeout(function() {
    $("#level-title").text("Press Any Key or Tap to Restart");
    gameState = "notStarted";
  }, 1000);
}


/** ---- UI HELPERS ---- **/

function animatePress(color) {
  $("#" + color).addClass("pressed");
  setTimeout(function() {
    $("#" + color).removeClass("pressed");
  }, 100);
}

function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}
