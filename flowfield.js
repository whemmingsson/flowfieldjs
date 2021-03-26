class Flowfield {
  constructor(rows, columns) {
    this.timeOffset = 0;
    this.rows = rows;
    this.columns = columns;
    this.vectors = [];
    this.noiseValues = [];
  }

  getVectors() {
    return this.vectors;
  }

  getVectorAt(x, y) {
    return this.vectors[y][x];
  }

  getNoiseValueAt(x, y) {
    return this.noiseValues[y][x];
  }

  updateAndDraw(onDrawVectors, onDrawNoise) {
    let yOffset = 0;
    for (let y = 0; y < this.rows; y++) {
      this.vectors[y] = [];
      this.noiseValues[y] = [];
      let xOffset = 0;
      for (let x = 0; x < this.columns; x++) {
        xOffset += Settings.OFFSET_SPEED;
        const noiseValue = noise(xOffset, yOffset, this.timeOffset);
        const v = this.createForceVector(noiseValue);
        this.setVectorAt(v, x, y);
        this.setNoiseValueAt(noiseValue, x, y);

        if (Settings.DRAW_NOISE && onDrawNoise) {
          onDrawNoise(x, y, noiseValue);
        }

        if (Settings.DRAW_VECTORS && onDrawVectors) {
          onDrawVectors(x, y, v);
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

  setVectorAt(v, x, y) {
    this.vectors[y][x] = v;
  }

  setNoiseValueAt(n, x, y) {
    this.noiseValues[y][x] = n;
  }
}
