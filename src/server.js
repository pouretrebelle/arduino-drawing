var http = require('http');
var express = require('express');
var app = express();
var SerialPort = require('serialport');
var server = http.createServer(app).listen(7000);
var io = require('socket.io').listen(server);
require('dotenv').config();

app.use(express.static(__dirname));

var port = new SerialPort(process.env.SERIAL_PORT, {
  baudRate: 9600,
  parser: SerialPort.parsers.readline('\n')
});

port.on('open', function() {
  // Now server is connected to Arduino
  console.log('Serial Port Opened');

  io.sockets.on('connection', function(socket) {
    console.log('Socket connected');
    socket.emit('connected');

    port.on('data', function(data) {
      socket.emit('data', data);
    });
  });
});
