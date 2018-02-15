var ballSpacing = 50;
var ballSize = 15;
var balls = [];
var heros = [];
var velocity = 1.0/30;
var resistance = 0.00007;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(100);
  var cols = windowWidth/ballSpacing;
  var rows = windowHeight/ballSpacing;
  var counter = 0;
  heros[0] = new Ball(10, 10, 1, 1, ballSize);
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
  //for(var i = 0; i < balls.length; i++)
  //{
  //  balls[i].drawBall();
  //}
  fill(0,255,0);
  for(var i = 0; i < heros.length; i++){
    heros[0].drawBall();
    heros[0].update();
    heros[0].checkCollision(balls);
  }
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
   this.xVel = (this.xPos - mouseX);
   this.yVel = (this.yPos - mouseY);
 }
 
 this.update = function(){
    if(this.xPos - this.size <= 0){
      this.xPos = this.size;
      this.xVel = -this.xVel;
      velocity = velocity/1.1
    }
    if(this.xPos + this.size >= windowWidth){
      this.xPos = windowWidth - this.size;
      this.xVel = -this.xVel;
      velocity = velocity/1.1
    }
    if(this.yPos - this.size <= 0){
      this.yPos = this.size;
      this.yVel = -this.yVel;
      velocity = velocity/1.1      
    }
    if(this.yPos + this.size >= windowHeight){
      this.yPos = windowHeight - this.size;
      this.yVel = -this.yVel;
      velocity = velocity/1.1
    }
    
   velocity -= resistance;
   if (velocity < 0) {
     velocity = 0;
   }
    
   this.xPos += this.xVel*velocity;
   this.yPos += this.yVel*velocity;
   


 }
 
 this.checkCollision = function(obstacles){
  //TODO: LOOP THROUGH OBSACLES AND ADJUST HERO VELOCITY IF COLLISION IS DETECTED
 }
}


function mousePressed(){
  velocity = 1/30;
  heros[0].moveHero();
}

function mouseReleased(){
  heros[0].changeVelocity();
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