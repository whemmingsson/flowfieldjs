let particles;
let field;

let sliderControls = [];
let checkboxControls = [];

const FPS_DRAW_RATE = 15; // Every x frames
let fpsCounter = 0;
let currentFps = 60;

function setup() {
  var canvas = createCanvas(1400, 800);
  canvas.parent("sketch");

  noiseDetail(Settings.DETAIL);

  if (Settings.USE_RAINBOW) {
    colorMode(HSB, 255);
  }

  initialize();
  setupControls();
}

function initialize() {
  particles = [];
  initParticles();
  field = new Flowfield(
    floor(height / Settings.FIELD_SCALE),
    floor(width / Settings.FIELD_SCALE)
  );
  if (Settings.DRAW_VECTORS) {
    drawVectorsInField();
  }

  background(20);
}

function initParticles() {
  for (let i = 0; i < Settings.NUMBER_OF_PARTICLES; i++) {
    particles.push(new Particle(createVector(random(width), random(height))));
  }
}

function setupControls() {
  // Environment
  new HeadingControl("Environment");

  let rainboxCheckbox = new CheckboxControl(
    "Rainbow mode",
    "USE_RAINBOW",
    SettingsCategories.ENV,
    switchColorMode
  );

  let vectorsCheckbox = new CheckboxControl(
    "Render vectors",
    "DRAW_VECTORS",
    SettingsCategories.ENV,
    clearBackground
  );

  let particlesCheckbox = new CheckboxControl(
    "Render particles",
    "DRAW_PARTICLES",
    SettingsCategories.ENV,
    clearBackground
  );

  let fpsCheckbox = new CheckboxControl(
    "Render fps info",
    "DRAW_FPS",
    SettingsCategories.ENV
  );

  // Field
  new HeadingControl("Flowfield");
  let fieldSlider = new SliderControl(
    "Field scale",
    20,
    120,
    20,
    "FIELD_SCALE",
    SettingsCategories.FIELD,
    initialize
  );

  let forceSlider = new SliderControl(
    "Force strength",
    0.1,
    5,
    0.1,
    "FORCE_STRENGTH",
    SettingsCategories.FIELD
  );

  let speedSlider = new SliderControl(
    "Zoom level",
    0,
    0.5,
    0.005,
    "OFFSET_SPEED",
    SettingsCategories.FIELD
  );

  let timeSpeedSlider = new SliderControl(
    "Time offset speed",
    0,
    0.1,
    0.005,
    "TIME_OFFSET_SPEED",
    SettingsCategories.FIELD
  );

  // Particles
  new HeadingControl("Particles");
  let numParticlesSlider = new SliderControl(
    "Number of particles",
    5,
    1000,
    5,
    "NUMBER_OF_PARTICLES",
    SettingsCategories.ENV,
    initialize
  );

  let maxSpeedSlider = new SliderControl(
    "Max speed",
    1,
    15,
    1,
    "MAX_SPEED",
    SettingsCategories.PARTICLE
  );

  let thicknessSlider = new SliderControl(
    "Thickness",
    1,
    30,
    1,
    "THICKNESS",
    SettingsCategories.PARTICLE
  );

  let alphaSlider = new SliderControl(
    "Alpha",
    1,
    255,
    1,
    "ALPHA",
    SettingsCategories.PARTICLE
  );

  // Add all sliders control for update capability
  sliderControls.push(numParticlesSlider);
  sliderControls.push(fieldSlider);
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

function draw() {
  if (Settings.DRAW_VECTORS) {
    background(20);
  }

  if (Settings.Field.ENABLE_TIME) {
    field.create();

    if (Settings.DRAW_VECTORS) {
      drawVectorsInField();
    }
  }

  if (Settings.DRAW_PARTICLES) {
    updateAndDrawParticles();
  }

  if (Settings.DRAW_FPS) {
    drawFps();
  }

  for (let control of sliderControls) {
    control.update();
  }
}

function drawVectorsInField() {
  strokeWeight(1);
  for (let y = 0; y < field.rows; y++) {
    for (let x = 0; x < field.columns; x++) {
      drawVector(x, y);
    }
  }
}

function drawVector(x, y) {
  push();
  stroke(160);
  translate(
    x * Settings.FIELD_SCALE + Settings.FIELD_SCALE,
    y * Settings.FIELD_SCALE + Settings.FIELD_SCALE
  );
  rotate(field.getVectorAt(x, y).heading());
  line(0, 0, Settings.FIELD_SCALE, 0);
  const arrowHead = Settings.FIELD_SCALE / 5;
  line(Settings.FIELD_SCALE - arrowHead, arrowHead, Settings.FIELD_SCALE, 0);
  line(Settings.FIELD_SCALE - arrowHead, -arrowHead, Settings.FIELD_SCALE, 0);
  pop();
}

function updateAndDrawParticles() {
  for (let i = 0; i < Settings.NUMBER_OF_PARTICLES; i++) {
    particles[i].follow(field.vectors);
    particles[i].update();
    particles[i].stopAtEdges();
    particles[i].render();
  }
}

function drawFps() {
  if (fpsCounter % FPS_DRAW_RATE == 0) {
    currentFps = floor(frameRate());
    fpsCounter = 0;
  }

  fill(0);
  noStroke();
  rect(7, 00, 60, 30);
  fill(255);
  text("fps : " + currentFps, 20, 20);
  noFill();

  fpsCounter++;
}
