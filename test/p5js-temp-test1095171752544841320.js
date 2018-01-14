//var sketch = function(p){
  
// p.setup = function(){
//   p.createCanvas(500,500);
// };
 
// p.draw = function(){
//   p.background(0);
//   p.fill(255);
//   p.rect(mouseX,mouseY,50,50);
// }
//}



//  function setup() {
//  createCanvas(500,500);
//}

//function draw() {
//  background(0);
//  fill(255);
//  rect(mouseX,mouseY, 50,50);
//}
  
  
  
  var s = function( sketch ) {

  var x = 100; 
  var y = 100;

  sketch.setup = function() {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    //sketch.createCanvas(500, 500);
  };

  sketch.draw = function() {
    sketch.background(0);
    sketch.fill(255);
    sketch.rect(sketch.mouseX-25, sketch.mouseY-25,50,50);
  };
  

};

var myp5 = new p5(s);
  
  
  
  
  
  