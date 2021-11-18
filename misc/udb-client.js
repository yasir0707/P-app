// Dependencies 
var dgram = require('dgram');

var client = dgram.createSocket('udp4');


var messageString = 'This is a message';
var messageBuffer =Buffer.from(messageString);

// Send Off the message
client.send(messageBuffer,6000,'localhost',function(err){
    client.close()
})