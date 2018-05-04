
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