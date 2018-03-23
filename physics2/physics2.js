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
    if(heros[i].velocity > 0){
      if(heros[i].checkCollision(i)){
        heros[i].xPos = tempX;
        heros[i].yPos = tempY;
      }
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
   this.velocity = 0;
   this.scaleFactor = 1/30;
   
   this.drawBall = function(){
     noStroke();
     ellipse(this.xPos, this.yPos, this.size, this.size);
   }
   
   this.checkCollision = function(which){
     //if both balls have velocity need separate logic
    for(var ball = 0; ball < heros.length; ball++){
      if (ball != which){
        if(Math.sqrt(Math.pow(this.xPos - heros[ball].xPos,2)+Math.pow(this.yPos-heros[ball].yPos,2)) <= this.size){ 
          if(heros[ball].velocity == 0){
            this.printBall(0); ////moving ball
            heros[ball].printBall(0); ////stationary ball
            //var combX = ((this.xVel*this.velocity)+(heros[ball].xVel*heros[ball].velocity));     
            //var combY = ((this.yVel*this.velocity)+(heros[ball].yVel*heros[ball].velocity)); 
            //var combMag = Math.sqrt(Math.pow(combX,2)+Math.pow(combY,2));
            //var tempX = combX/combMag;
            //var tempY = combY/combMag;
            var deltaX = (this.xPos - heros[ball].xPos)/this.size;
            var deltaY = (this.yPos - heros[ball].yPos)/this.size;
            var inVel = this.velocity
            
            var impactAngle = Math.acos(((deltaX*this.xVel)+(deltaY*this.yVel)));       //simplified vector angle comparison since delta and xVel are both normalized vectors       
            impactAngle =  (impactAngle/(Math.PI/180))-90;    ////////near 90 is direct hit, 0 is glancing shot
            
            
            this.velocity = inVel*((90-impactAngle)/90); 
            heros[ball].velocity = inVel*(impactAngle/90); 
            
            this.xVel = deltaY;
            this.yVel = -deltaX;
            heros[ball].xVel = deltaX;
            heros[ball].yVel = deltaY;
            
            if(deltaY/deltaX < this.yVel/this.xVel){
              heros[ball].velocity = -heros[ball].velocity;
              fill(255,0,0);
              //this.velocity = -this.velocity;
              //deltaX = -deltaX
              //deltaY = -deltaY
            }
            if(deltaY/deltaX > this.yVel/this.xVel){
              heros[ball].velocity = -heros[ball].velocity;
              fill(0,0,255);
              this.velocity = -this.velocity;
              
              //deltaX = -deltaX
              //deltaY = -deltaY
            }
            

            
            this.printBall(impactAngle);
            heros[ball].printBall(impactAngle);
            ////temp to freeze balls/////////////////////////////
            //heros[ball].velocity = 0;
            //this.velocity = 0; 
            return true;
            /////////////////////////////////////////////////////
          }
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
     console.log("xVel: "+this.xVel+"\n"+"yVel: "+this.yVel+"\n"+"Velocity: "+this.velocity+"\n"+"xPos: "+this.xPos+"\n"+"yPos: "+this.yPos+"\n"+"Angle: "+angle);
   }
   
   this.changeVelocity = function(){
     this.velocity = Math.sqrt(Math.pow(this.xPos-mouseX,2)+Math.pow(this.yPos-mouseY,2));
     if(this.velocity <= 0){
            this.xVel = 0;
            this.yVel = 0;
     }
     else{
           this.xVel = (this.xPos - mouseX)/this.velocity;
           this.yVel = (this.yPos - mouseY)/this.velocity;
     }
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
      
     //this.velocity -= resistance;
     //if (this.velocity < 0) {
     //  this.velocity = 0;
     //  this.xVel = 0;
     //  this.yVel = 0;
     //}
      
     this.xPos += this.xVel*this.velocity*this.scaleFactor;
     this.yPos += this.yVel*this.velocity*this.scaleFactor;
   }
}
  