const simulationCanvas = document.getElementById("simulationCanvas");
const networkCanvas = document.getElementById("networkCanvas");
const ctx = simulationCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

simulationCanvas.width = window.innerWidth / 2;
simulationCanvas.height = window.innerHeight - 4;
networkCanvas.width = window.innerWidth / 2;
networkCanvas.height = window.innerHeight - 4;

const LANES_COUNT = 5;
const CENTER_LANE_INDEX = Math.floor(LANES_COUNT / 2);
const road = new Road(simulationCanvas.width / 2, 70, LANES_COUNT);
const car = new Car(road.getLaneCenter(CENTER_LANE_INDEX), 100, 30, 50, "AI");
const traffic = [
  new Car(road.getLaneCenter(CENTER_LANE_INDEX), -100, 30, 50, "Auto"),
];

function animate(time) {
  car.update(road.borders, traffic);
  ctx.clearRect(0, 0, simulationCanvas.width, simulationCanvas.height);

  ctx.save();
  ctx.translate(
    -car.x + simulationCanvas.width * 0.5,
    -car.y + simulationCanvas.height * 0.7
  );

  ctx.font = "16px sans-serif";
  road.draw(ctx);
  ctx.fillText(
    `Nitros: ${car.nitros.toFixed(2)}`,
    car.x - simulationCanvas.width * 0.5 + 20,
    car.y - simulationCanvas.height * 0.7 + 20
  );

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
    traffic[i].draw(ctx, "#f00");
  }

  car.draw(ctx, "#00f");
  ctx.restore();

  Visualizer.drawNetwork(networkCtx, car.brain);

  networkCtx.lineDashOffset = -time / 50;

  const id = requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
  simulationCanvas.height = window.innerHeight - 4;
});
