let particles;
let field;

let sliderControls = [];
let checkboxControls = [];

function setup() {
    var canvas = createCanvas(1400, 800);
    canvas.parent('sketch');

    noiseDetail(Settings.Field.DETAIL);

    if (Settings.Env.USE_RAINBOW) {
        colorMode(HSB, 255);
    }

    initialize();
    setupControls(); 
}

function initialize() {
    particles = [];
    initParticles();
    field = new Flowfield(floor(height / Settings.FIELD_SCALE), floor(width / Settings.FIELD_SCALE));
    if (Settings.Env.DRAW_VECTORS) {
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
   let numParticlesSlider = new SliderControl("Number of particles", 5, 1000, 5, "NUMBER_OF_PARTICLES", SettingsCategories.ENV, initialize);
   let fieldSlider = new SliderControl("Field scale", 20, 120, 20, "FIELD_SCALE", SettingsCategories.FIELD, initialize);
   let forceSlider = new SliderControl("Force strength", 0, 5, 0.1, "FORCE_STRENGTH", SettingsCategories.FIELD);
   let speedSlider = new SliderControl("Offset speed", 0.01, 1, 0.005, "OFFSET_SPEED", SettingsCategories.FIELD);
   let timeSpeedSlider = new SliderControl("Time offset speed", 0, 0.1, 0.005, "TIME_OFFSET_SPEED", SettingsCategories.FIELD);
   
   sliderControls.push(numParticlesSlider);
   sliderControls.push(fieldSlider);
   sliderControls.push(forceSlider);
   sliderControls.push(speedSlider);
   sliderControls.push(timeSpeedSlider);
}

function draw() {
    if (Settings.Env.DRAW_VECTORS) {
        background(20);
    }

    if (Settings.Field.ENABLE_TIME) {
        field.create();

        if (Settings.Env.DRAW_VECTORS) {
            drawVectorsInField();
        }
    }

    if (Settings.Env.DRAW_PARTICLES) {
        updateAndDrawParticles();
    }

    if (Settings.Env.DRAW_FPS) {
        drawFps();
    }

    for(let control of sliderControls){
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
    translate(x * Settings.FIELD_SCALE + Settings.FIELD_SCALE, y * Settings.FIELD_SCALE + Settings.FIELD_SCALE);
    rotate(field.getVectorAt(x, y).heading());
    line(0, 0, Settings.FIELD_SCALE, 0);
    const arrowHead = Settings.FIELD_SCALE/5;
    line(Settings.FIELD_SCALE-arrowHead, arrowHead, Settings.FIELD_SCALE, 0);
    line(Settings.FIELD_SCALE-arrowHead,-arrowHead, Settings.FIELD_SCALE, 0);
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
    fill(0);
    noStroke();
    rect(7, 00, 60, 30);
    fill(255);
    text("fps : " + floor(frameRate()), 20, 20);
    noFill();
}