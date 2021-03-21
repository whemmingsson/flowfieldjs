let particles;
let field;

let slider;


function setup() {
    var canvas = createCanvas(1400, 800);
    canvas.parent('sketch');

    noiseDetail(Settings.Field.DETAIL);

    if (Settings.Env.USE_RAINBOW) {
        colorMode(HSB, 255);
    }

    initialize();

    // Experimental slider
    let label = createElement('label', 'Number of particles');
    slider = createSlider(10, 1000, 50, 50);
    slider.style('width', '100%');
    label.parent('controls');
    slider.parent('controls');
}

function initialize() {
    particles = [];
    initParticles();
    field = new Flowfield(floor(height / Settings.Field.SCALE), floor(width / Settings.Field.SCALE));
    if (Settings.Env.DRAW_VECTORS) {
        drawVectorsInField();
    }

    background(20);
}

function initParticles() {
    for (let i = 0; i < Settings.Env.NUMBER_OF_PARTICLES; i++) {
        particles.push(new Particle(createVector(random(width), random(height))));
    }
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

    // TODO: Find a way to generalize this
    let val = slider.value();
    if(val !== Settings.Env.NUMBER_OF_PARTICLES){
        Settings.Env.NUMBER_OF_PARTICLES = val;
        initialize();
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
    translate(x * Settings.Field.SCALE, y * Settings.Field.SCALE);
    rotate(field.getVectorAt(x, y).heading());
    line(0, 0, Settings.Field.SCALE, 0);
    pop();
}

function updateAndDrawParticles() {
    for (let i = 0; i < Settings.Env.NUMBER_OF_PARTICLES; i++) {
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