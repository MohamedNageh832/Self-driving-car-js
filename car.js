class Car {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.1;
    this.nitros = 100;
    this.maxSpeed = 3;
    this.friction = 0.05;

    this.angle = 0;
    this.angleCorrectionFactor = 0.03;

    this.controls = new Controls();
  }

  update(ctx) {
    this.#move();
    this.draw(ctx);
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
    } else if (this.nitros < 100) {
      this.nitros += this.acceleration;
    }

    if (Math.abs(this.nitros) < this.acceleration) {
      this.controls.isBoosting = false;
      this.maxSpeed = 3;
      this.acceleration = 0.1;
      this.nitros = 0;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);

    ctx.beginPath();
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);

    ctx.fill();
    ctx.restore();
  }
}
