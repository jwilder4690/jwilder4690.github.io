
//need to smooth out collisions into the vertical wall. Currently gets stuck if moving towards wall. 
function checkForCollisions(obstacleList, heroLocation, tempX, tempY){
    for(var i = 0; i < obstacleList.length; i++){
      var boxLocation = obstacleList[i].getCoordinates();
      if(checkOverlap(heroLocation, boxLocation)){
          var corners = hero.cornerCheck(boxLocation);
          if(corners.length == 2){
            if(corners[0] == BOTTOM_LEFT && corners[1] == TOP_LEFT){ ///left impact
              hero.xPos = tempX;
            }
            else if(corners[0] == BOTTOM_RIGHT && corners[1] == TOP_RIGHT){ //right impact
              hero.xPos = tempX;
            }
            else if(corners[0] == BOTTOM_LEFT && corners[1] == BOTTOM_RIGHT){ //bottom impact
              hero.yPos = boxLocation[1];
              hero.yVel = 0;
              hero.extraJump = true;
              hero.jumping = false;
            }
            else if(corners[0] == TOP_LEFT && corners[1] == TOP_RIGHT){ //top impact
              hero.yPos = boxLocation[3]+hero.tall;
              hero.yVel = 0;
            }
            else console.log("Unexpected combination of corners.");
          }
          else if(corners.length == 1){
            switch(corners[0]){
              case TOP_LEFT: 
                if(difference(heroLocation[0],boxLocation[2]) < difference(heroLocation[1], boxLocation[3])){
                  hero.xPos = tempX;
                }
                else{
                  hero.yPos = boxLocation[3]+hero.tall;
                  hero.yVel = 0;
                }
                break;
              case TOP_RIGHT:
                if(difference(heroLocation[2],boxLocation[0]) < difference(heroLocation[1], boxLocation[3])){
                  hero.xPos = tempX;
                }
                else{
                  hero.yPos = boxLocation[3]+hero.tall;
                  hero.yVel = 0;
                }
              break;
              case BOTTOM_LEFT:
                if(difference(heroLocation[0],boxLocation[2]) < difference(heroLocation[3], boxLocation[1])){
                  hero.xPos = tempX;
                }
                else{
                  hero.yPos = boxLocation[1];
                  hero.yVel = 0;
                  hero.extraJump = true;
                  hero.jumping = false;
                }
              break;
              case BOTTOM_RIGHT: 
                if(difference(heroLocation[2],boxLocation[0]) < difference(heroLocation[3], boxLocation[1])){
                  hero.xPos = tempX;
                }
                else{
                  hero.yPos = boxLocation[1];
                  hero.yVel = 0;
                  hero.extraJump = true;
                  hero.jumping = false;
                }
              break;
              default: console.log("A corner was expected");
            }
          }
          else if(corners.length == 0){
            //side of hero overlaps with platform
            hero.xPos = tempX;
          }
          else console.log("Corners length of: "+corners.length+" was unexpected. Hero: "+heroLocation+" Box: "+boxLocation);
      }
    }
}

function checkOverlap(firstObject, secondObject){
  // (0, 1) is top left corner. (2, 3) is bottom right corner. 
  if(firstObject[3] <= secondObject[1] || secondObject[3] <= firstObject[1]){ //Checks if first object is  completely above second object or if first object is completely below the second
    return false;
  }
  if(firstObject[0] >= secondObject[2] || firstObject[2] <= secondObject[0]){ //Checks if first object is  completely right of second object or if first object is completely left of the second
    return false;
  }

  //if neither of the above conditions is true, there is overlap
  return true; 
}

function pointCollision(point, object){
  //point is tuple, (x,y)
  //object is rect, {x1,y1,x2,y2} (top left, bot right)

  if(point[0] < object[0] || point[0] > object[2]){
     return false; 
  }
  if(point[1] < object[1] || point[1] > object[3]){
     return false; 
  }
  return true; 
}