//Constants
var TOP_LEFT = 0;
var TOP_RIGHT = 1;
var BOTTOM_RIGHT = 2;
var BOTTOM_LEFT = 3;
var UNEXPECTED = 55;
var LEVEL_LENGTH = 6000;
var LEVEL_HEIGHT = 3000;

var BOX_WIDTH = 60;
var GROUND_LEVEL = 0.8;
var SKY_LEVEL = 0.2;
var PLAY_MODE = 4;
var CREATE_MODE = 5;
var GAME_OVER = 6;

//Gameplay elements
var gameMode = PLAY_MODE
var hero; 
var heroStart = 120;
var keys = [];
var translationX = 0;
var translationY = 0;
var ground = new Array(3);
var boxes = new Array(LEVEL_LENGTH/BOX_WIDTH);
var currentIndex;
var modifyingBox = false;

//HUD
var HUD_textColor;
var HUD_ghostMeterColor;

//Sprites
var heroLeft;
var heroFlower = [];
var frameCurrent = 0;
var frameMax = 56;
var heroRight;
var ghostShadow;
var heroGhostModeLeft;
var heroGhostModeRight

function preload(){
  heroLeft = loadImage("assets/heroLeft.png");
  heroRight = loadImage("assets/heroRight.png");
  heroGhostModeLeft = loadImage("assets/heroGhostModeLeft.png");
  heroGhostModeRight = loadImage("assets/heroGhostModeRight.png");
  ghostShadow = loadImage("assets/ghostShadow.png");
  for(var i = 0; i<=frameMax; i++)
  {
    heroFlower[i] = loadImage("assets/heroFlower/heroFlower"+nf(i,2)+".png");
  }
}

/*///////////////////////////////////////////////////
  Changes canvas based on size of browser window. 
///////////////////////////////////////////////////*/
function setup() {
  HUD_textColor = color(200,200,200);
  HUD_ghostMeterColor = color(200,200,255);
  createCanvas(windowWidth, windowHeight);
  hero = new Hero(heroStart, windowHeight*GROUND_LEVEL);
  ground[0] = new Box(0, 0, 600, 1000, windowHeight*GROUND_LEVEL);
  ground[1] = new Box(720, 0, 240, windowHeight, windowHeight*GROUND_LEVEL);
  ground[2] = new Box(1200, 0, LEVEL_LENGTH-1300, windowHeight, windowHeight*GROUND_LEVEL);
  for(var i = 0; i < boxes.length; i++){
    boxes[i] = new Array(0);
  }
}

function mousePressed(){
  if(gameMode == CREATE_MODE && !modifyingBox)
  {
    currentIndex = Math.floor((mouseX+translationX)/BOX_WIDTH);
    for(var i = 0; i < boxes[currentIndex].length; i++){
      if(pointCollision([mouseX+translationX, mouseY-translationY], boxes[currentIndex][i].getCoordinates())){
        var temp = boxes[currentIndex][boxes[currentIndex].length-1];
        boxes[currentIndex][i] = temp;
        boxes[currentIndex] = shorten(boxes[currentIndex]);
        modifyingBox = false;
        return;                     
      }
    }
    append(boxes[currentIndex], new Box(currentIndex*BOX_WIDTH, Math.floor((mouseY-translationY-windowHeight*GROUND_LEVEL)/BOX_WIDTH)*BOX_WIDTH, BOX_WIDTH, BOX_WIDTH, windowHeight*GROUND_LEVEL));
    if(keys[SHIFT]){
      modifyingBox = true;
    }
  }
}

function mouseReleased(){
  if(gameMode == CREATE_MODE)
  {
    boxes[currentIndex][boxes[currentIndex].length-1].completeBox();
    modifyingBox = false;
  }
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
  var count = 0;
  background(100);
  rectMode(CORNERS);
  for(var i = 0; i < ground.length; i++){
    ground[i].drawBox();
  }
  for(var i = 0; i < boxes.length; i++){
    for(var j = 0; j < boxes[i].length; j++){
      if(mouseIsPressed && !boxes[i][j].finished && modifyingBox){
        count++;
        console.log(count);
        console.log("Mouse: "+(mouseY-translationY)+ " box[i:"+i+"][j:"+j+"]: "+boxes[i][j].getCoordinates()[1]);
        if(mouseY+translationY+windowHeight*GROUND_LEVEL > boxes[i][j].getCoordinates()[3]){
          boxes[i][j].setHeight(difference(mouseY-translationY, boxes[i][j].getCoordinates()[1]));
        }
        console.log(boxes[i][j].getCoordinates()[3]);
      }
      boxes[i][j].drawBox();
    }
  }
  drawHUD();
}

