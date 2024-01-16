const simulationCanvas = document.getElementById("simulationCanvas");
const networkCanvas = document.getElementById("networkCanvas");
const ctx = simulationCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const simulationControls = document.querySelector(".simulation__controls");

const drawingSpaceWidth = window.innerWidth;
const drawingSpaceHeight = window.innerHeight - simulationControls.clientHeight;

simulationCanvas.width = window.innerWidth / 2;
simulationCanvas.height = drawingSpaceHeight - 4;
networkCanvas.width = window.innerWidth / 2;
networkCanvas.height = drawingSpaceHeight - 4;

const LANES_COUNT = 3;
const road = new Road(simulationCanvas.width / 2, 70, LANES_COUNT);
const n = 1000;
const traffic = [
  new Car(road.centerLane.center, -100, 30, 50, "Auto"),
  new Car(road.lanes[0].center, -300, 30, 50, "Auto"),
  new Car(road.lanes[2].center, -300, 30, 50, "Auto"),
  new Car(road.lanes[1].center, -500, 30, 50, "Auto"),
  new Car(road.lanes[0].center, -500, 30, 50, "Auto"),
  new Car(road.lanes[0].center, -700, 30, 50, "Auto"),
  new Car(road.lanes[2].center, -700, 30, 50, "Auto"),
  new Car(road.lanes[1].center, -900, 30, 50, "Auto"),
  new Car(road.lanes[2].center, -900, 30, 50, "Auto"),
  new Car(road.lanes[0].center, -1100, 30, 50, "Auto"),
  new Car(road.lanes[1].center, -1100, 30, 50, "Auto"),
  new Car(road.lanes[1].center, -1300, 30, 50, "Auto"),
  new Car(road.lanes[2].center, -1300, 30, 50, "Auto"),
  new Car(road.lanes[0].center, -1500, 30, 50, "Auto"),
  new Car(road.lanes[2].center, -1500, 30, 50, "Auto"),
  new Car(road.lanes[1].center, -1700, 30, 50, "Auto"),
];
const fps = 60;
let prevTime = 0;
const prevBestCar = getBestCar();
const cars = generateCars(n);
let carsToDraw = cars;
let bestCar = cars[0];
let simulationIsMonitored = false;

function saveBestCar() {
  const data = { brain: bestCar.brain, y: bestCar.y };
  localStorage.setItem("bestCar", JSON.stringify(data));
}

function discardBestCar() {
  localStorage.removeItem("bestCar");
}

function getBestCar() {
  return JSON.parse(localStorage.getItem("bestCar"));
}

function generateCars(n) {
  const cars = [];

  const bestBrain = prevBestCar ? prevBestCar.brain : null;

  for (let i = 0; i < n; i++) {
    const car = new Car(road.centerLane.center, 100, 30, 50, "AI");

    if (prevBestCar) {
      if (i === 0) car.brain = bestBrain;
      else car.brain = NeuralNetwork.mutate(bestBrain, 0.5);
    }

    cars.push(car);
  }

  return cars;
}

function monitorSimulation() {
  simulationIsMonitored = true;

  setTimeout(() => {
    const passedTraffic = bestCar.y - traffic[traffic.length - 1].y < -100;
    const didBetter = bestCar.y < prevBestCar.y;

    if (passedTraffic && didBetter) {
      saveBestCar();
      NotificationManager.push("New best brain was found!");
    }

    window.location.reload();
  }, 60000);
}

function animate(time) {
  const now = time;

  // making simulation 60 FPS (now - prevTime > 1000 / fps)
  if (true) {
    prevTime = now;
    carsToDraw = cars.sort((a, b) => a.y - b.y).slice(0, 50);

    if (carsToDraw.length === 0) return;
    for (let i = 0; i < cars.length; i++) {
      if (cars[i].isDamaged) continue;
      cars[i].update(road.borders, traffic);
    }

    ctx.clearRect(0, 0, simulationCanvas.width, simulationCanvas.height);

    ctx.save();

    const yValues = carsToDraw.map((c) => c.y);

    bestCar = carsToDraw.find((car) => car.y === Math.min(...yValues));

    ctx.translate(
      -bestCar.x + simulationCanvas.width * 0.5,
      -bestCar.y + simulationCanvas.height * 0.7
    );

    road.draw(ctx);

    for (let i = 0; i < traffic.length; i++) {
      traffic[i].update(road.borders, []);
      traffic[i].draw(ctx, "#f00");
    }

    ctx.globalAlpha = 0.2;
    for (let i = 1; i < carsToDraw.length; i++) {
      if (carsToDraw[i].isDamaged) continue;
      carsToDraw[i].draw(ctx, "#00f");
    }

    ctx.globalAlpha = 1;
    bestCar.draw(ctx, "#00f", true);

    ctx.restore();

    // Visualizer.drawNetwork(networkCtx, bestCar.brain);

    networkCtx.lineDashOffset = -time / 50;
  }

  const id = requestAnimationFrame(animate);

  if (!simulationIsMonitored) monitorSimulation();
}

animate();

window.addEventListener("resize", () => {
  simulationCanvas.height = window.innerHeight - 4;
});

const saveBestCarBtn = document.querySelector(".save-best-brain-btn");
const discardBrainBtn = document.querySelector(".discard-brain-btn");
const reloadBtn = document.querySelector(".reload-btn");

saveBestCarBtn.addEventListener("click", saveBestCar);
discardBrainBtn.addEventListener("click", discardBestCar);
reloadBtn.addEventListener("click", () => window.location.reload());
