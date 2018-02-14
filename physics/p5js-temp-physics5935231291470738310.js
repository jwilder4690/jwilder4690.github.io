var ballSpacing = 50;
var ballSize = 15;
var balls = [];
var hero;
var velocity = 1/30;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(100);
  var cols = windowWidth/ballSpacing;
  var rows = windowHeight/ballSpacing;
  var counter = 0;
  hero = new Ball(10, 10, 1, 1, ballSize);
  for (var i = 1; i < rows; i++){
    for(var j = 1; j < cols; j++){
      if(i % 2 == 0){
        balls[counter] = new Ball(j*ballSpacing, i*ballSpacing, 0,0, ballSize); 
      }
      else{
        balls[counter] = new Ball((j*ballSpacing)+ballSpacing/2, (i*ballSpacing), 0, 0, ballSize);
      }
      counter++;
    }
  }
}

function draw() {
  background(100);
  fill(255,255,255);
  for(var i = 0; i < balls.length; i++)
  {
    balls[i].drawBall();
  }
  fill(0,255,0);
  hero.drawBall();
  hero.update();
}

function Ball(x, y, xv, yv, size){
 this.xPos = x;
 this.yPos = y;
 this.xVel =  xv;
 this.yVel = yv;
 this.size = size;
 
 this.drawBall = function(){
   noStroke();
   ellipse(this.xPos, this.yPos, this.size, this.size);
 }
 
 this.moveHero = function(){
  this.xVel = 0;
  this.yVel = 0;
  this.xPos = mouseX;
  this.yPos = mouseY;
 }
 this.changeVelocity = function(){
   this.xVel = velocity*(this.xPos - mouseX);
   this.yVel = velocity*(this.yPos - mouseY);
 }
 
 this.update = function(){
    this.xPos += this.xVel;
    this.yPos += this.yVel;
 }
}


function mousePressed(){
  hero.moveHero();
}

function mouseReleased(){
  hero.changeVelocity();
}

function windowResized(){
  if (width == displayWidth)
  {
    resizeCanvas(windowWidth-19, windowHeight-19);
  }
  else
  {
    resizeCanvas(windowWidth, windowHeight);
  }
  background(100);
}