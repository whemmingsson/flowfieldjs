class Flowfield {

    constructor(rows, columns) {
        this.timeOffset = 0;
        this.rows = rows;
        this.columns = columns;
        this.vectors = [];
        this.create();
    }

    getVectors() {
        return this.vectors;
    }

    getVectorAt(x, y) {
        return this.vectors[y][x];
    }

    create() {
        let yOffset = 0;
        for (let y = 0; y < this.rows; y++) {
            this.vectors[y] = [];
            let xOffset = 0;
            for (let x = 0; x < this.columns; x++) {
                xOffset += Settings.OFFSET_SPEED;
                this.setVectorAt(this.createForceVector(noise(xOffset, yOffset, this.timeOffset)), x, y);
            }
            yOffset += Settings.OFFSET_SPEED;
        }

        if (Settings.Field.ENABLE_TIME) {
            this.timeOffset += Settings.TIME_OFFSET_SPEED;
        }
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
}