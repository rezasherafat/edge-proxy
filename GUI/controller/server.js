const express = require('express');        // call express
const WebSocketClient = require('websocket').client;
const client = new WebSocketClient();

var childProcess = require('child_process');
client.on('connectFailed', function (error) {
  console.log(`Client connect error: ${error.toString()}`);
});
var proxyProcess = childProcess.fork('./proxy.js');

proxyProcess.on('error', function (err) {
  console.error(`Proxy error: ${err}`);
});

// execute the callback once the process has finished running
proxyProcess.on('exit', function (code) {
  console.error(`Proxy exited with code: ${code}`);
  console.log('Exiting, no use without proxy :( ');
  process.exit(-1);
});


//when we connect to the client
client.on('connect', function (connection) {
  console.log('WebSocket Client Connected');
  const app = express();
  const port = process.env.PORT || 8080;
  const router = express.Router();
  const bodyParser = require('body-parser');
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use('/api', router);
  app.listen(port);;
  console.log(`API listening on port ${port}`);
  console.log('Send POST command with the following JSON schema: {"cmd":"shell_command"}');

  //manage messages from the 'device'
  connection.on('error', function (error) {
    console.log(`Connection Error: ${error.toString()}`);
  });
  connection.on('close', function () {
    console.log('Connection Closed');
  });
  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      console.log(`Device Received: '${message.utf8Data}'`);
    }
  });
  
  //setup simple POST route with json object:
  //{ "cmd":"command_here"}
  app.post('/api/send', function (req, res, cb) {
    const cmd = req.body.cmd;
    console.log(`Attempting to send command '${cmd}' to device.`);
    connection.sendUTF(cmd.toString());
    res.send(`sent '${cmd}' to device.`);
  });

});

//do the thing
client.connect('ws://localhost:2223/', 'echo-protocol');
