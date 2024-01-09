class Sensor {
  constructor(object, rayLength, raysCount, viewingAngle) {
    this.object = object;
    this.rayLength = rayLength;
    this.raysCount = raysCount;
    this.viewingAngle = viewingAngle;
    this.rays = [];
    this.readings = [];
  }

  update(roadBorders, traffic) {
    this.#castRays(roadBorders, traffic);
  }

  #castRays(roadBorders, traffic) {
    this.rays = [];
    this.readings = [];

    for (let i = 0; i < this.raysCount; i++) {
      const rayAngle =
        this.raysCount > 1
          ? lerp(
              this.viewingAngle / 2,
              -this.viewingAngle / 2,
              i / (this.raysCount - 1)
            ) + this.object.angle
          : this.object.angle;

      const startPoint = {
        x: this.object.x,
        y: this.object.y,
      };

      const endPoint = {
        x: this.object.x - Math.sin(rayAngle) * this.rayLength,
        y: this.object.y - Math.cos(rayAngle) * this.rayLength,
      };

      const ray = [startPoint, endPoint];

      this.readings.push(this.#getReadings(ray, roadBorders, traffic));

      this.rays.push(ray);
    }
  }

  #getReadings(ray, roadBorders, traffic) {
    const touches = [];

    for (let i = 0; i < roadBorders.length; i++) {
      const touch = getIntersection(
        ray[0],
        ray[1],
        roadBorders[i][0],
        roadBorders[i][1]
      );

      if (touch) touches.push(touch);
    }

    for (let i = 0; i < traffic.length; i++) {
      const poly = traffic[i].polygon;
      for (let j = 0; j < poly.length; j++) {
        const touch = getIntersection(
          ray[0],
          ray[1],
          poly[j],
          poly[(j + 1) % poly.length]
        );

        if (touch) touches.push(touch);
      }
    }

    if (touches.length === 0) return null;

    const offsets = touches.map((e) => e.offset);
    const minOffset = Math.min(...offsets);
    const reading = touches.find((e) => e.offset === minOffset);

    return reading;
  }

  draw(ctx) {
    for (let i = 0; i < this.raysCount; i++) {
      const ray = this.rays[i];
      const end = this.readings[i] ? this.readings[i] : ray[1];

      ctx.beginPath();
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = 2;
      ctx.moveTo(ray[0].x, ray[0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "#000";
      ctx.moveTo(ray[1].x, ray[1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }
}
