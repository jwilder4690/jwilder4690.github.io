

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
          hero.returnToGhost(hero.ghostInTheWall());
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
      else if(hero.ghostMode){
        hero.jump(hero.jumpHeight/5);
      }
    }
  }
  if(gameMode == CREATE_MODE){
    if(keys['A'.charCodeAt(0)] || keys[LEFT_ARROW]){
      gameCamera.x -= 10;
      if(gameCamera.x < 0){
        gameCamera.x = 0;
      }
    }
    if(keys['D'.charCodeAt(0)] || keys[RIGHT_ARROW]){
      if(gameCamera.x + windowWidth < LEVEL_LENGTH){
        gameCamera.x += 10;
      }
    }
    if(keys['S'.charCodeAt(0)] || keys[DOWN_ARROW]){
      gameCamera.y -=10;
      if(gameCamera.y < 0){
        gameCamera.y = 0;
      }
    }
    if(keys['W'.charCodeAt(0)] || keys[UP_ARROW]){
      gameCamera.y += 10;
    }
    if(keys['E'.charCodeAt(0)] || keys[RIGHT_ARROW]){
      enemies[enemyIndex] = new Enemy(mouseX+gameCamera.x, mouseY+gameCamera.y, 50,0);
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
