let data , distance, planet;
let sent = 0;

function preload() {
  data = loadTable('./data.csv', 'csv', 'header');
}

function setup() {
  createCanvas(400, windowHeight);
  distance = data.getColumn("Distance (M mi)");
  planet = data.getColumn("Planets");
}

function draw() {
  background(0);
  for (let i = 0; i < distance.length; i++) {
    rect(i * 40, height - 1, 20, -distance[i] / sent * 8);
    fill(0, 100, 220);
    push();

    translate(i * 40 + 10, height - 1 - distance[i] / sent * 8);
    rotate(radians(-45));
    fill(0, 200, 220);
    text(planet[i], 0, 0);

    translate(10,10);
    text(distance[i],0,0);
    pop();

  }
  if (sent < 40) {
    sent = sent + 1;
  }
}
