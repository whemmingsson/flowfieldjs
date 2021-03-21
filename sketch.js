

let particles;
let field;

// SETUP
function setup() {
    var canvas = createCanvas(1400, 800);
    canvas.parent('sketch');

 // size(1400,800, FX2D);
  background(20);
  noiseDetail(15);
  strokeCap(SQUARE);
 
  if(Settings.Env.USE_RAINBOW){
    colorMode(HSB,255);
  }
    
  particles = [];
  initParticles(); 
 
  field = new Flowfield(floor(height / Settings.Field.SCALE), floor(width / Settings.Field.SCALE));  
  
  if(Settings.Env.DRAW_VECTORS) { //<>//
    drawVectorsInField();
  }
}

function initParticles(){
  for(let i = 0; i< Settings.Env.NUMBER_OF_PARTICLES; i++){
    particles.push(new Particle(createVector(random(width), random(height))));
  }
}

// DRAW
function draw() { 
  if(Settings.Env.DRAW_VECTORS) {
    background(20);
  }
  
  if(Settings.Field.ENABLE_TIME){
    field.create();
    
  if(Settings.Env.DRAW_VECTORS){
      drawVectorsInField();
    }
  }
  
  if(Settings.Env.DRAW_PARTICLES){
    updateAndDrawParticles(); 
  }
    
  if(Settings.Env.DRAW_FPS){
   drawFps();
  }
}

function drawVectorsInField(){
  strokeWeight(1);
  for(let y = 0; y < field.rows; y++){
    for(let x = 0; x < field.columns; x++) {
      drawVector(x, y);
    }
  }
}

function drawVector(x,y) {
    pushMatrix();
    stroke(40);
    translate(x*Settings.Field.SCALE, y*Settings.Field.SCALE);
    rotate(field.getVectorAt(x,y).heading());
    line(0,0, Settings.Field.SCALE, 0);    
    popMatrix();
}

function updateAndDrawParticles(){
  for(let i = 0; i < Settings.Environment.NUMBER_OF_PARTICLES; i++){
    particles[i].follow(field.getVectors());
    particles[i].update();
    particles[i].stopAtEdges();
    particles[i].render();
  }
}

function drawFps(){
    fill(0);
    noStroke();
    rect(7,00, 60, 30);
    fill(255);
    text("fps :"+floor(frameRate), 20, 20);
    noFill();
}