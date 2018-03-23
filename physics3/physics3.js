var ballSpacing = 50;
var ballSize = 15;
var balls = [];
var heros = [];
var index = 0;
var resistance = 0.4;
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

    heros[i].update();
      if(heros[i].checkCollision(i)){
        heros[i].xPos = tempX;
        heros[i].yPos = tempY;
      }
    heros[i].drawBall();
  }
}

function Ball(x, y, xv, yv, size){
   this.xPos = x;
   this.yPos = y;
   this.xVel =  xv;
   this.yVel = yv;
   this.size = size;
   //this.velocity = 0;
   this.scaleFactor = 1/30;
   
   this.drawBall = function(){
     noStroke();
     ellipse(this.xPos, this.yPos, this.size, this.size);
   }
   
   this.checkCollision = function(which){
    for(var ball = 0; ball < heros.length; ball++){
      if (ball != which){
        var deltaX = this.xPos - heros[ball].xPos;
        var deltaY = -(this.yPos - heros[ball].yPos);
        var distance = Math.sqrt(Math.pow(deltaX,2)+Math.pow(deltaY,2));
        if(distance <= this.size){ 
            var deltaV = (deltaX/distance)*(heros[ball].xVel-this.xVel)- ((deltaY/distance)*(heros[ball].yVel-this.yVel));
            this.xVel += (deltaX/distance)*deltaV;
            this.yVel -= (deltaY/distance)*deltaV;
            heros[ball].xVel -= (deltaX/distance)*deltaV;
            heros[ball].yVel += (deltaY/distance)*deltaV;
            return true;
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
   
   this.printBall = function(angle){
     //console.log("xVel: "+this.xVel+"\n"+"yVel: "+this.yVel+"\n"+"Velocity: "+this.velocity+"\n"+"xPos: "+this.xPos+"\n"+"yPos: "+this.yPos+"\n"+"Angle: "+angle);
   }
   
   
   this.changeVelocity = function(){
     this.xVel = (this.xPos - mouseX);
     this.yVel = (this.yPos - mouseY);
   }
   
   this.update = function(){
      if(this.xPos - this.size <= 0){
        this.xPos = this.size;
        this.xVel = -this.xVel;
        //this.velocity = this.velocity/1.1
      }
      if(this.xPos + this.size >= windowWidth){
        this.xPos = windowWidth - this.size;
        this.xVel = -this.xVel;
        //this.velocity = this.velocity/1.1
      }
      if(this.yPos - this.size <= 0){
        this.yPos = this.size;
        this.yVel = -this.yVel;
        //this.velocity = this.velocity/1.1      
      }
      if(this.yPos + this.size >= windowHeight){
        this.yPos = windowHeight - this.size;
        this.yVel = -this.yVel;
        //this.velocity = this.velocity/1.1
      }
      
     //this.velocity -= resistance;
     //if (this.velocity < 0) {
     //  this.velocity = 0;
     //  this.xVel = 0;
     //  this.yVel = 0;
     //}
      
     this.xPos += this.xVel*this.scaleFactor;
     this.yPos += this.yVel*this.scaleFactor;
   }
}
  