var ballSpacing = 50;
var ballSize = 15;
var balls = [];
var heros = [];
var index = 0;
var resistance = 0.00007;
//var resistance = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(100);
  var cols = windowWidth/ballSpacing;
  var rows = windowHeight/ballSpacing;
  var counter = 0;
  heros[index] = new Ball(10, 10, 1, 1, ballSize);
  //for (var i = 1; i < rows; i++){
  //  for(var j = 1; j < cols; j++){
  //    if(i % 2 == 0){
  //      balls[counter] = new Ball(j*ballSpacing, i*ballSpacing, 0,0, ballSize); 
  //    }
  //    else{
  //      balls[counter] = new Ball((j*ballSpacing)+ballSpacing/2, (i*ballSpacing), 0, 0, ballSize);
  //    }
  //    counter++;
  //  }
  //}
}

function mousePressed(){
    index++;
    heros[index] = new Ball(10, 10, 1, 1, ballSize);
    heros[index].velocity = 1/30;
    heros[index].moveHero();
  }
  
function mouseReleased(){
    heros[index].changeVelocity();
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

function draw() {
  background(100);
  fill(255,255,255);
  //for(var i = 0; i < balls.length; i++)
  //{
  //  balls[i].drawBall();
  //}
  fill(0,255,0);
  for(var i = 0; i < heros.length; i++){
    var tempX = heros[i].xPos;
    var tempY = heros[i].yPos;
    heros[i].drawBall();
    heros[i].update();
    if(heros[i].checkCollision(i)){
      heros[i].xPos = tempX;
      heros[i].yPos = tempY;
    }
  }
}

function Ball(x, y, xv, yv, size){
   this.xPos = x;
   this.yPos = y;
   this.xVel =  xv;
   this.yVel = yv;
   this.size = size;
   this.velocity = 1.0/30;
   
   this.drawBall = function(){
     noStroke();
     ellipse(this.xPos, this.yPos, this.size, this.size);
   }
   
   this.checkCollision = function(which){
    for(var ball = 0; ball < heros.length; ball++){
      if (ball != which){
        if(Math.sqrt(Math.pow(this.xPos - heros[ball].xPos,2)+Math.pow(this.yPos-heros[ball].yPos,2)) <= this.size){ 
          var tempX = this.xVel;
          var tempY = this.yVel;
          var velMag = Math.sqrt(Math.pow(this.xVel,2)+Math.pow(this.yVel,2));
          var normX = tempX/velMag;
          var normY = tempY/velMag;
          var deltaX = (this.xPos - heros[ball].xPos)/this.size;
          var deltaY = (this.yPos - heros[ball].yPos)/this.size;
          var dirX = deltaX/Math.abs(deltaX); 
          var dirY = deltaY/Math.abs(deltaY);
          var impactAngle = Math.acos((deltaX*normX)+(deltaY*normY));              
          impactAngle =  180-(impactAngle/(Math.PI/180));    ////////near 0 is direct hit, 90 is glancing shot
          console.log(impactAngle);
          //TODO: Impact angle is not coming out correct
          //TODO: Need to use impact angle to become a percentage 
          //Collision with moving objects apears to work, stationary balls act like walls 

          this.xVel = -deltaY*((impactAngle/90)*velMag)*dirY;
          this.yVel = -deltaX*((impactAngle/90)*velMag)*dirX;
          heros[ball].xVel = -deltaX*(((90-impactAngle)/90)*velMag);
          heros[ball].yVel = -deltaY*(((90-impactAngle)/90)*velMag);
          ////temp to freeze balls/////////////////////////////
          //heros[ball].xVel = 0;
          //heros[ball].yVel = 0;
          //this.xVel = 0; 
          //this.yVel = 0;
          return true;
          /////////////////////////////////////////////////////
        }
      }
    }
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
        this.velocity = this.velocity/1.1
      }
      if(this.xPos + this.size >= windowWidth){
        this.xPos = windowWidth - this.size;
        this.xVel = -this.xVel;
        this.velocity = this.velocity/1.1
      }
      if(this.yPos - this.size <= 0){
        this.yPos = this.size;
        this.yVel = -this.yVel;
        this.velocity = this.velocity/1.1      
      }
      if(this.yPos + this.size >= windowHeight){
        this.yPos = windowHeight - this.size;
        this.yVel = -this.yVel;
        this.velocity = this.velocity/1.1
      }
      
     this.velocity -= resistance;
     if (this.velocity < 0) {
       this.velocity = 0;
     }
      
     this.xPos += this.xVel*this.velocity;
     this.yPos += this.yVel*this.velocity;
   }
}
  