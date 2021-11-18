
var enviroments = {};

// Stagging Enviroment
enviroments.stagging={
    'port':3000,
    'envName':'stagging',
    'templateGlobals':{
        'appName':'UptimeChecker',
        'companyName':'NotAReaCompany,Inc',
        'yearCreated':'2018',
        'baseUrl':'http://localhost:3000/'
    }

}
// Testing
enviroments.testing={
    'port':4000,
    'envName':'stagging',
    'templateGlobals':{
        'appName':'UptimeChecker',
        'companyName':'NotAReaCompany,Inc',
        'yearCreated':'2018',
        'baseUrl':'http://localhost:3000/'
    }

}


// Production Enviroment
enviroments.production = {

    'port':5000,
    'envName':'production',
    
    'templateGlobals':{
        'appName':'UptimeChecker',
        'companyName':'NotAReaCompany,Inc',
        'yearCreated':'2018',
        'baseUrl':'http://localhost:3000/'
    }
}
var currentEnv = typeof(process.env.NODE_ENV) == 'string'? process.env.NODE_ENV.toLowerCase():'';

var enviromentToExport =    typeof(enviroments[currentEnv])=='object' ? enviroments[currentEnv] : enviroments.stagging;

module.exports = enviromentToExport;