function drawHUD(){
  fill(55,55,55);
  rectMode(CORNERS);
  stroke(200,200,200);
  strokeWeight(3);
  rect(-10, -translationY, LEVEL_LENGTH, windowHeight*SKY_LEVEL-translationY);
  fill(HUD_textColor);
  textFont("Helvetica");
  textSize(30);
  textAlign(RIGHT);
  noStroke();
  text("Health: ", 200+translationX, windowHeight*SKY_LEVEL -80 - translationY);
  text("Ghost Mode: ", 200+translationX, windowHeight*SKY_LEVEL - 40 - translationY);
  noFill();
  stroke(HUD_ghostMeterColor);
  rect(220+translationX, windowHeight*SKY_LEVEL - 40 - translationY, 220+translationX+hero.ghostDuration*2, windowHeight*SKY_LEVEL - 60 - translationY);
  fill(HUD_ghostMeterColor);
  rect(220+translationX, windowHeight*SKY_LEVEL - 40 - translationY, 220+translationX+hero.ghostRemaining*2, windowHeight*SKY_LEVEL - 60 - translationY);
}

function drawGrid(gridSpacing){
  stroke(0,0,0);
  for(var i = -3; i < LEVEL_HEIGHT/gridSpacing; i++){
    line(0, windowHeight*GROUND_LEVEL + translationY - i*gridSpacing, LEVEL_LENGTH, windowHeight*GROUND_LEVEL + translationY - i*gridSpacing);
 }
 for(var j = 0; j < LEVEL_LENGTH/gridSpacing; j++){
   line(j*gridSpacing - translationX, -LEVEL_HEIGHT, j*gridSpacing - translationX, LEVEL_HEIGHT);
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
  for(var i = 0; i < boxes.length; i++){
    for(var j = 0; j < boxes[i].length; j++){
      boxes[i][j].adjustBox(windowHeight*GROUND_LEVEL);
    }
  }
  for(var i = 0; i < ground.length; i++){
      ground[i].adjustBox(windowHeight*GROUND_LEVEL);
  }
}

function draw() {
  var tempX = hero.xPos;
  var tempY = hero.yPos; 
  var tempPosition = translationX;
  push();
  translate(-translationX, translationY);
  drawBackground();
  checkInput(!hero.alive);
  pop(); 
    
  if(gameMode == PLAY_MODE){
    hero.applyGravity();
    var heroLocation = hero.getCoordinates();
    var index = Math.floor((hero.xPos+translationX)/BOX_WIDTH);
    if(!hero.ghostMode){
      checkForCollisions(boxes[index], heroLocation, tempX, tempY, tempPosition);
      checkForCollisions(boxes[index+1], heroLocation, tempX, tempY, tempPosition);
      checkForCollisions(ground, heroLocation, tempX, tempY, tempPosition);
    }
  }
  
  hero.drawHero();
  hero.updateHero();
  
  if(gameMode == CREATE_MODE){
    drawGrid(BOX_WIDTH);
  }
}

function difference(first, second){
  return Math.abs(first - second);
  //return 60;
}


//need to smooth out collisions into the vertical wall. Currently gets stuck if moving towards wall. 
function checkForCollisions(obstacleList, heroLocation, tempX, tempY, tempPosition){
    for(var i = 0; i < obstacleList.length; i++){
      var boxLocation = obstacleList[i].getCoordinates();
      if(checkOverlap(heroLocation, boxLocation)){
          var corners = hero.cornerCheck(boxLocation);
          if(corners.length == 2){
            if(corners[0] == BOTTOM_LEFT && corners[1] == TOP_LEFT){ ///left impact
              hero.xPos = tempX;
              translationX = tempPosition;
            }
            else if(corners[0] == BOTTOM_RIGHT && corners[1] == TOP_RIGHT){ //right impact
              hero.xPos = tempX;
              translationX = tempPosition;
            }
            else if(corners[0] == BOTTOM_LEFT && corners[1] == BOTTOM_RIGHT){ //bottom impact
              hero.yPos = boxLocation[1];
              hero.yVel = 0;
              hero.extraJump = true;
              //hero.falling = false;
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
                  translationX = tempPosition;
                }
                else{
                  hero.yPos = boxLocation[3]+hero.tall;
                  hero.yVel = 0;
                }
                break;
              case TOP_RIGHT:
                if(difference(heroLocation[2],boxLocation[0]) < difference(heroLocation[1], boxLocation[3])){
                  hero.xPos = tempX;
                  translationX = tempPosition;
                }
                else{
                  hero.yPos = boxLocation[3]+hero.tall;
                  hero.yVel = 0;
                }
              break;
              case BOTTOM_LEFT:
                if(difference(heroLocation[0],boxLocation[2]) < difference(heroLocation[3], boxLocation[1])){
                  hero.xPos = tempX;
                  translationX = tempPosition;
                }
                else{
                  hero.yPos = boxLocation[1];
                  hero.yVel = 0;
                  hero.extraJump = true;
                  //hero.falling = false;
                  hero.jumping = false;
                }
              break;
              case BOTTOM_RIGHT: 
                if(difference(heroLocation[2],boxLocation[0]) < difference(heroLocation[3], boxLocation[1])){
                  hero.xPos = tempX;
                  translationX = tempPosition;
                }
                else{
                  hero.yPos = boxLocation[1];
                  hero.yVel = 0;
                  hero.extraJump = true;
                  //hero.falling = false;
                  hero.jumping = false;
                }
              break;
              default: console.log("A corner was expected");
            }
          }
          else if(corners.length == 0){
            //side of hero overlaps with platform
            hero.xPos = tempX;
            translationX = tempPosition;
          }
          else console.log("Corners length of: "+corners.length+" was unexpected. Hero: "+heroLocation+" Box: "+boxLocation);
      }
    }
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

  if(point[0] < object[0] || point[0] > object[2]){
     return false; 
  }
  if(point[1] < object[1] || point[1] > object[3]){
     return false; 
  }
  return true; 
}


