function setup() {
  if (width == displayWidth)
  {
    resizeCanvas(windowWidth-19, (windowWidth-19)*(9/16));
  }
  else
  {
    createCanvas(windowWidth, windowWidth*(9/16));
  }
  
  background(0);
}

function draw() {
    stroke(150,150,150);
    fill(255);
    rect(mouseX-25, mouseY-25,50,50);
}

function windowResized(){
  if (width == displayWidth)
  {
    resizeCanvas(windowWidth-19, (windowWidth-19)*(9/16));
  }
  else
  {
    resizeCanvas(windowWidth, windowWidth*(9/16));
  }
  background(0);
}