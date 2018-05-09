
/*/////////////////////////////////////////////////////////////
  Class for Obstacle object.
/////////////////////////////////////////////////////////////*/
function Box(x, y, w, h, ground){
  this.x = x;
  this.y = y;
  this.groundLevel = ground;
  this.tall = h;
  this.wide = w;
  this.paint = color(50,50,200);
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
    value = Math.ceil(value/BOX_WIDTH)*BOX_WIDTH;
    this.tall = value;
  }
  
  this.setWidth = function(value){
    value = Math.ceil(value/BOX_WIDTH)*BOX_WIDTH;
    this.wide = value;
  }
  
  this.changePaint = function(r,g,b){
    this.paint = color(r,g,b);
  }  
}
