

// Dependies
var server =  require('./lib/server');
var workers  = require('./lib/workers');
var cli = require('./lib/cli');
var exampleDebuggingProblem = require('./lib/exampleDebuggingProblem');
var app = {};
app.init = function(){
    debugger;
    server.init();
    debugger;
    // workers.init();
    debugger;
    setTimeout(function(){
        debugger;
        cli.init();
        debugger;
    },50);
    debugger;

    debugger;
    var foo =1;
    console.log('assigned foo 1')
    debugger;
    foo++;
    console.log('increment')
    debugger;
    foo= foo*foo;
    console.log('squared')
    debugger;
    foo =foo.toString();
    console.log('converted')
    debugger;
    exampleDebuggingProblem.init();
   console.log('library')
    debugger;
}
app.init();

module.exports = app;