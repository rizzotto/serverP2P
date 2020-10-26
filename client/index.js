var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var fs = require('fs');
var md5 = require('md5');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
});

http.listen(3333, () => {
  console.log('listening on *:3333');
});

fs.readFile('./files/hp.txt', function(err, buf) {
  console.log(md5(buf));
});



