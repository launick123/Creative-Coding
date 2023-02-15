let img ,img2, space;


function setup() {
    createCanvas(1980, 1000, WEBGL);

    img = loadImage('earth.jpg');
    img2 = loadImage('moon.jpg');
    space = loadImage('')
  }
  
  function draw() {
    background(0);
    
    orbitControl();

    //earth
    push();
    //rotateZ(frameCount * 0.01);
    //rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);
    rotate(-0.1)
    texture(img);
    sphere(200);
    pop();

    
    push();
    translate(300,-100,300);
    rotateY(frameCount * 0.01);
    texture(img2);
    sphere(40);
    pop();

    
  }