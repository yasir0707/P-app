
var http2 = require('http2');

var client = http2.connect('http://localhost:8000/');

// create a request
var req = client.request({
    ':path':'/'
});

// When a message recieved
var str = '';
req.on('data',function(chunk){
    str+=chunk;
});
// When a message end
req.on('end',function(){
    console.log(str)
});

// End the request
req.end();