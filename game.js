var buttonColours      = ["red", "blue", "green", "yellow"];
var gamePattern        = [];
var userClickedPattern = [];

var started       = false;
var level         = 0;
var allowRestart  = true;

// Start game on pointerup (tap or click), but only when restart’s allowed
$(document).on("pointerup", function(e) {
  if (!started && allowRestart && (e.pointerType === "mouse" || e.pointerType === "touch")) {
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
  }
});

// Handle button “taps”
$(".btn").on("pointerup", function(e) {
  if (e.pointerType !== "mouse" && e.pointerType !== "touch") return;

  var userChosenColour = this.id;
  userClickedPattern.push(userChosenColour);

  playSound(userChosenColour);
  animatePress(userChosenColour);
  checkAnswer(userClickedPattern.length - 1);
});

function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(nextSequence, 1000);
    }
  } else {
    // WRONG: trigger flash and block restart
    playSound("wrong");
    $("body").addClass("game-over");
    $("#level-title").text("Game Over");
    allowRestart = false;

    // 1) Remove the red flash quickly (200ms)
    setTimeout(function() {
      $("body").removeClass("game-over");
    }, 200);

    // 2) After a pause, show restart prompt and reset state (700ms)
    setTimeout(function() {
      $("#level-title").text("Press Any Key or Tap to Restart");
      startOver();
      allowRestart = true;
    }, 700);
  }
}

function nextSequence() {
  userClickedPattern = [];
  level++;
  $("#level-title").text("Level " + level);

  var randomNumber       = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  $("#" + randomChosenColour)
    .fadeIn(100)
    .fadeOut(100)
    .fadeIn(100);

  playSound(randomChosenColour);
}

function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function() {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}

function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function startOver() {
  level       = 0;
  gamePattern = [];
  started     = false;
}
