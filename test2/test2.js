function setup() {
  createCanvas(windowWidth, windowWidth*(9/16));
  background(0);
}

function draw() {
    stroke(150,150,150);
    fill(255);
    rect(mouseX-25, mouseY-25,50,50);
}

function windowResized(){
  resizeCanvas(windowWidth, windowWidth*(9/16));
  background(0);
}