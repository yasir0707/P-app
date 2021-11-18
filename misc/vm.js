
var vm = require('vm');

// Define a context for a script
var context = {
    'foo':25
}
var script =new vm.Script(`
    foo = foo*2;
    var bar = foo +1;
    var fizz = 52;
`);
script.runInNewContext(context)
console.log(context)