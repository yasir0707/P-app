

// Container for all enviroment
var enviroments = {}

// Stagging enviroment  Default
enviroments.staging = {
    'httpport':3000,
    'httpsport':3001,
    'envName':'staging',
    'hashingSecret':'ThisIsASecret',
    'maxChecks':5,
    'templateGlobals':{
        'appName':'UptimeChecker',
        'companyName':'NotAReaCompany,Inc',
        'yearCreated':'2018',
        'baseUrl':'http://localhost:3000/'
    }

};

// production enviroment
enviroments.production = {
    'port':5000,
    'httpsport':5001,
    'envName':'production',
    'hashingSecret':'ThisIsAlsoSecret',
    'maxChecks':10,
    'templateGlobals':{
        'appName':'UptimeChecker',
        'companyName':'NotAReaCompany,Inc',
        'yearCreated':'2018',
        'baseUrl':'http://localhost:5000/'
    }
}
 
// Determine which enviroment was passed as command line
var currentEnviroment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '' 

// Check the current enviroment is one of the above enviroment
var enviromentToExport = typeof(enviroments[currentEnviroment]) == 'object' ? enviroments[currentEnviroment] : enviroments.staging;


// Export to module
module.exports = enviromentToExport;    