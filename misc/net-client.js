var net =require('net');

var outboundMessage = 'ping';

var client = net.createConnection({'port':6000},function(){
    client.write(outboundMessage)
});
client.on('data',function(inbondMessage){
    var messageString = inbondMessage.toString();
    console.log('Wrote'+outboundMessage+'said'+messageString)
    client.end()
})