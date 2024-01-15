class Road {
  constructor(x, laneWidth, lanesCount = 3) {
    this.x = x;
    this.width = laneWidth * lanesCount;
    this.lanesCount = lanesCount;

    const CENTER_LANE_INDEX = Math.floor(lanesCount / 2);

    this.left = x - this.width / 2;
    this.right = x + this.width / 2;
    this.lanesXPosition = this.#getLanesXPosition();
    this.lanes = this.#getLanes();
    this.centerLane = this.lanes[CENTER_LANE_INDEX];

    const INFINITY = 1000000;
    this.top = -INFINITY;
    this.bottom = INFINITY;

    this.borders = this.#getBorders();
  }

  #getLanes() {
    const lanes = [];

    for (let i = 0; i < this.lanesCount; i++) {
      lanes.push(new Lane(this, i));
    }

    return lanes;
  }

  #getLanesXPosition() {
    const result = [];

    for (let i = 0; i <= this.lanesCount; i++) {
      const x = lerp(this.left, this.right, i / this.lanesCount);
      result.push(x);
    }

    return result;
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

class Lane {
  constructor(road, laneIndex) {
    this.road = road;
    this.laneWidth = road.width / road.lanesCount;
    this.left = road.left + laneIndex * this.laneWidth;
    this.center = this.#getLaneCenter(laneIndex);
  }

  #getLaneCenter(laneIndex) {
    const laneWidth = this.road.width / this.road.lanesCount;
    return (
      this.road.left +
      laneWidth / 2 +
      Math.min(laneIndex, this.road.lanesCount - 1) * laneWidth
    );
  }
}
