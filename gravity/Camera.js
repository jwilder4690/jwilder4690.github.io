function Camera(){
  this.x = 0;
  this.y = 0;
  
  this.panHorizontal = function(dist){
    this.x += dist;
  }
  
  this.panVertical = function(dist){
    this.y += dist;
  }
}