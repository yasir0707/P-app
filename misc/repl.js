var repl = require('repl');


repl.start({
    'prompt':'>',
    'eval':function(str){
        console.log('At the evalution stage',str);

        if(str.indexOf('fizz') > -1){
            console.log('buzz');
        }
    }
})