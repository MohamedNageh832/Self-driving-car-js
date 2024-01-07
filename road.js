class Road {
  constructor(x, laneWidth, lanesCount = 3) {
    this.x = x;
    this.width = laneWidth * lanesCount;
    this.lanesCount = lanesCount;

    this.left = x - this.width / 2;
    this.right = x + this.width / 2;
    this.lanesXPosition = this.#getLanesXPosition();

    const INFINITY = 1000000;
    this.top = -INFINITY;
    this.bottom = INFINITY;

    this.borders = this.#getBorders();
  }

  #getLanesXPosition() {
    const result = [];

    for (let i = 0; i <= this.lanesCount; i++) {
      const x = lerp(this.left, this.right, i / this.lanesCount);
      result.push(x);
    }

    return result;
  }

  getLaneCenter(laneIndex) {
    const laneWidth = this.width / this.lanesCount;
    return (
      this.left +
      laneWidth / 2 +
      Math.min(laneIndex, this.lanesCount - 1) * laneWidth
    );
  }

  draw(ctx) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#ffffff";

    ctx.setLineDash([20, 20]);
    for (let i = 1; i < this.lanesCount; i++) {
      ctx.beginPath();
      ctx.moveTo(this.lanesXPosition[i], this.top);
      ctx.lineTo(this.lanesXPosition[i], this.bottom);
      ctx.stroke();
    }

    ctx.setLineDash([]);

    for (let i = 0; i < this.borders.length; i++) {
      const border = this.borders[i];

      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    }
  }

  #getBorders() {
    const topLeft = { x: this.left, y: this.top };
    const topRight = { x: this.right, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const bottomRight = { x: this.right, y: this.bottom };

    const borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];

    return borders;
  }
}
