class Particle {
  constructor(startingPosition) {
    if (startingPosition) this.position = startingPosition;
    else this.position = createVector(0, 0);

    this.prevPositions = [];
    this.prevPosition = this.position.copy();
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.defaultHue = floor(random(0, 255));
    this.hue = this.defaultHue;
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(Settings.MAX_SPEED);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  follow(flowField) {
    const x = floor(this.position.x / Settings.FIELD_SCALE);
    const y = floor(this.position.y / Settings.FIELD_SCALE);
    this.applyForce(flowField.getVectorAt(x,y));

    if(Settings.DRAW_VISITED_BUBBLES) {
      flowField.updateVisitedAt(x,y);
    }
  }

  stopAtEdges() {
    if (this.position.x >= width) {
      this.position.x = 1;
      this.updatePrev();
    }
    if (this.position.x <= 0) {
      this.position.x = width - 1;
      this.updatePrev();
    }
    if (this.position.y >= height) {
      this.position.y = 1;
      this.updatePrev();
    }
    if (this.position.y <= 0) {
      this.position.y = height - 1;
      this.updatePrev();
    }
  }

  updatePrev() {
    //this.prevPositions.push(this.position.copy());
    this.prevPosition = this.position.copy();
  }

  render() {
    this.hue += 1;

    if (this.hue == 255) {
      this.hue = 0;
    }

    if (Settings.USE_RAINBOW) {
      stroke(this.hue, 255, 255, Settings.ALPHA);
    } else {
      stroke(255, Settings.ALPHA);
    }

    strokeWeight(Settings.THICKNESS);

    curve(
      this.prevPosition.x,
      this.prevPosition.y,
      this.prevPosition.x,
      this.prevPosition.y,
      this.position.x,
      this.position.y,
      this.position.x,
      this.position.y
    );

    this.updatePrev();
  }
}
