// M_1_5_02
//
// Generative Gestaltung – Creative Coding im Web
// ISBN: 978-3-87439-902-9, First Edition, Hermann Schmidt, Mainz, 2018
// Benedikt Groß, Hartmut Bohnacker, Julia Laub, Claudius Lazzeroni
// with contributions by Joey Lee and Niels Poldervaart
// Copyright 2018
//
// http://www.generative-gestaltung.de
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * noise values (noise 2d) are used to animate a bunch of agents.
 *
 * KEYS
 * 1-2                 : switch noise mode
 * space               : new noise seed
 * backspace           : clear screen
 * s                   : save png
 */



var songs = [ "sawsquarenoise_-_05_-_Rito_Oculto.mp3", "pumkin_spice_edit.mp3", "lobo_loco_edit.mp3"];
let song, fft, button, bass, mid, treble, mapMid, scaleMid, mapTreble, scaleTreble, mapbass,scalebass, specturm;
let base = false;

function setup(){
  song = loadSound(songs[Math.floor(random(songs.length))]);
	fft = new p5.FFT();
  button = createButton("play");
  button.addClass("playbutton");
  button.mousePressed(togglePlaying);
  
}

function draw(){
  var radius = 200;
  spectrum = fft.analyze();
  bass = fft.getEnergy("bass");
  mid = fft.getEnergy("mid");
  treble = fft.getEnergy("treble");
  mapMid = map(mid, 0, 255, -radius, radius);
	scaleMid = map(mid, 0, 255, -1.5, 1.5);
	mapTreble = map(treble, 0, 255, -radius, radius);
	scaleTreble = map(treble, 0, 255, 1, 1.5);
	mapbass = map(bass, 0, 255, -100, 800);
	scalebass = map(bass, 0, 255, 0.5, 2);
}



var sketch = function(p) {
  var agents = [];
  var agentCount = 4000;
  var noiseScale = 300;
  var noiseStrength = 10;
  var overlayAlpha = 10;
  var agentAlpha = 90;
  var strokeWidth = 0.3;
  var drawMode = 1;
  
  

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);


    for (var i = 0; i < agentCount; i++) {
      agents[i] = new Agent();
    }
  };

  p.draw = function() {
    p.fill(255, overlayAlpha);
    p.noStroke();
    p.rect(0, 0, p.width, p.height);

    // Draw agents
    p.stroke(0, agentAlpha);
    if(base == true){
      for (var i = 0; i < agentCount; i++) {
        if (drawMode == 1) agents[i].update1(mapTreble, noiseStrength, scalebass);
        else agents[i].update2(noiseScale, noiseStrength, scalebass);
      }
    }else{
      p.stroke(0, agentAlpha);
      for (var i = 0; i < agentCount; i++) {
        if (drawMode == 1) agents[i].update1(noiseScale, noiseStrength, strokeWidth);
        else agents[i].update2(noiseScale, noiseStrength, strokeWidth);
      }
    }
    
  };

  p.keyReleased = function() {
    if (p.key == 's' || p.key == 'S') p.saveCanvas(gd.timestamp(), 'png');
    if (p.key == '1') drawMode = 1;
    if (p.key == '2') drawMode = 2;
    if (p.key == ' ') {
      var newNoiseSeed = p.floor(p.random(10000));
      p.noiseSeed(newNoiseSeed);
    }
    if (p.keyCode == p.DELETE || p.keyCode == p.BACKSPACE) p.background(255);
  };
};

function togglePlaying(){
  if (!song.isPlaying()){
    song.play();
   button.html("pause");
   base = true;
 } else{ 
   song.pause();
   button.html("play")
   base = false;
 }
}

var myp5 = new p5(sketch);
