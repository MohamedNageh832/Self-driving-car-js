class Car {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.polygon = [];
    this.isDamaged = false;

    this.speed = 0;
    this.acceleration = 0.1;
    this.nitros = 100;
    this.maxSpeed = 3;
    this.friction = 0.05;

    this.angle = 0;
    this.angleCorrectionFactor = 0.03;

    this.controls = new Controls();
    this.sensor = new Sensor(this, 200, 4, (Math.PI * 5) / 12);
  }

  update(roadBorders) {
    this.#move();
    this.isDamaged = this.#assesDamage(roadBorders);
    this.polygon = this.#createPolygon();
    this.sensor.update(roadBorders);
  }

  #move() {
    if (this.controls.forward && this.speed < this.maxSpeed) {
      this.speed += this.acceleration;
    }

    if (this.controls.backward && this.speed > -this.maxSpeed / 2) {
      this.speed -= this.acceleration;
    }

    if (this.speed !== 0) {
      const newAngle =
        this.angleCorrectionFactor * (this.speed / this.maxSpeed);

      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.right) this.angle -= newAngle * flip;
      if (this.controls.left) this.angle += newAngle * flip;
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;

    if (this.speed > 0) this.speed -= this.friction;
    else if (this.speed < 0) this.speed += this.friction;

    if (Math.abs(this.speed) < this.friction) this.speed = 0;

    if (this.controls.isBoosting && this.nitros > 0) {
      this.maxSpeed = 12;
      this.acceleration = 0.3;
      this.nitros -= this.acceleration * 3;
    } else {
      this.maxSpeed = 3;
      this.acceleration = 0.1;
    }

    if (this.nitros < 100 && !this.controls.isBoosting) {
      this.nitros += this.acceleration;
    }

    if (Math.abs(this.nitros) < this.acceleration) this.nitros = 0;
    else if (this.nitros > 100) this.nitros = 100;
  }

  #createPolygon() {
    const points = [];

    const r = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);

    const topLeftPoint = {
      x: this.x - r * Math.sin(this.angle + alpha),
      y: this.y - r * Math.cos(this.angle + alpha),
    };

    const topRightPoint = {
      x: this.x - r * Math.sin(this.angle - alpha),
      y: this.y - r * Math.cos(this.angle - alpha),
    };

    const bottomRightPoint = {
      x: this.x - r * Math.sin(Math.PI + this.angle - alpha),
      y: this.y - r * Math.cos(Math.PI + this.angle - alpha),
    };

    const bottomLeftPoint = {
      x: this.x - r * Math.sin(Math.PI + this.angle + alpha),
      y: this.y - r * Math.cos(Math.PI + this.angle + alpha),
    };

    points.push(topRightPoint, topLeftPoint, bottomRightPoint, bottomLeftPoint);

    return points;
  }

  #assesDamage(roadBorders) {
    for (let i = 0; i < roadBorders.length; i++) {
      const isIntersecting = polyIntersect(this.polygon, roadBorders[i]);
      if (isIntersecting) return true;
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.isDamaged ? "#aaa" : "#000";

    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);

    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }

    ctx.fill();

    this.sensor.draw(ctx);
  }
}
