var SerialPort = require('serialport');

var port = new SerialPort('/dev/cu.usbmodem1411', {
  baudRate: 9600,
  parser: SerialPort.parsers.readline('\n')
});

port.on('data', function (data) {
  console.log(data);
});
