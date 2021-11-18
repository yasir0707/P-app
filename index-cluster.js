

// Dependies
var server =  require('./lib/server');
var workers  = require('./lib/workers');
var cli = require('./lib/cli');
var cluster = require('cluster');
var os = require('os');
var app = {};
app.init = function(){
    
    console.log('cluster master',cluster.isMaster);
    if(cluster.isMaster){
        
    // workers.init();
    setTimeout(function(){
        cli.init();
    },50)

    // Fork the process
    console.log('Fork',cluster.fork())
    for(var i = 0; i<=os.cpus().length;i++){
        cluster.fork();
    }
    }
    else{
        server.init();
    
    }

}
// console.log(require.main)
if(require.main == module){

    app.init(function(){});

}
module.exports = app;