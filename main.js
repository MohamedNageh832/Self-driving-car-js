const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 4;

const LANES_COUNT = 5;
const CENTER_LANE_INDEX = Math.floor(LANES_COUNT / 2);
const road = new Road(canvas.width / 2, 70, LANES_COUNT);
const car = new Car(
  road.getLaneCenter(CENTER_LANE_INDEX),
  100,
  30,
  50,
  "Manual"
);
const traffic = [
  new Car(road.getLaneCenter(CENTER_LANE_INDEX), -100, 30, 50, "Auto"),
];

function animate() {
  car.update(road.borders, traffic);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(-car.x + canvas.width * 0.5, -car.y + canvas.height * 0.7);

  ctx.font = "16px sans-serif";
  ctx.fillText(
    `Nitros: ${car.nitros.toFixed(2)}`,
    car.x - canvas.width * 0.5 + 20,
    car.y - canvas.height * 0.7 + 20
  );

  road.draw(ctx);

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
    traffic[i].draw(ctx, "#f00");
  }

  car.draw(ctx, "#00f");
  ctx.restore();

  const id = requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
  canvas.height = window.innerHeight - 4;
});
