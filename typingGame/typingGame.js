var inp;
var counter = 0;

function setup() {
  createCanvas(windowWidth, windowWidth*(9/16));
  background(0);
  var inp = createInput();
  inp.position(width/20,65);
  inp.input(myInputEvent);
}

function myInputEvent() {
  console.log('you are typing: ', this.value()); 
  counter++;
}

function draw() {
  background(counter);
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