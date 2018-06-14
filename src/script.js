let socket = io.connect('http://localhost:7000');

socket.on('connected', function() {
  console.log('Socket Connected');
});
socket.on('disconnect', function() {
  console.log('Socket Disconnected');
});
socket.on('data', function(data) {
  data = JSON.parse(data);
  if (data.magnetic) {
    target = data.magnetic;
    // console.log(data.acceleration);
  }
  if (data.active !== undefined) {
    active = data.active;
    if (active == true) {
      reset();
    }
  }
});

let canvas, c;
let origin = { x: 0, y: 0, z: 0 };
let smoothTarget = { x: 0, y: 0, z: 0 };
let target = { x: 0, y: 0, z: 0 };
let current = { x: 0, y: 0, z: 0 };
let active = false;

const lerpFactor = 0.1;
let scheme = chroma.scale();

const pixelRatio = window.devicePixelRatio || 1;
let screenWidth = window.innerWidth * pixelRatio;
let screenHeight = window.innerHeight * pixelRatio;
let screenMin = screenWidth < screenHeight ? screenWidth : screenHeight;

const canvasWidth = 5000;
const canvasHeight = 5000;
const scalar = canvasWidth * 0.005;
const maxSpeed = scalar * 0.1;

const loop = () => {
  update();
  draw();
  window.requestAnimationFrame(loop);
};

const init = () => {
  setup();
  window.requestAnimationFrame(loop);
};

window.addEventListener('load', init);

function setup() {
  frameRate = 60;
  setupCanvas();
  draw();
}

function setupCanvas() {
  canvas = document.createElement('canvas');
  c = canvas.getContext('2d');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  document.body.appendChild(canvas);
  c.translate(canvasWidth / 2, canvasHeight / 2);
}

function reset() {
  c.clearRect(-canvasWidth / 2, -canvasHeight / 2, canvasWidth, canvasHeight);

  // new colour scheme
  let colours = [];
  for (let i = 0; i < randomInteger(2, 5); i++) {
    let h = hues[randomInteger(0, hues.length - 1)];
    let l = randomInteger(50, 80);
    colours.push('hsl(' + h + ', 100%, ' + l + '%)');
  }
  scheme = chroma.scale(colours);

  document.getElementById('scheme').style.background = `
    linear-gradient(
      to bottom,
      ${scheme.colors(20).join(', ')}
    )`;

  // set the origin point
  origin = Object.assign({}, target);
  smoothTarget = Object.assign({}, target);
  current = Object.assign({}, target);
}

function update() {
  // add 1% of target to smoothTarget
  ['x', 'y', 'z'].forEach(axis => {
    smoothTarget[axis] += (target[axis] - smoothTarget[axis]) * 0.01;
  });

  let diff = new Vector2(
    smoothTarget.x - current.x,
    smoothTarget.y - current.y
  );
  let velocity = new Vector2(maxSpeed, 0).rotate(diff.angle());
  if (diff.magnitude() < maxSpeed)
    velocity.normalise().multiplyEq(diff.magnitude());

  current.x += velocity.x;
  current.y += velocity.y;

  current.z = current.z * (1 - lerpFactor) + target.z * lerpFactor;
}

function draw() {
  if (active) {
    c.beginPath();

    let radius = Math.abs(current.z - origin.z).map(0, 200, 5, 10) * scalar;
    let through = clamp((current.z - origin.z).map(-200, 200, 0, 1), 0, 1);
    let x = -(current.x - origin.x) * scalar;
    let y = (current.y - origin.y) * scalar;
    c.fillStyle = scheme(through);
    c.arc(x, y, radius, 0, Math.PI * 2);

    c.fill();
  }
}

var hues = [
  2,
  10,
  17,
  37,
  40,
  63,
  67,
  72,
  74,
  148,
  152,
  156,
  160,
  170,
  175,
  189,
  194,
  260,
  270,
  280,
  288,
  302,
  320,
  330,
  340,
  350
];

function randomInteger(min, max) {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}

function clamp(value, min, max) {
  if (max < min) {
    var temp = min;
    min = max;
    max = temp;
  }
  return Math.max(min, Math.min(value, max));
}
Number.prototype.map = function(in_min, in_max, out_min, out_max) {
  return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};
