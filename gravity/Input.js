

function checkInput(gameOver){
  if(gameMode == PLAY_MODE){
    if(keys['A'.charCodeAt(0)] || keys[LEFT_ARROW]){
      hero.moveLeft();
    }
    if(keys['D'.charCodeAt(0)] || keys[RIGHT_ARROW]){
      hero.moveRight();
    }
    if(keys['S'.charCodeAt(0)] || keys[DOWN_ARROW]){
      if(!hero.ghostMode){
        if(hero.ghostRemaining == hero.ghostDuration)
        {
          hero.goIntangible();
        }
      }
      else{
        hero.returnToGhost();
      }
      keys['S'.charCodeAt(0)] = false;
      keys[DOWN_ARROW] = false; 
    }
    if(keys[' '.charCodeAt(0)]){
      if(!hero.jumping && !hero.ghostMode){
        hero.jump(hero.jumpHeight);
        keys[' '.charCodeAt(0)] = false;
      }
      else if(hero.extraJump && !hero.ghostMode){
        hero.jump(hero.jumpHeight/2);
        hero.extraJump = false;
      }
    }
  }
  if(gameMode == CREATE_MODE){
    if(keys['A'.charCodeAt(0)] || keys[LEFT_ARROW]){
      camera.x -= 10;
      if(camera.x < 0){
        camera.x = 0;
      }
    }
    if(keys['D'.charCodeAt(0)] || keys[RIGHT_ARROW]){
      if(camera.x + windowWidth < LEVEL_LENGTH){
        camera.x += 10;
      }
    }
    if(keys['S'.charCodeAt(0)] || keys[DOWN_ARROW]){
      camera.y -=10;
      if(camera.y < 0){
        camera.y = 0;
      }
    }
    if(keys['W'.charCodeAt(0)] || keys[UP_ARROW]){
      camera.y += 10;
    }
  }
  
    
  if(keys['M'.charCodeAt(0)]){
    if(gameMode == CREATE_MODE){
      gameMode = PLAY_MODE;
    }
    else if(gameMode == PLAY_MODE){
      gameMode = CREATE_MODE;
    }
     keys['M'.charCodeAt(0)] = false;
  }
  if(keys['R'.charCodeAt(0)]){
    hero.resetHero();
    //TODO: reset translation and hero pos
  }
  
  ////////////////Test Key///////////////////

  if(keys['T'.charCodeAt(0)]){
  }
  
}