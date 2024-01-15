class Visualizer {
  static drawNetwork(ctx, network) {
    const canvas = ctx.canvas;
    const levelsCount = network.levels.length;
    const neuronsOffset = 30;
    const levelHeight = 100;
    const radius = 10;
    const networkHeight = levelHeight * levelsCount;
    const top = (canvas.height - networkHeight) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = levelsCount - 1; i >= 0; i--) {
      const { inputs, outputs, biases, weights } = network.levels[i];
      const networkWidth = (neuronsOffset + radius) * inputs.length;
      const left = (canvas.width - networkWidth) / 2;
      const right = left + networkWidth;
      const bottom = top + networkHeight;

      for (let j = 0; j < inputs.length; j++) {
        const xInput = lerp(left, right, j / (inputs.length - 1));
        const yInput = lerp(bottom, top, i / levelsCount);

        for (let k = 0; k < outputs.length; k++) {
          const networkWidth = (neuronsOffset + radius) * outputs.length;
          const left = (canvas.width - networkWidth) / 2;
          const right = left + networkWidth;

          const xOutput = lerp(left, right, k / (outputs.length - 1));
          const yOutput = lerp(bottom, top, (i + 1) / levelsCount);

          // Drawing connections between nodes
          const lineColor = `rgba(255, 255, 255, ${weights[j][k]})`;
          Shapes.line(ctx, xInput, yInput, xOutput, yOutput, 1, lineColor);

          // Checking for the last layer & making sure to draw the outputs only once
          const isLastLevel = i === levelsCount - 1;
          const isLastIteration = j === inputs.length - 1;
          if (!(isLastLevel && isLastIteration)) continue;

          // Drawing output circles
          ctx.setLineDash([5, 5]);
          ctx.fillStyle = `rgba(255, 0, 0, ${outputs[k]})`;
          Shapes.circle(ctx, xOutput, yOutput, radius, "fill");

          // Drawing output text
          const directions = ["W", "A", "D", "S"];
          ctx.font = "14px bold tahoma";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = outputs[k] ? "#000" : "#fff";
          ctx.fillText(directions[k], xOutput, yOutput);
        }

        // Drawing input circles
        ctx.fillStyle = `rgba(255, 255, 0, ${inputs[j]})`;
        Shapes.circle(ctx, xInput, yInput, radius, "fill");
      }
    }
  }
}