function checkInput(gameOver){
  if(gameMode == PLAY_MODE){
    if(keys['A'.charCodeAt(0)] || keys[LEFT_ARROW]){
      hero.moveLeft();
    }
    if(keys['D'.charCodeAt(0)] || keys[RIGHT_ARROW]){
      hero.moveRight();
    }
    if(keys['S'.charCodeAt(0)] || keys[DOWN_ARROW]){
      if(!hero.ghostMode){
        if(hero.ghostRemaining == hero.ghostDuration)
        {
          hero.goIntangible();
        }
      }
      else{
        hero.returnToGhost();
      }
      keys['S'.charCodeAt(0)] = false;
      keys[DOWN_ARROW] = false; 
    }
    if(keys[' '.charCodeAt(0)]){
      if(!hero.jumping && !hero.ghostMode){
        hero.jump(hero.jumpHeight);
        keys[' '.charCodeAt(0)] = false;
      }
      else if(hero.extraJump && !hero.ghostMode){
        hero.jump(hero.jumpHeight/2);
        hero.extraJump = false;
      }
    }
  }
  if(gameMode == CREATE_MODE){
    if(keys['A'.charCodeAt(0)] || keys[LEFT_ARROW]){
      translationX -= 10;
      if(translationX < 0){
        translationX = 0;
      }
    }
    if(keys['D'.charCodeAt(0)] || keys[RIGHT_ARROW]){
      if(translationX + windowWidth < LEVEL_LENGTH){
        translationX += 10;
      }
    }
    if(keys['S'.charCodeAt(0)] || keys[DOWN_ARROW]){
      translationY -=10;
      if(translationY < 0){
        translationY = 0;
      }
    }
    if(keys['W'.charCodeAt(0)] || keys[UP_ARROW]){
      translationY += 10;
    }
  }
  
    
  if(keys['M'.charCodeAt(0)]){
    if(gameMode == CREATE_MODE){
      gameMode = PLAY_MODE;
    }
    else if(gameMode == PLAY_MODE){
      gameMode = CREATE_MODE;
    }
     keys['M'.charCodeAt(0)] = false;
  }
  if(keys['R'.charCodeAt(0)]){
    hero.resetHero();
    //TODO: reset translation and hero pos
  }
  
  ////////////////Test Key///////////////////

  if(keys['T'.charCodeAt(0)]){
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
  this.terminalVelocity = -150;
  this.paint = color(0,255,0);
  this.heroSprite = heroRight;
  this.falling = true;
  this.alive = true;
  this.jumping = false;
  this.extraJump = true;
  this.ghostMode = false;
  this.ghostDuration = 100;
  this.ghostRemaining = 100;
  this.ghost_xPos = 0;
  this.ghost_yPos = 0;
  this.ghostPosition = 0;


  
  this.getCoordinates = function(){
    return [this.xPos+translationX, this.yPos-this.tall-translationY, this.xPos+this.wide+translationX, this.yPos-translationY]; 
  }
  
  /*////////////////////////////////////////////////////////////////////////////
    Returns an array with each corner that is inside the provided coordinates.
  Method expects input in the form of an array with coordinates [0],[1] as top 
  left and [2],[3] as bottom right.
  ////////////////////////////////////////////////////////////////////////////*/
  this.cornerCheck = function(coords){
    var allCorners = [];
    if(pointCollision([this.xPos+translationX, this.yPos],coords)){
      allCorners.push(BOTTOM_LEFT); 
    }
    if(pointCollision([this.xPos+translationX, this.yPos-this.tall],coords)){
      allCorners.push(TOP_LEFT); 
    } 
    if(pointCollision([this.xPos+this.wide+translationX, this.yPos],coords)){
      allCorners.push(BOTTOM_RIGHT); 
    }
    if(pointCollision([this.xPos+this.wide+translationX, this.yPos-this.tall],coords)){
      allCorners.push(TOP_RIGHT); 
    }
    return allCorners;
  }
  
  this.drawHero = function(){   
     if(this.ghostMode && this.alive){
       image(ghostShadow, this.ghost_xPos-(translationX-this.ghostPosition), this.ghost_yPos-this.tall);
     }
     image(this.heroSprite, this.xPos, this.yPos-this.tall);
  }
  
  this.adjustHero = function(w,h){
    this.yPos = windowHeight*GROUND_LEVEL;  
  }
  
  this.returnToGhost = function(){
    this.xPos = this.ghost_xPos +(this.ghostPosition-translationX);
    this.yPos = this.ghost_yPos;
    this.jumping = this.ghostJumping;
    this.ghostRemianing = 0;
    this.ghostMode = false;
    this.falling = true;
    if(this.heroSprite == heroGhostModeRight){
      this.heroSprite = heroRight;
    }
    else if(this.heroSprite == heroGhostModeLeft){
      this.heroSprite = heroLeft;
    }
  }
  
  this.moveLeft = function(){
    var temp = this.xPos;
    if(this.xPos > 0){
      this.xPos -= this.xVel;
    }
    if(this.ghostMode){
      this.heroSprite = heroGhostModeLeft;
    }
    else{
      this.heroSprite = heroLeft;
    }
  }
  
  this.moveRight = function(){
    if(this.xPos > windowWidth/2){
      translationX += this.xVel;
    }
    else{
      this.xPos += this.xVel;
    }
    if(this.ghostMode){
      this.heroSprite = heroGhostModeRight;
    }
    else{
      this.heroSprite = heroRight;
    }
  }
  
  this.jump = function(high){
    this.yVel = high;
    this.jumping = true;
    this.falling = true;
  }
  
  this.goIntangible = function(){
    this.falling = false;
    this.ghostMode = true;
    this.ghostJumping = this.jumping;
    this.ghost_xPos = this.xPos;
    this.ghost_yPos = this.yPos;
    this.ghostPosition = translationX;
    if(this.heroSprite == heroRight)
    {
      this.heroSprite = heroGhostModeRight;
    }
    else if(this.heroSprite == heroLeft)
    {
      this.heroSprite = heroGhostModeLeft;
    }
  }
  
  this.gameOver = function(){
    this.alive = false;
    gameMode = GAME_OVER;
    this.heroSprite = heroFlower[frameCurrent];
    if(this.yPos > windowHeight){
      this.yPos = windowHeight;
    }
    this.falling = false; 
  }
  
  this.resetHero = function(){
    gameMode = PLAY_MODE;
    this.alive = true;
    this.xPos = heroStart;
    this.yPos = windowHeight*GROUND_LEVEL;
    this.heroSprite = heroRight;
    this.jumping = false;
    this.extraJump = true;
    frameCurrent = 0;
    translationX = 0;
    translationY = 0;
  }
  
  this.updateHero = function(){
    //Fell on screen check
    if(this.yPos-this.tall > windowHeight){
      this.gameOver();
    }
    
    //Alive Check
    if(!this.alive){
      if(frameCurrent < frameMax){
        frameCurrent++;
        this.heroSprite = heroFlower[frameCurrent];
      }
    }
    
    //Fading Check
    if(this.ghostMode){
      this.ghostRemaining--;
      if(this.ghostRemaining <= 0){
        this.ghostMode = false;
        this.falling = true;
        var index = Math.floor((this.xPos+translationX)/BOX_WIDTH);
        for(var i = 0; i < boxes[index].length; i++){
          if(checkOverlap(this.getCoordinates(), boxes[index][i].getCoordinates())){
            this.returnToGhost();
            break;
          }
        }
        for(var i = 0; i < boxes[index+1].length; i++){
          if(checkOverlap(this.getCoordinates(), boxes[index+1][i].getCoordinates())){
            this.returnToGhost();
            break;
          }
        }
        if(this.heroSprite == heroGhostModeRight){
          this.heroSprite = heroRight;
        }
        else if(this.heroSprite == heroGhostModeLeft){
          this.heroSprite = heroLeft;
        }
      }
    }
    else if(this.ghostRemaining < this.ghostDuration){
      this.ghostRemaining += .5;
    }
  }

    
  this.changeColor = function(){
    this.paint = color(255,255,255);
  }
  
  this.applyGravity = function(){ 
    if(this.falling){ 
      this.yVel -= 9.8; 
      if(this.yVel < this.terminalVelocity){
        this.yVel = this.terminalVelocity;
      }
      var temp = this.yPos;
      if(translationY > 0){
        translationY += (this.yVel/this.scaleFactor)
        if(translationY < 0){
          translationY = 0;
        }
        console.log(translationY);
      }
      else{
        this.yPos -= (this.yVel/this.scaleFactor);
      }
      if(this.yPos <= windowHeight/2){
        this.yPos = temp;
        translationY += (this.yVel/this.scaleFactor);
      }
    }
  }
}

/*/////////////////////////////////////////////////////////////
  Class for Obstacle object.
/////////////////////////////////////////////////////////////*/
function Box(x, y, w, h, ground){
  this.x = x;
  this.y = y;
  this.groundLevel = ground;
  this.tall = h;
  this.wide = w;
  this.paint = color(200,50,50);
  this.finished = false; 
  
  this.getCoordinates = function(){
    return [this.x, this.y+this.groundLevel, this.x+this.wide, this.y+this.tall+this.groundLevel]; 
  }
  
  this.drawBox = function(){
    fill(this.paint);
    noStroke();
    rect(this.x, this.y+this.groundLevel, this.x+this.wide, this.y+this.tall+this.groundLevel);
  }
  
  this.adjustBox = function(newGround){
    this.groundLevel = newGround
  }
  
  this.completeBox = function(){
    this.finished = true;
  }
  
  this.setHeight = function(value){
    console.log("Height set to: "+value);
    this.tall = value;
  }
  
  this.changeColor = function(){
    this.paint = color(255,0,0);
  }  
}