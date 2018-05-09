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
  this.switchToTranslationY = false;

  
  this.getCoordinates = function(){
    return [this.xPos, this.yPos-this.tall, this.xPos+this.wide, this.yPos]; 
  }
  
  /*////////////////////////////////////////////////////////////////////////////
    Returns an array with each corner that is inside the provided coordinates.
  Method expects input in the form of an array with coordinates [0],[1] as top 
  left and [2],[3] as bottom right.
  ////////////////////////////////////////////////////////////////////////////*/
  this.cornerCheck = function(coords){
    var allCorners = [];
    if(pointCollision([this.xPos, this.yPos],coords)){
      allCorners.push(BOTTOM_LEFT); 
    }
    if(pointCollision([this.xPos, this.yPos-this.tall],coords)){
      allCorners.push(TOP_LEFT); 
    } 
    if(pointCollision([this.xPos+this.wide, this.yPos],coords)){
      allCorners.push(BOTTOM_RIGHT); 
    }
    if(pointCollision([this.xPos+this.wide, this.yPos-this.tall],coords)){
      allCorners.push(TOP_RIGHT); 
    }
    return allCorners;
  }
  
  this.drawHero = function(){   
     if(this.ghostMode && this.alive){
       image(ghostShadow, this.ghost_xPos+this.ghostPosition, this.ghost_yPos-this.tall);
     }
     image(this.heroSprite, this.xPos, this.yPos-this.tall);
  }
  
  this.adjustHero = function(w,h){
    this.yPos = windowHeight*GROUND_LEVEL;  
  }
  
  this.returnToGhost = function(){
    this.xPos = this.ghost_xPos +this.ghostPosition;
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

    this.xPos += this.xVel;
    
    if(this.xPos-camera.x > windowWidth/2){
      camera.panHorizontal(this.xVel);
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
    this.ghostPosition = camera.x;
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
    this.falling = false;
    this.alive = true;
    this.xPos = heroStart;
    this.yPos = windowHeight*GROUND_LEVEL;
    this.heroSprite = heroRight;
    this.jumping = false;
    this.extraJump = true;
    frameCurrent = 0;
    camera.x = 0;
    camera.y = 0;
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
        var index = Math.floor((this.xPos)/BOX_WIDTH);
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
      console.log(this.yVel);
      if(this.yVel < this.terminalVelocity){
        this.yVel = this.terminalVelocity;
      }
      
      this.yPos -= (this.yVel/this.scaleFactor);

      if(this.yPos < windowHeight/2 && this.yVel != -9.8){
        camera.panVertical(this.yVel/this.scaleFactor);
      }
    }
  }
}