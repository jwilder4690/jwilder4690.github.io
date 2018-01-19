var canonVector;

function setup() {
  if (width == displayWidth)
  {
    resizeCanvas(windowWidth-19, (windowWidth-19)*(9/16));
  }
  else
  {
    createCanvas(windowWidth, windowWidth*(9/16));
  }
  canonVector = createVector(70,height-150);
  background(0);
}

function draw() {
    stroke(150,150,150);
    fill(255);
    //rect(mouseX-25, mouseY-25,50,50);
    //push();
    //translate(canonVector.x, canonVector.y);
    //rotate(PI/4);  
    rect(canonVector.x, canonVector.y,100,100);
    print(canonVector.x +", "+canonVector.y);
    //pop();
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