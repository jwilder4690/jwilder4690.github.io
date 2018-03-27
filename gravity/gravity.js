var groundLevel = 0.8;
var hero; 
var keys = [];

/*///////////////////////////////////////////////////
  Changes canvas based on size of browser window. 
///////////////////////////////////////////////////*/
function setup() {
  createCanvas(windowWidth, windowHeight);
  drawBackground();
  hero = new Hero(100, windowHeight*groundLevel);
}

function keyPressed(){
  if (key.charCodeAt(0) < 255){
    keys[key.charCodeAt(0)] = true;
  }
}

function keyReleased(){
  if (key.charCodeAt(0) < 255){
    keys[key.charCodeAt(0)] = false;
  }
}

function drawBackground(){
  background(100);
  fill(55,55,55);
  rectMode(CORNERS);
  noStroke();
  rect(0,windowHeight*groundLevel, displayWidth, displayHeight);
}

/*///////////////////////////////////////////////////////
  Function is automatically called to resize canvas when 
  browsser window is resized. 
///////////////////////////////////////////////////////*/  
function windowResized(){
  if (width == displayWidth)
  {
    //resizeCanvas(windowWidth-19, windowHeight-19);
  }
  else
  {
    resizeCanvas(windowWidth, windowHeight);
  }
  drawBackground();
  hero.adjustHero(windowWidth, windowHeight);
}

function draw() {
  drawBackground();
  hero.drawHero();
  checkInput();
}

function checkInput(){
  if(keys['A'.charCodeAt(0)])
  {
    hero.moveLeft();
  }
  if(keys['D'.charCodeAt(0)])
  {
    hero.moveRight();
  }
  if(keys[' '.charCodeAt(0)] && !hero.jumping)
  {
    hero.jump();
  }
}

/*/////////////////////////////////////////////////////////////
  Class for Hero object.
/////////////////////////////////////////////////////////////*/
function Hero(x, y){
  this.xPos = x;
  this.yPos = y;
  this.xVel = 5;
  this.yVel = 0;
  this.tall = 50;
  this.wide = 20;
  this.paint = color(0,255,0);
  this.jumping = false;
  
  this.drawHero = function(){
   noStroke();
   fill(this.paint);
   this.yPos -= this.yVel;
   this.applyGravity();
   rect(this.xPos,this.yPos-this.tall, this.xPos+this.wide, this.yPos);
  }
  
  this.adjustHero = function(w,h){
    this.yPos = windowHeight*groundLevel;  
  }
  
  this.moveLeft = function(){
    this.xPos -= this.xVel;
  }
  
  this.moveRight = function(){
    this.xPos += this.xVel;
  }
  
  this.jump = function(){
    this.yVel = 15;
    this.jumping = true;
  }
    
  this.changeColor = function(){
    this.paint = color(255,255,255);
  }
  
  this.applyGravity = function(){ 
    if(this.jumping){ 
      this.yVel -= 1; 
      if(this.yPos >= windowHeight*groundLevel){
        this.yPos = windowHeight*groundLevel;
        this.yVel = 0;
        this.jumping = false;
      }
    }
  }
  
}