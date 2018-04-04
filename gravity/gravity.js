var groundLevel = 0.8;
var hero; 
var keys = [];
var heroLeft;
var heroRight;
var position = 0;
var boxes = [];
var TOP_LEFT = 0;
var TOP_RIGHT = 1;
var BOTTOM_RIGHT = 2;
var BOTTOM_LEFT = 3;
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
  hero.applyGravity();

  var heroLocation = hero.getCoordinates();
  console.log("Hero start: " + heroLocation);
  for(var i = 0; i < boxes.length; i++){
    var boxLocation = boxes[i].getCoordinates();
    if(checkOverlap(heroLocation, boxLocation)){
        var corners = hero.cornerCheck(boxLocation);
        if(corners.length == 2){
          if(corners[0] == BOTTOM_LEFT && corners[1] == TOP_LEFT){ ///left impact
            hero.xPos = tempX;
            position = tempPosition;
          }
          else if(corners[0] == BOTTOM_RIGHT && corners[1] == TOP_RIGHT){ //right impact
            hero.xPos = tempX;
            position = tempPosition;
          }
          else if(corners[0] == BOTTOM_LEFT && corners[1] == BOTTOM_RIGHT){ //bottom impact
            hero.yPos = boxLocation[1];
            hero.yVel = 0;
            hero.extraJump = true;
            hero.falling = false;
            hero.jumping = false;
          }
          else if(corners[0] == TOP_LEFT && corners[1] == TOP_RIGHT){ //top impact
            hero.yPos = boxLocation[3]+hero.tall;
            hero.yVel = 0;
          }
          else console.log("Unexpected combination of corners.");
        }
        else if(corners.length == 1){
          switch(corners[0]){
            case TOP_LEFT: 
              if(difference(heroLocation[0],boxLocation[2]) < difference(heroLocation[1], boxLocation[3])){
                hero.xPos = tempX;
                position = tempPosition;
              }
              else{
                hero.yPos = boxLocation[3]+hero.tall;
                hero.yVel = 0;
              }
              break;
            case TOP_RIGHT:
              if(difference(heroLocation[2],boxLocation[0]) < difference(heroLocation[1], boxLocation[3])){
                hero.xPos = tempX;
                position = tempPosition;
              }
              else{
                hero.yPos = boxLocation[3]+hero.tall;
                hero.yVel = 0;
              }
            break;
            case BOTTOM_LEFT:
              if(difference(heroLocation[0],boxLocation[2]) < difference(heroLocation[3], boxLocation[1])){
                hero.xPos = tempX;
                position = tempPosition;
              }
              else{
                hero.yPos = boxLocation[1];
                hero.yVel = 0;
                hero.extraJump = true;
                hero.falling = false;
                hero.jumping = false;
              }
            break;
            case BOTTOM_RIGHT: 
              if(difference(heroLocation[2],boxLocation[0]) < difference(heroLocation[3], boxLocation[1])){
                hero.xPos = tempX;
                position = tempPosition;
              }
              else{
                hero.yPos = boxLocation[1];
                hero.yVel = 0;
                hero.extraJump = true;
                hero.falling = false;
                hero.jumping = false;
              }
            break;
            default: console.log("A corner was expected");
          }
        }
        else if(corners.length == 0){
          //side of hero overlaps with platform
          hero.xPos = tempX;
          position = tempPosition;
        }
        else console.log("Corners length of: "+corners.length+" was unexpected. Hero: "+heroLocation+" Box: "+boxLocation);
      break;
    }
  }
  hero.drawHero();
  hero.fallingCheck();
}

function difference(first, second){
  return Math.abs(first - second);
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
  
  /*////////////////////////////////////////////////////////////////////////////
    Returns an array with each corner that is inside the provided coordinates.
  Method expects input in the form of an array with coordinates [0],[1] as top 
  left and [2],[3] as bottom right.
  ////////////////////////////////////////////////////////////////////////////*/
  this.cornerCheck = function(coords){
    var allCorners = [];
    if(pointCollision([this.xPos+position, this.yPos],coords)){
      allCorners.push(BOTTOM_LEFT); 
    }
    if(pointCollision([this.xPos+position, this.yPos-this.tall],coords)){
      allCorners.push(TOP_LEFT); 
    } 
    if(pointCollision([this.xPos+this.wide+position, this.yPos],coords)){
      allCorners.push(BOTTOM_RIGHT); 
    }
    if(pointCollision([this.xPos+this.wide+position, this.yPos-this.tall],coords)){
      allCorners.push(TOP_RIGHT); 
    }
    return allCorners;
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