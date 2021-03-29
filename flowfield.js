class Flowfield {
  constructor(rows, columns) {
    this.timeOffset = 0;
    this.rows = rows;
    this.columns = columns;
    this.values = [];
  }

  getVectorAt(x, y) {
    return this.values[y][x].vector;
  }

  getNoiseValueAt(x, y) {
    return this.values[y][x].noise;
  }

  updateVisitedAt(x,y) {
  
    if(!this.values[y][x].numberOfTimesVisited)
      this.values[y][x].numberOfTimesVisited = 0;

      this.values[y][x].numberOfTimesVisited++;   
  }

  updateAndDraw(onDrawVectors, onDrawNoise, onDrawBubble) {
    let yOffset = 0;
    for (let y = 0; y < this.rows; y++) {
      if(!this.values[y])
        this.values[y] = [];
      let xOffset = 0;
      for (let x = 0; x < this.columns; x++) {
        xOffset += Settings.OFFSET_SPEED;
        const noiseValue = noise(xOffset, yOffset, this.timeOffset);
        const v = this.createForceVector(noiseValue);

        if(!this.values[y][x])
          this.values[y][x] = {numberOfTimesVisited:0};

        this.values[y][x].noiseValue = noiseValue;
        this.values[y][x].vector = v;

        if (Settings.DRAW_NOISE && onDrawNoise) {
          onDrawNoise(x, y, noiseValue);
        }

        if (Settings.DRAW_VECTORS && onDrawVectors) {
          onDrawVectors(x, y, v);
        }

        if (Settings.DRAW_VISITED_BUBBLES) {
          onDrawBubble(x, y, this.values[y][x].numberOfTimesVisited);
        }
      }
      yOffset += Settings.OFFSET_SPEED;
    }

    this.timeOffset += Settings.TIME_OFFSET_SPEED;
  }

  createForceVector(noise) {
    let angle = noise * TWO_PI;
    let v = p5.Vector.fromAngle(angle);
    v.setMag(Settings.FORCE_STRENGTH);
    return v;
  }
}
