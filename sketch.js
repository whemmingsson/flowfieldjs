let particles;
let field;

let sliderControls = [];

const FPS_DRAW_RATE = 15; // Every x frames
let fpsCounter = 0;
let currentFps = 60;

let pauseRunButton;

function setup() {
  var canvas = createCanvas(1400, 800);
  canvas.parent("sketch");

  if (Settings.USE_RAINBOW) {
    colorMode(HSB, 255);
  }

  strokeCap(SQUARE);
  strokeJoin(BEVEL);

  initialize();
  setupControls();
}

function initialize() {
  particles = [];
  initParticles();
  field = new Flowfield(floor(height / Settings.FIELD_SCALE), floor(width / Settings.FIELD_SCALE));
  background(20);
}

function initParticles() {
  for (let i = 0; i < Settings.NUMBER_OF_PARTICLES; i++) {
    particles.push(new Particle(createVector(random(width), random(height))));
  }
}

function toggleRunning() {
  if (isLooping()) {
    pauseRunButton.setLabel("Run");
    noLoop();
  } else {
    pauseRunButton.setLabel("Pause");
    loop();
  }

  pauseRunButton.toggleCssClass("toggled");
}

function setupControls() {
  // Environment
  HeadingControl.create("Environment");
  CheckboxControl.create("Render noise", "DRAW_NOISE", SettingsCategories.ENV, clearBackground);
  CheckboxControl.create("Render vectors", "DRAW_VECTORS", SettingsCategories.ENV, clearBackground);
  CheckboxControl.create("Render particles", "DRAW_PARTICLES", SettingsCategories.ENV, clearBackground);
  //CheckboxControl.create("Render fps info", "DRAW_FPS", SettingsCategories.ENV, clearBackground);
  CheckboxControl.create("Rainbow mode (Experimental)", "USE_RAINBOW", SettingsCategories.ENV, switchColorMode);
  CheckboxControl.create("Render bubbles (Experimental)", "DRAW_VISITED_BUBBLES", SettingsCategories.ENV, initialize);

  // Field
  HeadingControl.create("Flowfield");
  let fieldSlider = new SliderControl("Field scale", 30, 120, 5, "FIELD_SCALE", SettingsCategories.FIELD, initialize);
  let detailSlider = new SliderControl("Noise detail", 1, 50, 1, "DETAIL", SettingsCategories.FIELD, setNoiseDetail);
  let forceSlider = new SliderControl("Force strength", 0.1, 5, 0.1, "FORCE_STRENGTH", SettingsCategories.FIELD);
  let speedSlider = new SliderControl("Zoom level", 0, 0.5, 0.005, "OFFSET_SPEED", SettingsCategories.FIELD);
  let timeSpeedSlider = new SliderControl("Time offset speed", 0, 0.1, 0.005, "TIME_OFFSET_SPEED", SettingsCategories.FIELD);

  // Particles
  HeadingControl.create("Particles");
  let numParticlesSlider = new SliderControl("Number of particles", 1, 1000, 1, "NUMBER_OF_PARTICLES", SettingsCategories.ENV, initialize);
  let maxSpeedSlider = new SliderControl("Max speed", 1, 15, 1, "MAX_SPEED", SettingsCategories.PARTICLE);
  let thicknessSlider = new SliderControl("Thickness", 0, 30, 1, "THICKNESS", SettingsCategories.PARTICLE);
  let alphaSlider = new SliderControl("Alpha", 0, 255, 1, "ALPHA", SettingsCategories.PARTICLE);

  pauseRunButton = new ButtonControl("Pause", "toggled", toggleRunning);

  // Add all sliders control for update capability
  sliderControls.push(numParticlesSlider);
  sliderControls.push(fieldSlider);
  sliderControls.push(detailSlider);
  sliderControls.push(forceSlider);
  sliderControls.push(speedSlider);
  sliderControls.push(timeSpeedSlider);
  sliderControls.push(maxSpeedSlider);
  sliderControls.push(thicknessSlider);
  sliderControls.push(alphaSlider);
}

function switchColorMode() {
  if (Settings.USE_RAINBOW) {
    colorMode(HSB, 255);
  } else {
    colorMode(RGB);
  }
}

function clearBackground() {
  background(20);
}

function setNoiseDetail() {
  noiseDetail(Settings.DETAIL);
}

function draw() {
  //clearBackground();
  if (Settings.DRAW_VECTORS || Settings.DRAW_NOISE || Settings.DRAW_VISITED_BUBBLES) {
    background(20);
  }

  field.updateAndDraw(drawVector, drawNoiseBox, drawBubble);

  if (Settings.DRAW_PARTICLES  || Settings.DRAW_VISITED_BUBBLES ) {
    updateAndDrawParticles();
  }

  if (Settings.DRAW_FPS) {
    drawFps();
  }

  for (let control of sliderControls) {
    control.update();
  }
}

function drawVector(x, y, v) {
  push();
  colorMode(RGB);

  if (Settings.DRAW_NOISE) {
    stroke(255, 20, 20);
  } else {
    stroke(160);
  }

  strokeWeight(2);
  translate(x * Settings.FIELD_SCALE + Settings.FIELD_SCALE / 2, y * Settings.FIELD_SCALE + Settings.FIELD_SCALE / 2);
  rotate(v.heading());
  line(0, 0, Settings.FIELD_SCALE / 2, 0);
  const arrowHead = Settings.FIELD_SCALE / 5;
  line(Settings.FIELD_SCALE / 2 - arrowHead, arrowHead, Settings.FIELD_SCALE / 2, 0);
  line(Settings.FIELD_SCALE / 2 - arrowHead, -arrowHead, Settings.FIELD_SCALE / 2, 0);

  if (Settings.USE_RAINBOW) {
    colorMode(HSB, 255);
  }
  pop();
}

function drawNoiseBox(x, y, n) {
  push();
  noStroke();
  translate(x * Settings.FIELD_SCALE, y * Settings.FIELD_SCALE);
  const noiseMappedGrayscaleValue = map(n, 0, 1, 0, 255);
  fill(noiseMappedGrayscaleValue);
  rect(0, 0, Settings.FIELD_SCALE, Settings.FIELD_SCALE);
  noFill();
  pop();
}

function drawBubble(x,y,numTimesVisited) {

  if(!numTimesVisited)
    numTimesVisited = 1;
    
  noStroke();  
  push();
  colorMode(HSB,255);
  fill(numTimesVisited%255, 255,255, 50);
  let size = sin(numTimesVisited)*100;
  
  translate(x * Settings.FIELD_SCALE + Settings.FIELD_SCALE / 2, y * Settings.FIELD_SCALE + Settings.FIELD_SCALE / 2);
  circle(0, 0, size);
  pop();
}

function updateAndDrawParticles() {
  for (let i = 0; i < Settings.NUMBER_OF_PARTICLES; i++) {
    particles[i].follow(field);
    particles[i].update();
    particles[i].stopAtEdges();

    if(Settings.DRAW_PARTICLES)
      particles[i].render();
  }
}

function drawFps() {
  if (fpsCounter % FPS_DRAW_RATE == 0) {
    currentFps = floor(frameRate());
    fpsCounter = 0;
  }

  fill(0);
  rect(7, 00, 60, 30);
  fill(255);
  text("fps : " + currentFps, 20, 20);
  noFill();

  fpsCounter++;
}
