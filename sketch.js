
 let p;
function setup() {
    var canvas = createCanvas(400, 400);

    canvas.parent('sketch');
    p = new Particle();
  }
  
  function draw() {
   p.render();
  }