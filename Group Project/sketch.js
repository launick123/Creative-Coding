// Names: Hitesh Ahuja, Johnny Wong, Achi Mishra, Will Tate, Nicholas Lau

// Referenced https://editor.p5js.org/AndreasRef/sketches/XJKg1XLI
//            https://editor.p5js.org/ChrisOrban/sketches/ryXx1hjWZ
const grammarObj = {
  "origin": ["Try to paint a #color# #thing#"],
  "color": ["Red", "Orange", "Yellow", "Green", "Blue", "Violet"],
  "thing": ["Flower", "House", "Tree", "Robot", "Alien", "Ship", "Planet", "Landscape"]
};
let grammar;
let prompt;
let start = false;
let start1 = true;
let start2 = false;
let start3 = false;
let ct = 0;
let borderWidth =15;
let mic;
let pitch;
let audioContext;
let mouseXBounds;
let mouseYBounds;
const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';

let colors = [];

// Initialize the Image Classifier method with DoodleNet.
let classifier;

// Two variable to hold the label and confidence of the result
let labelSpan;
let confidenceSpan;
let clearButton;
let my_canvas;

function preload() {
classifier = ml5.imageClassifier('DoodleNet');
}

function setup() {
my_canvas = createCanvas(800, 1000);
background(220);
grammar = createTraceryGrammar();

//creates a picture frame
stroke('black');
strokeWeight(4);
fill('rgb(146,96,22)');
rect(3,3,width-6, 800-6);
fill('rgb(247, 247, 247)');
rect(borderWidth,borderWidth,width-(2*borderWidth), 800-(2*borderWidth), 5);

noStroke();
textAlign(CENTER);
fill(0);
textSize(32);
text("Sound Painter",400,300);
textSize(20);
text("Press Space and start talking",400,400);
textSize(18);
text("C will clear the Canvas",250,500);
text("Ctrl takes a screenshot",550,500);
prompt = flattenGrammar();
text(prompt, 400, 600);
noFill();


audioContext = getAudioContext();

mic = new p5.AudioIn();
mic.start(startPitch);

colorMode(HSB);

//drawing recognition setup
classifier.classify(my_canvas.get(0+30, 0+30, 800-30, 1000-200-30), gotResult);
labelSpan = select("#label");
confidenceSpan = select("#confidence");

for(let i = 0; i < 12; i++) {
  let newColor = color(i*360/12, 50, 100, 0.9);
  colors.push(newColor);
}
noStroke();
}

function draw() {
if(start){
  mouseXBounds = mouseX;
  mouseYBounds = mouseY;
  
  if(mouseX < borderWidth)
    mouseXBounds = borderWidth;
  else if(mouseX > width - borderWidth)
    mouseXBounds = width - borderWidth;
  if(mouseY < borderWidth)
    mouseYBounds = borderWidth;
  else if(mouseY > 800 - borderWidth)
    mouseYBounds = 800 - borderWidth;
  if (start1)
    ellipse(mouseXBounds, mouseYBounds, mic.getLevel() * 400);
  if (start2)
    rect(mouseXBounds, mouseYBounds, mic.getLevel() * 400, mic.getLevel() * 400);
  if (start3)
    triangle(mouseXBounds, mouseYBounds, mouseXBounds + 25, mouseYBounds, mouseXBounds + 50, mic.getLevel() * 2);
}
}

function startPitch() {
pitch = ml5.pitchDetection(model_url, audioContext , mic.stream, modelLoaded);
}

function modelLoaded() {
getPitch();
}

function keyPressed(){
if(keyIsPressed == true){
  if(keyCode === 32)
  {
    if(start!=true){
      clear();
  createSideText();
      
      start = true;
      stroke('black');
      strokeWeight(4);
      fill('rgb(146,96,22)');
      rect(3,3,width-6, 800-6);
      fill('rgb(247, 247, 247)');
      rect(borderWidth,borderWidth,width-(2*borderWidth), 800-(2*borderWidth),5);
      noStroke();
      noFill();
  }
  }
}

if (keyCode == 67){ // clears drawing
  clear();
  createSideText();
  stroke('black');
  strokeWeight(4);
  fill('rgb(146,96,22)');
  rect(3,3,width-6, 800-6, 5);
  fill('rgb(247, 247, 247)');
  rect(borderWidth,borderWidth,width-(2*borderWidth), 800-(2*borderWidth));
  noStroke();
  noFill();
}

if (keyCode == 69){
  start1 = true;
  start2 = false;
  start3 = false;
}
if (keyCode == 82){
  start1 = false;
  start2 = true;
  start3 = false;
}
if (keyCode == 84){
  start1 = false;
  start2 = false;
  start3 = true;
}

if(keyCode === CONTROL){
    //saveCanvas(my_canvas,"voice_art_screenshot","png"); //takes screenshot
  //saved_area = my_canvas.get(15, 15, 800-30, 1000-230)
  saved_area = my_canvas.get(0, 0, 800, 1000-200)
  saved_area.save("voice_art_screenshot","png"); //takes screenshot
}
}

function getPitch() {
pitch.getPitch(function(err, frequency) {
  if (frequency) {
    let midiNum = freqToMidi(frequency);
    fill(colors[midiNum % 12]);
  }
  getPitch();
})
}

function createTraceryGrammar() {
// this is not needed if we are not doing node.js
//const tracery = require('tracery-grammar');

return tracery.createGrammar(grammarObj);

}

function flattenGrammar() {
//stroke('black');  
return grammar.flatten("#origin#");
}


function createSideText(){
noStroke();
fill('rgb(247, 247, 247)');
rect(0,0, width, height);
stroke('black');
strokeWeight(4);
fill('rgb(146,96,22)');
rect(3,803,width-6, 200-6);
fill('rgb(247, 247, 247)');
rect(18,816,width-(2*borderWidth), 200-(2*borderWidth), 5);

noStroke();

textSize(18);
fill('black');
text("C will clear the Canvas",250,875);
text("Ctrl takes a screenshot",550,875);


text(prompt, 400, 935);
noFill();
}

function gotResult(error, results) {
// Display error in the console
if (error) {
  console.error(error);
  return;
}
// The results are in an array ordered by confidence.
//console.log(results);
// Show the first label and confidence
//labelSpan.html(results[0].label);
//print(results[0].label)
//print(results[0].label)
//confidenceSpan.html(floor(100 * results[0].confidence));
classifier.classify(my_canvas.get(0+30, 0+30, 800-30, 1000-200-30), gotResult);
}