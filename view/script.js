var slideIndex = 0;

function showSlides() {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("dot");
    for (i = 0; i < slides.length; i++) {
       slides[i].style.display = "none";  
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}    
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";  
    dots[slideIndex-1].className += " active";
    setTimeout(showSlides, 5000); // Change image every 5 seconds
}

//Hide the video screen
$(document).ready(function(){
//    $('#affdex_elements').hide();
    //$('#video').hide();
    $('.gameText').hide();
    $('#dots').hide();

});

// SDK Needs to create video and canvas nodes in the DOM in order to function
// Here we are adding those nodes a predefined div.
var divRoot = $("#affdex_elements")[0];
var width = 170;
var height = 120;
var faceMode = affdex.FaceDetectorMode.LARGE_FACES;
//Construct a CameraDetector and specify the image width / height and face detector mode.
var detector = new affdex.CameraDetector(divRoot, width, height, faceMode);

//Enable detection of all Expressions, Emotions and Emojis classifiers.
detector.detectAllEmotions();
detector.detectAllExpressions();
detector.detectAllEmojis();
detector.detectAllAppearance();

//Add a callback to notify when the detector is initialized and ready for runing.
detector.addEventListener("onInitializeSuccess", function() {
  log('#logs', "The detector reports initialized");
  //Display canvas instead of video feed because we want to draw the feature points on it
  $("#face_video_canvas").css("display", "block");
  $("#face_video").css("display", "none");
});

function log(node_name, msg) {
  $(node_name).append("<span>" + msg + "</span><br />")
}

//function executes when Start button is pushed.
function onStart() {
    if (detector && !detector.isRunning) {
        $("#logs").html("");
        detector.start();
    }
    log('#logs', "Clicked the start button");
    //$('#video').show();
    showSlides();
    $('#dots').show();
}

//function executes when the Stop button is pushed.
function onStop() {
  log('#logs', "Clicked the stop button");
  if (detector && detector.isRunning) {
    detector.removeEventListener();
    detector.stop();
  }
};

//function executes when the Reset button is pushed.
function onReset() {
  log('#logs', "Clicked the reset button");
  if (detector && detector.isRunning) {
    detector.reset();

    $('#results').html("");
  }
};

//Add a callback to notify when camera access is allowed
detector.addEventListener("onWebcamConnectSuccess", function() {
  log('#logs', "Webcam access allowed");
  console.log("Webcam access allowed");
});

//Add a callback to notify when camera access is denied
detector.addEventListener("onWebcamConnectFailure", function() {
  log('#logs', "webcam denied");
  console.log("Webcam access denied");
});

//Add a callback to notify when detector is stopped
detector.addEventListener("onStopSuccess", function() {
  log('#logs', "The detector reports stopped");
  $("#results").html("");
});

//Add a callback to receive the results from processing an image.
//The faces object contains the list of the faces detected in an image.
//Faces object contains probabilities for all the different expressions, emotions and appearance metrics
detector.addEventListener("onImageResultsSuccess", function(faces, image,
  timestamp) {
  $('#results').html("");
  log('#results', "Timestamp: " + timestamp.toFixed(2));
  log('#results', "Number of faces found: " + faces.length);
  if (faces.length > 0) {
      var joy = faces[0].emotions.joy;
      joy = joy.toFixed(2);
      joy = Math.round(joy);
      log('#results', "Joy: " + joy);
      
      var anger = faces[0].emotions.anger;
      anger = anger.toFixed(2);
      anger = Math.round(anger);
      log('#results', "anger: " + anger);
      
      var sad = faces[0].emotions.sadness;
      sad = sad.toFixed(2);
      sad = Math.round(sad);
      log('#results', "Sadness: " + sad);
      
      var surprise = faces[0].emotions.surprise;
      surprise = surprise.toFixed(2);
      surprise = Math.round(surprise);
      log('#results', "Surprise: " + surprise);
//    log('#results', "Emotions: " + JSON.stringify(faces[0].emotions,
//      function(key, val) {
//          return val.toFixed ? Number(val.toFixed(0)) : val;
//      }));
//      log('#results', "Expressions: " + JSON.stringify(faces[0].expressions,
//      function(key, val) {
//          return val.toFixed ? Number(val.toFixed(0)) : val;
//      }));

      // Return an emoji of face
      log('#results', "Emoji: " + faces[0].emojis.dominantEmoji);
      //drawFeaturePoints(image, faces[0].featurePoints);
      
      if(faces[0].emotions.joy > 75){
          $('body').css("background-color","yellow");
          $('p').css("color","black");
          $('.gameText').hide();
          $('#happy').show();
      }else if(faces[0].emotions.anger > 75){
          $('body').css("background-color","red");
          $('p').css("color","white");
          $('.gameText').hide();
          $('#notHappy').show();
      }else if(faces[0].emotions.sad > 75){
          $('body').css("background-color","blue");
          $('p').css("color","white");
          $('.gameText').hide();
          $('#notHappy').show();
      }else if(faces[0].emotions.surprise > 75){
          $('body').css("background-color","orange");
          $('p').css("color","white");
          $('.gameText').hide();
          $('#notHappy').show();
      }else{
          $('body').css("background-color","white");
          $('p').css("color","black");
          $('.gameText').hide();
          $('#serious').show();
      }
  }else{
      log('#results', "No Faces detected");
  }
});

//Draw the detected facial feature points on the image
function drawFeaturePoints(img, featurePoints) {
  var contxt = $('#face_video_canvas')[0].getContext('2d');

  var hRatio = contxt.canvas.width / img.width;
  var vRatio = contxt.canvas.height / img.height;
  var ratio = Math.min(hRatio, vRatio);

  contxt.strokeStyle = "#FFFFFF";
  for (var id in featurePoints) {
    contxt.beginPath();
    contxt.arc(featurePoints[id].x,
      featurePoints[id].y, 2, 0, 2 * Math.PI);
    contxt.stroke();

  }
}
