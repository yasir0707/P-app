// Define Dependency

var http = require('http')
var https = require('https')
var url = require('url')
var StringDecoder  = require('string_decoder').StringDecoder;
var fs = require('fs')
var config = require('../config');
var _data  = require('./data')
var handlers = require('./handlers')
var helpers = require('./helpers');
var path = require('path')
var server = {}
var util = require('util');
var debug = util.debuglog('server');
// _data.create('test','newFile',function(err,data){
//     console.log('Error is',err)
// })

// Server in which define all request with a string
server.httpServer = http.createServer(function(req,res){

   server.unifiedserver(req,res)
    
});
// Instantiate the HTTPS SERVER
 server.httpServerOption = {
    'key': fs.readFileSync(path.join(__dirname,'/../https/key.pem')),
    'csr': fs.readFileSync(path.join(__dirname,'/../https/csr.pem'))
}
server.httpsServer = https.createServer(server.httpServerOption,function(req,res){

    server.unifiedserver(req,res)
    
});
// Logic for both http and https
server.unifiedserver = function(req,res){
        // Get the Url and parse it
        var parsedUrl = url.parse(req.url,true);

        // Get the path
        var path = parsedUrl.pathname;
        // console.log('Without trim path'+path)
        var trimPath = path.replace(/^\/+|\/+$/g,''); // used to remove / from url
    
            //  Get the query string as an Object
            var queryStringObject = parsedUrl.query;
    
        // Get the Http method
        var method = req.method.toLowerCase();
    
        // Get the header as an Object
        var header = req.headers
    
        // Get the payload if any
        var decoder = new StringDecoder('utf-8');
        var buffer = '';
        req.on('data',function(data){
            buffer += decoder.write(data)
        }) 
        req.on('end',function(){
            buffer += decoder.end();     
      
            // Choose the handler this request
            var chosenHandler = typeof(server.router[trimPath]) !== 'undefined' ? server.router[trimPath] : handlers.notFound;   
         
            // If the request with in public directory
            chosenHandler = trimPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;
            
            // var chosenHandler = router[trimPath] || handlers.notFound; 
            // Construct the data object to send to the handler
            var data = {
                'trimmedPath':trimPath,
                'queryStringObject':queryStringObject,
                'method':method,
                'headers':header,
                'payload':helpers.parseJsonToObject(buffer)
            };
    
            // Route the request to the handler
           try{
            
            chosenHandler(data,function(statusCode,payload,contentType){
                
                server.processHandlerResponse(res,method,trimPath,statusCode,payload,contentType)
            });
           }
           catch(e){
            debug(e);
            server.processHandlerResponse(res,method,trimPath,500,{'Error':'An unknown error has occur'})
           }
  
           // res.end('Hello world \n')
    
        // console.log('Request received with these payload',header)
      
        })
    
        // console.log('Request received path '+trimPath+ "with method " + method + " query string " , queryStringObject);
    
};
server.processHandlerResponse = function(res,method,trimmedPath,statusCode,payload,contentType){
                
    // Determined the type of response
    contentType = typeof(contentType) == 'string' ? contentType : 'json';
    // Use the status code called by handler
    statusCode = typeof(statusCode) == 'number' ? statusCode :200

   
   
    // Return the response that content specific
    var payloadString = '';
    if(contentType == 'json'){
        res.setHeader('Content-Type','application/json')
        // Use the payload called back by the handler
    // convert payload to String
        payloadString = JSON.stringify(payload);

    }
    if(contentType == 'html'){
       res.setHeader('Content-Type','text/html');
        payloadString = typeof(payload) == 'string'? payload : '';
    }
    
    if(contentType == 'favicon'){
        res.setHeader('Content-Type','text/x-icon');
         payloadString = typeof(payload) !== 'undefined' ? payload : '';
     }
     if(contentType == 'css'){
        res.setHeader('Content-Type','text/css');
         payloadString = typeof(payload) !== 'undefined'? payload : '';
     }
     if(contentType == 'png'){
        res.setHeader('Content-Type','image/png');
         payloadString = typeof(payload) !== 'undefined'? payload : '';
     }
     if(contentType == 'jpg'){
        res.setHeader('Content-Type','iamge/jpg');
         payloadString = typeof(payload) !== 'undefined'? payload : '';
     }
     if(contentType == 'palin'){
        res.setHeader('Content-Type','text/plain');
         payloadString = typeof(payload) !== 'undefined'? payload : '';
     }
    // Return the response tah all content type
    res.writeHead(statusCode)
    res.end(payloadString)
    
    // Log the request path
        console.log('Returning the response ',statusCode)

} 

// Define Request Router
server.router ={
    '':handlers.index,
    'account/edit':handlers.accountEdit,
    'account/deleted':handlers.accountDelete,
    'account/create':handlers.accountCreate,
    'session/create':handlers.sessionCreate,
    'session/deleted':handlers.sessiondelete,
    'checks/all':handlers.checksList,
    'checks/create':handlers.checksCreate,
    'checks/edit':handlers.checksEdit,
    'sample':handlers.ping,
    'api/users':handlers.users,
    'api/tokens':handlers.tokens,
    'api/checks':handlers.checks,
    'favicon.ico':handlers.favicon,
    'public':handlers.public,
    'example/error':handlers.exampleError
}

server.init = function(){
    
// Start a server with define port
    server.httpServer.listen(config.httpport,function(){
    console.log('\x1b[35m%s\x1b[0m','server listening  port at' ,config.httpport ," in " ,config.envName)
});

// Start a server with define port
server.httpsServer.listen(config.httpsport,function(){

    console.log('\x1b[35m%s\x1b[0m','server listening  port at' ,config.httpsport ," in " ,config.envName)
})

}

module.exports = server;