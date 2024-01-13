class Shapes {
  static line(ctx, x1, y1, x2, y2, lineWidth, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  static polygon(ctx, points, lineWidth, color) {
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.stroke();
  }

  static circle(ctx, x, y, radius, fillType) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);

    if (fillType === "fill") ctx.fill();
    else if (fillType === "stroke") ctx.stroke();
  }
}
