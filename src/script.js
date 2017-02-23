var socket = io.connect('http://localhost:7000');

socket.on('connected', function(){
  console.log('Socket Connected');
});
socket.on('disconnect', function(){
  console.log('Socket Disconnected');
});
socket.on('data', function (data) {
  // console.log(data);
});



let canvas, c;
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const screenMin = screenWidth < screenHeight ? screenWidth : screenHeight;

const setup = function() {
  frameRate = 60;
  setupCanvas();
  draw();
};

const setupCanvas = function() {
  canvas = document.createElement('canvas');
  c = canvas.getContext('2d');
  canvas.width = screenWidth;
  canvas.height = screenHeight;
  document.body.appendChild(canvas);
};

const update = function() {

}

const draw = function() {
};










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

// requestAnimationFrame
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik MÃ¶ller
// fixes from Paul Irish and Tino Zijdel

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
