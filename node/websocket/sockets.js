var screen = require('./screen.js');
var config;

var sockets = {};
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 3001 });
console.log("WebSocketServer created on port 3001");

wss.on('connection', function connection(ws) {
  console.log("connection made...");

  ws.on('message', function(message) {
    var parsed = null;
    try {
      parsed = JSON.parse(message);    
    }
    catch(e) {
      console.error("Parse error:", message, e);
    }

    if (parsed) {
      if (parsed.coreid) {
        console.log("message from core ", parsed.coreid);
        sockets[parsed.coreid] = ws;
        // console.log("connections: ", Object.keys(sockets));
      }

      if (parsed.action === 'set-pixel-array' && parsed.colors) {
        exports.setPixelArray(ws, parsed.colors);
      }
    }

  });

  ws.send("-99,0,0,0");
});

exports.setConfig = function(conf) {
  config = conf;
  screen.setConfig(config);
};

// pixelColors param is an array of strings
// of the format 'r,g,b' where r, g, and b are 0 - 255
exports.setPixelArray = function(ws, pixelColors) {
  console.log("setPixelArray:", pixelColors);

  if (pixelColors && pixelColors.length) {
    for (var i=0; i < pixelColors.length; i++) {
      var rgb = pixelColors[i].split(',');
      if (rgb && rgb.length === 3) {
        screen.setVPixel(sockets, i, rgb[0], rgb[1], rgb[2]);
      }
    }
  }
};

/*
The Spark is connected to the node websocket.
I want to send an array of pixel colors to the node server
and have it send each pixel over the socket.
*/

/*
var count = 0;
var on = true;

setInterval(function() {  
 // console.log("connections: ", Object.keys(sockets));
  screen.setConfig(config);
  if(on)
   screen.setVPixel(sockets, count, 0, 0, 255);
  else
    screen.setVPixel(sockets, count, 0, 255, 0);
  
  count++;
  if(count == 256)
  {
    count = 0;
    on = !on;
  }
}, 10);
*/
