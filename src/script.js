let socket = io.connect('http://localhost:7000');

socket.on('connected', function(){
  console.log('Socket Connected');
});
socket.on('disconnect', function(){
  console.log('Socket Disconnected');
});
socket.on('data', function (data) {
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
let target = {x: 0, y: 0, z: 0};
let current = {x: 0, y: 0, z: 0};
let active = false;

const lerpFactor = 0.1;
let scheme = chroma.scale();

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const screenMin = screenWidth < screenHeight ? screenWidth : screenHeight;
const scalar = screenMin * 0.003;

function setup() {
  frameRate = 60;
  setupCanvas();
  draw();
};

function setupCanvas() {
  canvas = document.createElement('canvas');
  c = canvas.getContext('2d');
  canvas.width = screenWidth;
  canvas.height = screenHeight;
  document.body.appendChild(canvas);
  c.translate(screenWidth/2, screenHeight/2);
};

function reset() {
  c.clearRect(-screenWidth/2, -screenHeight/2, screenWidth, screenHeight);

  // new colour scheme
  let colours = [];
  for (let i = 0; i < randomInteger(2, 5); i++) {
    let h = hues[randomInteger(0, hues.length-1)];
    let l = randomInteger(50, 80);
    colours.push('hsl('+h+', 100%, '+l+'%)');
  }
  scheme = chroma.scale(colours);
}

function update() {
  let dir = new Victor(target.x-current.x, target.y-current.y).horizontalAngle();
  let velocity = new Victor(3, 0).rotate(dir);

  current.x += velocity.x;
  current.y += velocity.y;

  current.z = current.z*(1-lerpFactor) + target.z*lerpFactor;
}

function draw() {
  if (active) {
    c.beginPath();

    let radius = Math.abs(current.z).map(0, 200, 5, 10);
    let through = clamp(current.z.map(-200, 200, 0, 1), 0, 1);
    c.fillStyle = scheme(through);
    c.arc(current.x*scalar, current.y*scalar, radius*scalar, 0, Math.PI*2);

    c.fill();
  }
};


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
	if(max === undefined) {
		max = min;
		min = 0;
	}
	return Math.floor(Math.random() * (max+1-min)) + min;
}

function clamp(value, min, max) {
  if (max < min) {
    var temp = min;
    min = max;
    max = temp;
  }
  return Math.max(min, Math.min(value, max));
};
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

// IGNORE FROM HERE
//=====================================

var frameRate = 60,
    lastUpdate = Date.now();

function cjsloop() {
  var now = Date.now();
  var elapsedMils = now - lastUpdate;
  if (typeof window.draw == 'function' && elapsedMils >= 1000 / window.frameRate) {
    window.draw();
    window.update();
    lastUpdate = now - elapsedMils % (1000 / window.frameRate);
  }
  requestAnimationFrame(cjsloop);
};

(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function() {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };

  if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
    clearTimeout(id);
  };
})();

window.addEventListener('load', init);

function init() {
  if (typeof window.setup == 'function') window.setup();
  cjsloop();
}
