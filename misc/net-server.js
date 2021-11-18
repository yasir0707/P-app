var net = require('net');

var server = net.createServer(function(connection){
    // send the message client
    var outbondMessage = 'pong';
    connection.write(outbondMessage);

    // When client write something
    connection.on('data',function(inboundMessage){
        var messageString = inboundMessage.toString();
        console.log('wrote'+outbondMessage+'said'+messageString);
    })
})

// listen
server.listen(6000)