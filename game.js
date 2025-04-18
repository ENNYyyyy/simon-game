var buttonColours      = ["red", "blue", "green", "yellow"];
var gamePattern        = [];
var userClickedPattern = [];

var started = false;
var level   = 0;

// 1. Start game on ANY pointer up (tap or click)
$(document).on("pointerup", function(e) {
  // only if it’s a mouse or touch event
  if (!started && (e.pointerType === "mouse" || e.pointerType === "touch")) {
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

// rest stays the same…

function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(nextSequence, 1000);
    }
  } else {
    playSound("wrong");
    $("body").addClass("game-over");
    $("#level-title").text("Game Over, Tap or Click to Restart");
    setTimeout(function() {
      $("body").removeClass("game-over");
    }, 200);
    startOver();
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

function startOver() {
  level         = 0;
  gamePattern   = [];
  started       = false;
}
