var socket = io.connect('http://10.10.10.100:3000');
var xSpeed = 0;
var xAccel = 0;
var zSpeed = 0;

var kFilteringFactor = 0.1;
accel = [0, 0, 0];

var noActiveMove = true;
var setActiveMove = function () {
  noActiveMove = false;
  setTimeout(function () {
    noActiveMove = true;
  }, 500);
}

var activeTurn = false;
var setActiveTurn = function () {
  activeTurn = true;
  setTimeout(function () {
    socket.emit('message', 'straight');
    activeTurn = false;
  }, 200);
}

var normalize = function (motionEvent) {
  var result = {
    acceleration: {
      x: motionEvent.acceleration.x,
      y: motionEvent.acceleration.y,
      z: motionEvent.acceleration.z
    },
    interval: motionEvent.interval
  }
  if (navigator.userAgent.match(/Android/i)) {
    result.interval /= 1000.0;
    result.acceleration.z *= -1;
  }
  return result;
};

var turnThreshold = 25;
var stopTurnThreshold = 15;
var dir = 0;

var sign = function (a) {
  return a < 0 ? -1 : 1;
};

window.addEventListener('deviceorientation', function (event) {
  var beta = event.beta;
  $('#beta').text(beta);
  if (Math.abs(beta) > turnThreshold) {
    var curDir = sign(beta);
    if (curDir == dir) {
      return;
    }
    dir = curDir;
    var data = (dir == 1 ? 'right' : 'left');
    socket.emit('message', data);
  } else if (Math.abs(beta) < stopTurnThreshold && dir != 0) {
    dir = 0;
    socket.emit('message', 'straight');
  }
}, true);

window.addEventListener('devicemotion', function (motionEvent) {
  motionEvent = normalize(motionEvent);
  var x = motionEvent.acceleration.x;
  var y = motionEvent.acceleration.y;
  var z = motionEvent.acceleration.z;
  accel[0] = x * kFilteringFactor + accel[0] * (1.0 - kFilteringFactor);
  accel[1] = y * kFilteringFactor + accel[1] * (1.0 - kFilteringFactor);
  accel[2] = z * kFilteringFactor + accel[2] * (1.0 - kFilteringFactor);
  var result = {};
  result.x = x - accel[0];
  result.y = y - accel[1];
  result.z = z - accel[2];
  x = result.x;
  y = result.y;
  z = result.z;

//   x = Math.round(x * 10) / 10;
//   y = Math.round(y * 10) / 10;
//   z = Math.round(z * 10) / 10;
  xAccel = x; //xAccel * 0.9 + x * 0.1;
  var interval = motionEvent.interval;
  xSpeed += xAccel * interval;
  zSpeed += z * interval;
/*  $('#x').text(xAccel.toFixed(6));
  $('#y').text(y.toFixed(6));
  $('#z').text(z.toFixed(6));
  $('#interval').text(interval);
  $('#xSpeed').text(xSpeed); */
  $('#zSpeed').text(zSpeed.toFixed(6));
  var speed = Math.sqrt(x * x + y * y + z * z);
//  $('#speed').text(speed);

  if (noActiveMove) {
    if (zSpeed > 0.65) {
      $('#jump').text('Crouch! ' + zSpeed);
      socket.emit('message', 'crouch');
      setActiveMove();
    } else if (zSpeed < -0.65) {
      $('#jump').text('Jump! ' + zSpeed);
      socket.emit('message', 'jump');
      setActiveMove();
    } else {
      $('#jump').text('No Jump...');
    }
  }
}, true);

