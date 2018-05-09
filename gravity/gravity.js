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
var camera;
var ground = new Array(3);
var boxes = new Array(LEVEL_LENGTH/BOX_WIDTH);
var currentIndex;
var modifyingBox = false;
var modifyingGround = false;

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
  camera = new Camera();
  HUD_textColor = color(200,200,200);
  HUD_ghostMeterColor = color(200,200,255);
  createCanvas(windowWidth, windowHeight);
  hero = new Hero(heroStart, windowHeight*GROUND_LEVEL);
  ground[0] = new Box(0, 0, 600, 1000, windowHeight*GROUND_LEVEL);
  ground[1] = new Box(720, 0, 240, windowHeight, windowHeight*GROUND_LEVEL);
  ground[2] = new Box(1200, 0, LEVEL_LENGTH-1300, windowHeight, windowHeight*GROUND_LEVEL);
  for(var i = 0; i < ground.length; i++){
    ground[i].completeBox();
    ground[i].changePaint(150,50,150);
  }
  for(var i = 0; i < boxes.length; i++){
    boxes[i] = new Array(0);
  }
}

function mousePressed(){
  if(gameMode == CREATE_MODE){
    
    ///////////////////Removes if user clicks on existing ground///////////////////////////////////
    for(var i = 0; i < ground.length; i++){
      if(pointCollision([mouseX+camera.x, mouseY-camera.y], ground[i].getCoordinates())){
        var temp = ground[ground.length-1];
        ground[i] = temp;
        ground = shorten(ground);
        modifyingGround = false;
        return; 
      }
    }
    
    ///////////////////////Removes if user clicks on existing box///////////////////////////////////
    currentIndex = Math.floor((mouseX+camera.x)/BOX_WIDTH);
    for(var i = 0; i < boxes[currentIndex].length; i++){
      if(pointCollision([mouseX+camera.x, mouseY-camera.y], boxes[currentIndex][i].getCoordinates())){
        var temp = boxes[currentIndex][boxes[currentIndex].length-1];
        boxes[currentIndex][i] = temp;
        boxes[currentIndex] = shorten(boxes[currentIndex]);
        modifyingBox = false;
        return;                     
      }
    }
    
    
    if(mouseY-camera.y >= windowHeight*GROUND_LEVEL){
      append(ground, new Box(currentIndex*BOX_WIDTH, 0, Math.ceil((mouseX+camera.x)/BOX_WIDTH)*BOX_WIDTH-(currentIndex*BOX_WIDTH), windowHeight, windowHeight*GROUND_LEVEL));
      ground[ground.length-1].changePaint(150,50,150);
      modifyingGround = true;
    }
    else{
      append(boxes[currentIndex], new Box(currentIndex*BOX_WIDTH, Math.floor((mouseY-camera.y-windowHeight*GROUND_LEVEL)/BOX_WIDTH)*BOX_WIDTH, BOX_WIDTH, BOX_WIDTH, windowHeight*GROUND_LEVEL));
      modifyingBox = true;
    }
  }
}

function mouseReleased(){
  if(gameMode == CREATE_MODE && modifyingBox){
    boxes[currentIndex][boxes[currentIndex].length-1].completeBox();
    modifyingBox = false;
  }
  else if(gameMode == CREATE_MODE && modifyingGround){
    ground[ground.length-1].completeBox();
    modifyingGround = false;
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
    if(mouseIsPressed && !ground[i].finished && modifyingGround){
      ground[i].setWidth(difference(mouseX+camera.x, ground[i].getCoordinates()[0]));
    }
    ground[i].drawBox();
  }
  for(var i = 0; i < boxes.length; i++){
    for(var j = 0; j < boxes[i].length; j++){
      if(mouseIsPressed && !boxes[i][j].finished && modifyingBox){
        if(mouseY+camera.y+windowHeight*GROUND_LEVEL > boxes[i][j].getCoordinates()[3]){
          boxes[i][j].setHeight(difference(mouseY-camera.y, boxes[i][j].getCoordinates()[1]));
        }
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
  rect(-10, -camera.y, LEVEL_LENGTH, windowHeight*SKY_LEVEL-camera.y);
  fill(HUD_textColor);
  textFont("Helvetica");
  textSize(30);
  textAlign(RIGHT);
  noStroke();
  text("Health: ", 200+camera.x, windowHeight*SKY_LEVEL -80 - camera.y);
  text("Ghost Mode: ", 200+camera.x, windowHeight*SKY_LEVEL - 40 - camera.y);
  noFill();
  stroke(HUD_ghostMeterColor);
  rect(220+camera.x, windowHeight*SKY_LEVEL - 40 - camera.y, 220+camera.x+hero.ghostDuration*2, windowHeight*SKY_LEVEL - 60 - camera.y);
  fill(HUD_ghostMeterColor);
  rect(220+camera.x, windowHeight*SKY_LEVEL - 40 - camera.y, 220+camera.x+hero.ghostRemaining*2, windowHeight*SKY_LEVEL - 60 - camera.y);
}

function drawGrid(gridSpacing){
  stroke(0,0,0);
  for(var i = -3; i < LEVEL_HEIGHT/gridSpacing; i++){
    line(0, windowHeight*GROUND_LEVEL + camera.y - i*gridSpacing, LEVEL_LENGTH, windowHeight*GROUND_LEVEL + camera.y - i*gridSpacing);
 }
 for(var j = 0; j < LEVEL_LENGTH/gridSpacing; j++){
   line(j*gridSpacing - camera.x, -LEVEL_HEIGHT, j*gridSpacing - camera.x, LEVEL_HEIGHT);
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
  
  push();
  translate(-camera.x, camera.y);
  drawBackground();
  checkInput(!hero.alive);
  hero.drawHero();
  pop(); 
    
  if(gameMode == PLAY_MODE){
    hero.applyGravity();
    var heroLocation = hero.getCoordinates();
    var index = Math.floor((hero.xPos)/BOX_WIDTH);
    if(!hero.ghostMode){
      checkForCollisions(boxes[index], heroLocation, tempX, tempY);
      checkForCollisions(boxes[index+1], heroLocation, tempX, tempY);
      checkForCollisions(ground, heroLocation, tempX, tempY);
    }
  }
  
  hero.updateHero();
  
  if(gameMode == CREATE_MODE){
    drawGrid(BOX_WIDTH);
  }
}

function difference(first, second){
  return Math.abs(first - second);
}
