var buttonColours      = ["red", "blue", "green", "yellow"];
var gamePattern        = [];
var userClickedPattern = [];

var started       = false;
var level         = 0;
var allowRestart  = true;  // new flag

// 1. Start game on pointerup, but only if restart’s allowed
$(document).on("pointerup", function(e) {
  if (!started && allowRestart && (e.pointerType === "mouse" || e.pointerType === "touch")) {
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
  }
});

// 2. Handle button “taps”
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
    // WRONG ANSWER: play sound + flash, then delay restart
    playSound("wrong");
    $("body").addClass("game-over");
    $("#level-title").text("Game Over!");
    
    allowRestart = false;   // temporarily block restart

    setTimeout(function() {
      $("body").removeClass("game-over");
      $("#level-title").text("Press Any Key or Tap to Restart");
      startOver();          // reset state after the flash
      allowRestart = true;  // now allow restart
    }, 500);                // match this to your flash duration
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
  var btn = $("#" + currentColor);
  btn.addClass("pressed");
  setTimeout(function() {
    btn.removeClass("pressed");
  }, 100);
}

function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

// reset variables
function startOver() {
  level         = 0;
  gamePattern   = [];
  started       = false;
}
