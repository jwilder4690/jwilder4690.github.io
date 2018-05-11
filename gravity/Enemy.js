function Enemy(x, y, stepRange, aimRange){
  this.xPos = x;
  this.yPos = y;
  this.step = 0;
  this.stepRange = stepRange;
  this.aimRange = aimRange;
  this.xVel = 2;
  this.wide = BOX_WIDTH;
  this.tall = BOX_WIDTH*2;
  this.paint = color(0,0,0);
  
  this.drawEnemy = function(){
    fill(this.paint);
    rectMode(CORNER);
    rect(this.xPos+this.step ,this.yPos-this.tall, this.wide, this.tall);
  }
  
  this.update = function(){
    this.step += this.xVel;
    if(this.step >= this.stepRange || this.step <= -this.stepRange){
      this.xVel = -1*this.xVel; 
    }
  }
}
