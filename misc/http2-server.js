
// Dependencies
var http2 = require('http2');

// Init the server
var server = http2.createServer();

server.on('stream',function(stream,header){
    stream.respond({
        'status':200,
        'content-Type':'text/html'
    });
    stream.end('<html><body><p>Yasir</p></body></html')
})

server.listen(8000)