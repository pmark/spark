var WebSocket = require('ws');
var ws = new WebSocket('ws://127.0.0.1:3001');

ws.on('open', function() {
	var message = {action:"set-pixel-array", colors: ['255,0,0', '0,255,0', '0,0,255']}
	ws.send(JSON.stringify(message));
});

ws.on('message', function(message) {
    console.log('received: %s', message);
});

module.exports = ws;