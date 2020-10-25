var fs = require('fs');
var md5 = require('md5');

//TODO Peer
// maybe https://socket.io/blog/socket-io-p2p/

// Hash das Files
fs.readFile('./files/hp.txt', function(err, buf) {
  console.log(md5(buf));
});