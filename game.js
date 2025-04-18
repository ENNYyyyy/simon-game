// game.js

var buttonColours      = ["red", "blue", "green", "yellow"];
var gamePattern        = [];
var userClickedPattern = [];

var started       = false;
var level         = 0;
var allowRestart  = true;  // blocks accidental immediate restart

// 1. Start game on pointerup (tap or click), only if restart’s allowed
$(document).on("pointerup", function(e) {
  if (!started && allowRestart && (e.pointerType === "mouse" || e.pointerType === "touch")) {
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
  }
});

// 2. Handle button “taps” via pointerup
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
    // correct so far
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(nextSequence, 1000);
    }
  } else {
    // WRONG: flash red, then prompt restart after a pause
    playSound("wrong");
    $("body").addClass("game-over");
    $("#level-title").text("Game Over");

    allowRestart = false;
    var flashDuration = 700;    // how long the red flash stays
    var recoveryDelay = 700;    // pause before showing restart prompt

    // 1) remove red flash
    setTimeout(function() {
      $("body").removeClass("game-over");
    }, flashDuration);

    // 2) after the flash + delay, show prompt & reset
    setTimeout(function() {
      $("#level-title").text("Press Any Key or Tap to Restart");
      startOver();
      allowRestart = true;
    }, flashDuration + recoveryDelay);
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
  level         = 0;
  gamePattern   = [];
  started       = false;
}
