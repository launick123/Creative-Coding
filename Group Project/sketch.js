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
let ct = 0;
let borderWidth =15;
let mic;
let pitch;
let audioContext;
let mouseXBounds;
let mouseYBounds;
const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';

let colors = [];

function setup() {
  my_canvas = createCanvas(800, 800);
  background(220);
  grammar = createTraceryGrammar();
  
  //creates a picture frame
  stroke('black');
  strokeWeight(4);
  fill('rgb(146,96,22)');
  rect(3,3,width-6, height-6);
  fill('rgb(247, 247, 247)');
  rect(borderWidth,borderWidth,width-(2*borderWidth), height-(2*borderWidth), 5);
  
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
    else if(mouseY > height - borderWidth)
      mouseYBounds = height - borderWidth;
    ellipse(mouseXBounds, mouseYBounds, mic.getLevel() * 400);
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
        
        start = true;
        stroke('black');
        strokeWeight(4);
        fill('rgb(146,96,22)');
        rect(3,3,width-6, height-6);
        fill('rgb(247, 247, 247)');
        rect(borderWidth,borderWidth,width-(2*borderWidth), height-(2*borderWidth),5);
        noStroke();
        noFill();
    }
    }
  }
  
  if (keyCode == 67){ // clears drawing
    clear();
    stroke('black');
    strokeWeight(4);
    fill('rgb(146,96,22)');
    rect(3,3,width-6, height-6, 5);
    fill('rgb(247, 247, 247)');
    rect(borderWidth,borderWidth,width-(2*borderWidth), height-(2*borderWidth));
    noStroke();
    noFill();
  }
  
  if(keyCode === CONTROL){
      saveCanvas(my_canvas,"voice_art_screenshot","png"); //takes screenshot
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