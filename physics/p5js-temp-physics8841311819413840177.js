var ballSpacing = 50;
var ballSize = 15;
var balls = [];
var heros = [];
var index = 0;
var resistance = 0.3;
var wallAbsorbtion = 0.8;

/*///////////////////////////////////////////////////
  Changes canvas based on size of browser window. 
///////////////////////////////////////////////////*/
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(100);
}


/*////////////////////////////////////////////////////////////
  Creates a new ball on mouse click. Sets velocity on release. 
////////////////////////////////////////////////////////////*/
function mousePressed(){
    heros[index] = new Ball(mouseX, mouseY, 1, 1, ballSize);
}
   
function mouseReleased(){
    heros[index].changeVelocity();
    index++;
}
  
  
/*///////////////////////////////////////////////////////
  Function is automatically called to resize canvas when 
  browsser window is resized. 
///////////////////////////////////////////////////////*/  
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


/*///////////////////////////////////////////////////////////
   Main function that draws to canvas. Checks for collisions
   and draws each ball. Uses temp x,y coordinates to revert
   ball to previus location and avoid overlapping. 
///////////////////////////////////////////////////////////*/  
function draw() {
  background(100);
  fill(0,255,0);
  for(var i = 0; i < heros.length; i++){
    var tempX = heros[i].xPos;
    var tempY = heros[i].yPos;

    heros[i].update();
      if(heros[i].checkCollision(i)){
        heros[i].xPos = tempX;
        heros[i].yPos = tempY;
      }
    heros[i].drawBall();
  }
}

/*///////////////////////////////////////////////////////
   Class for Ball object. 
///////////////////////////////////////////////////////*/ 
function Ball(x, y, xv, yv, size){
   this.xPos = x;
   this.yPos = y;
   this.xVel =  xv;
   this.yVel = yv;
   this.velocity = 0;
   this.size = size;
   this.scaleFactor = 1/30;
   

   this.drawBall = function(){
     noStroke();
     ellipse(this.xPos, this.yPos, this.size, this.size);
   }
  
   /*/////////////////////////////////////////////////////////
     Physics for elastic collisions. Uses a matrix conversion 
     to calculate new velocity based on impact angle. 
   /////////////////////////////////////////////////////////*/ 
   this.checkCollision = function(which){
    for(var ball = 0; ball < heros.length; ball++){
      if (ball != which){
        var deltaX = this.xPos - heros[ball].xPos;
        var deltaY = -(this.yPos - heros[ball].yPos);
        var distance = Math.sqrt(Math.pow(deltaX,2)+Math.pow(deltaY,2));
        if(distance <= this.size){ 
            var deltaV = (deltaX/distance)*(heros[ball].getxVel()-this.getxVel())- ((deltaY/distance)*(heros[ball].getyVel()-this.getyVel()));
            this.setVel(this.getxVel() + (deltaX/distance)*deltaV, this.getyVel() - (deltaY/distance)*deltaV);
            heros[ball].setVel(heros[ball].getxVel() - (deltaX/distance)*deltaV, heros[ball].getyVel() + (deltaY/distance)*deltaV);
            return true;
        }
      }
    }
  }
    
   this.changeVelocity = function(){
     this.velocity = Math.sqrt(Math.pow(this.xPos-mouseX,2)+Math.pow(this.yPos-mouseY,2));
     if(this.velocity == 0){
       this.xVel = 0;
       this.yVel = 0;
     }
     else{
       this.xVel = (this.xPos - mouseX)/this.velocity;
       this.yVel = (this.yPos - mouseY)/this.velocity;
     }     
   }
   
   this.getxVel = function(){
     return (this.xVel * this.velocity); 
   }
   
   this.getyVel = function(){
     return (this.yVel * this.velocity);
   }
   
   this.setVel = function(xComb, yComb){
     this.velocity = Math.sqrt(Math.pow(xComb,2)+Math.pow(yComb,2));
     this.xVel = xComb/this.velocity;
     this.yVel = yComb/this.velocity;
   }
   
   /*///////////////////////////////////////////////////////
     Reverses x or y velocity upon impact with wall, then 
     updates x and y position based on velocity and scale
     factor. 
   ///////////////////////////////////////////////////////*/ 
   this.update = function(){
      if(this.xPos - this.size <= 0){
        this.xPos = this.size;
        this.xVel = -this.xVel;
        this.velocity *= wallAbsorbtion;
      }
      if(this.xPos + this.size >= windowWidth){
        this.xPos = windowWidth - this.size;
        this.xVel = -this.xVel;
        this.velocity *= wallAbsorbtion;
      }
      if(this.yPos - this.size <= 0){
        this.yPos = this.size;
        this.yVel = -this.yVel;
        this.velocity *= wallAbsorbtion;     
      }
      if(this.yPos + this.size >= windowHeight){
        this.yPos = windowHeight - this.size;
        this.yVel = -this.yVel;
        this.velocity *= wallAbsorbtion;
      }
      
      this.velocity -= resistance;
      if(this.velocity < 0){
        this.velocity = 0;
      }
      
      this.xPos += this.xVel*this.velocity*this.scaleFactor;
      this.yPos += this.yVel*this.velocity*this.scaleFactor;
   }
}
  