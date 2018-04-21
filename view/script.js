const phase1 = ["img/1.gif",
                "img/2.gif",
                "img/3.gif",
                "img/4.gif"];
const phase2 = ["img/5.gif",
                "img/6.gif",
                "img/7.gif",
                "img/8.gif"];               

var divRoot = $("#camera")[0];

// The captured frame's width in pixels
var width = 640;

// The captured frame's height in pixels
var height = 480;

/*
   Face detector configuration - If not specified, defaults to
   affdex.FaceDetectorMode.LARGE_FACES
   affdex.FaceDetectorMode.LARGE_FACES=Faces occupying large portions of the frame
   affdex.FaceDetectorMode.SMALL_FACES=Faces occupying small portions of the frame
*/
var faceMode = affdex.FaceDetectorMode.LARGE_FACES;

//Construct a CameraDetector and specify the image width / height and face detector mode.
var detector = new affdex.CameraDetector(divRoot, width, height, faceMode);

// game variables
var gameRunning;
// if reaches maximum of 400, lose
var score = 0;
// if true, choose batch 1 of pictures
var phase1choice = true;

$('document').ready(function(){
  $("#images").hide();
  gameRunning = false;
  $("#score-counter").width(0);
  $("#score-counter").css("background-color", "white");
})

/*
* Method for starting and ending game
*/
function toggleGame() {
  if (!gameRunning){
      
      console.log("pressed start");
    if (detector && !detector.isRunning) { 
      detector.start();
      console.log('started');
      detector.detectAllEmotions();
    }
    gameRunning = true;
    $(".log").html("Game started! Detecting face...");
    $("#button").html("Quit");
    $("#score-counter").width(0);
    $("#score-counter").css("background-color", "white");
  }
  else {
      console.log("pressed quit");
    $("#images").hide();
    $("#images").css("visibility", "hidden");
    detector.stop();
    gameRunning = false;
    score = 0;
    $("#button").html("Start");
    $("#score-counter").width(0);
    $("#score-counter").css("background-color", "white");
    $(".log").html("Game stopped!");
  }
}

function runGame(){
    
    $("#images").show();
    $("#images").css("visibility", "visible");
}

/*
* Infinitely looping images
*/
$("#images > div:gt(0)").hide();
setInterval(function() { 
  $('#images > div:first')
  .fadeOut(4000)
  .next()
  .fadeIn(4000)
  .end()
  .appendTo('#images');
}, 6000);

/**
*   Updates images depending on batch
* 
*/ 
function chooseBatch(){
  if (phase1choice){
    for (var i = 1; i <= 4; i++){
      $("#pic".concat(i)).attr('src', phase1[i-1]);
    }
    phase1choice = false;
  }
  else {
    for (var i = 1; i <= 4; i++){
      $("#pic".concat(i)).attr('src', phase2[i-1]);
    }
    phase1choice = true;
  }
}

/*
* Updates score, updates score counter bar, and checks for the end of the game;
*/
function checkScore(joy_count, time_stamp){
  score += joy_count;
  if (score > 410) {
    $("#score-counter").width(401);
    triggerEndGame(time_stamp);
  }
  if (gameRunning) {
  // 4 colors: blue if < 100
  if (score < 100){
    $("#score-counter").css("background-color", "blue");
    $(".log").html("Face detected! Try not to laugh...");
  } else if (score < 150) {// green if < 170
    $("#score-counter").css("background-color", "green");
    $(".log").html("Oooooohhh... You're holding a chuckle...");
  } else if (score < 250) {// yellow if < 300
    $("#score-counter").css("background-color", "yellow");
    $(".log").html("I'm a computer and I'm laughing! You're almost there...");
  } else if (score < 350) {// orange if < 350
    $("#score-counter").css("background-color", "orange");
    $(".log").html("Don't wanna lose now!!");
  } else {// else red 
    $("#score-counter").css("background-color", "red");
    $(".log").html("You lost! Good luck next time!");
  }
  if (score < 410)
    $("#score-counter").width(score);
  else
    $("#score-counter").width("auto");
  }
}

/* Displays End Game Message */
function triggerEndGame(time_stamp) {
  console.log('Game has ended after ' + time_stamp);
  gameRunning = false;
  score = 0;
  $("#button").html("Restart");
    $("#images").hide();
    $("#images").css("visibility", "hidden");
  $(".log").html("You lost! Good luck next time!");
  detector.stop();
}


/** Affectiva Methods **/
detector.addEventListener("onStopSuccess", function() { console.log('Detector successfully stopped.')});
detector.addEventListener("onStopFailure", function() { console.log('Detector failed to stop.')});
detector.addEventListener("onResetSuccess", function() { console.log('Detector reset.')});
detector.addEventListener("onResetFailure", function() { console.log('Detector failed to reset.')});
detector.addEventListener("onImageResultsFailure", function (image, timestamp, err_detail) { 
  console.log('Detector failed to capture image. Timestamp: ' + timestamp)
});

detector.addEventListener("onImageResultsSuccess", function (faces, image, timestamp) {
  if (faces.length > 0) {
      runGame();
          // print out a message if no face is detected!
      console.log('Score: ' + score);

      // count the score with each successful joy detect
      var joy = faces[0].emotions.joy;
      joy = joy.toFixed(2);
      joy = Math.round(joy);

      checkScore(joy, timestamp);

      console.log(joy);
  }
    else{
        
    }

});