var groundLevel = 0.8;
var hero; 
var keys = [];
var heroLeft;
var heroRight;
var position = 0;
var boxes = [];
var TOP_LEFT = 0;
var TOP_RIGHT = 1;
var BOT_RIGHT = 2;
var BOT_LEFT = 3;
var UNEXPECTED = 55;

function preload(){
  heroLeft = loadImage("assets/heroLeft.png");
  heroRight = loadImage("assets/heroRight.png");
}

/*///////////////////////////////////////////////////
  Changes canvas based on size of browser window. 
///////////////////////////////////////////////////*/
function setup() {
  createCanvas(windowWidth, windowHeight);
  drawBackground();
  hero = new Hero(windowWidth/2, windowHeight*groundLevel);
  boxes[0] = new Box(300, 300, 400, 330);
  boxes[1] = new Box(700, 100, 750, windowHeight);
  boxes[2] = new Box(1100, 400, 1200, 430);
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
  rect(-6000,windowHeight*groundLevel, 6000, displayHeight);
  for(var i = 0; i < boxes.length; i++){
    boxes[i].drawBox();
  }
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
  var tempX = hero.xPos;
  var tempY = hero.yPos; 
  var tempPosition = position;
  push();
  translate(-position, 0);
  checkInput();
  drawBackground();
  pop(); 
  hero.fallingCheck();
  for(var i = 0; i < boxes.length; i++){
    var corners = boxes[i].getCoordinates()
    if(checkOverlap(hero.getCoordinates(), corners)){
      hero.xPos = tempX;
      position = tempPosition;
      if(hero.falling){
        var corner = hero.cornerCheck(corners);
        console.log(corner);
        if(corner == TOP_LEFT || corner == TOP_RIGHT){
          hero.yPos = corners[3]+hero.tall;
          hero.yVel = 0;
        }
        if(corner == BOT_LEFT || corner == BOT_RIGHT){
          hero.yPos = corners[1];
          hero.yVel = 0;
          hero.falling = false;
          hero.jumping = false;
        }
      }
      break;
    }
  }
  hero.applyGravity();
  hero.drawHero();
}

function checkOverlap(firstObject, secondObject){
  // (0, 1) is top left corner. (2, 3) is bottom right corner. 
  if(firstObject[3] <= secondObject[1] || secondObject[3] <= firstObject[1]){ //Checks if first object is  completely above second object or if first object is completely below the second
    return false;
  }
  if(firstObject[0] >= secondObject[2] || firstObject[2] <= secondObject[0]){ //Checks if first object is  completely right of second object or if first object is completely left of the second
    return false;
  }

  //if neither of the above conditions is true, there is overlap
  return true; 
}

function pointCollision(point, object){
  //point is tuple, (x,y)
  //object is rect, {x1,y1,x2,y2} (top left, bot right)

  if(point[0] <= object[0] || point[0] >= object[2]){
     return false; 
  }
  if(point[1] <= object[1] || point[1] >= object[3]){
     return false; 
  }
  return true; 
}


function checkInput(){
  if(keys['A'.charCodeAt(0)] || keys[LEFT_ARROW])
  {
    hero.moveLeft();
  }
  if(keys['D'.charCodeAt(0)] || keys[RIGHT_ARROW])
  {
    hero.moveRight();
  }
  if(keys[' '.charCodeAt(0)])
  {
    if(!hero.jumping){
      hero.jump(hero.jumpHeight);
      keys[' '.charCodeAt(0)] = false;
    }
    else if(hero.extraJump){
      hero.jump(hero.jumpHeight/2);
      hero.extraJump = false;
    }
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
  this.tall = 100;
  this.wide = 60;
  this.jumpHeight = 200;
  this.scaleFactor = 10;
  this.paint = color(0,255,0);
  this.jumping = false;
  this.extraJump = true;
  this.heroSprite = heroRight;
  
  this.getCoordinates = function(){
    return [this.xPos+position, this.yPos-this.tall, this.xPos+this.wide+position, this.yPos]; 
  }
  
  this.cornerCheck = function(coords){
    if(pointCollision([this.xPos+position, this.yPos],coords)){
      return BOT_LEFT; 
    }
    if(pointCollision([this.xPos+position, this.yPos-this.tall],coords)){
      return TOP_LEFT; 
    } 
    if(pointCollision([this.xPos+this.wide+position, this.yPos],coords)){
      return BOT_RIGHT; 
    }
    if(pointCollision([this.xPos+this.wide+position, this.yPos-this.tall],coords)){
      return TOP_RIGHT; 
    }
    return UNEXPECTED;
  }
  
  this.drawHero = function(){
   image(this.heroSprite, this.xPos, this.yPos-this.tall);
  }
  
  this.adjustHero = function(w,h){
    this.yPos = windowHeight*groundLevel;  
  }
  
  this.moveLeft = function(){
    var temp = this.xPos;
    if(this.xPos > 0){
      this.xPos -= this.xVel;
    }
    this.heroSprite = heroLeft;
  }
  
  this.moveRight = function(){
    if(this.xPos > windowWidth/2){
      position += this.xVel;
    }
    else{
      this.xPos += this.xVel;
    }
    this.heroSprite = heroRight;
  }
  
  this.jump = function(high){
    this.yVel = high;
    this.jumping = true;
    this.falling = true;
  }
  
  this.fallingCheck = function(){
    if(this.yPos <  windowHeight*groundLevel){
      this.falling = true;
    }
    
  }
    
  this.changeColor = function(){
    this.paint = color(255,255,255);
  }
  
  this.applyGravity = function(){ 
    if(this.falling){ 
      this.yVel -= 9.8; 
      this.yPos -= (this.yVel/this.scaleFactor);
      if(this.yPos >= windowHeight*groundLevel){
        this.yPos = windowHeight*groundLevel;
        this.yVel = 0;
        this.jumping = false;
        this.falling = false;
        this.extraJump = true;
      }
    }
  }
}

/*/////////////////////////////////////////////////////////////
  Class for Obstacle object.
/////////////////////////////////////////////////////////////*/
function Box(x1, y1, x2, y2){
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.paint = color(0,255,0);
  
  this.getCoordinates = function(){
    return [this.x1, this.y1, this.x2, this.y2]; 
  }
  
  this.drawBox = function(){
    fill(this.paint);
    rect(this.x1, this.y1, this.x2, this.y2);
  }
  
  this.changeColor = function(){
    this.paint = color(255,0,0);
  }
  
  
  
}