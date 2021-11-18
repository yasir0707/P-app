
// Dependies
var path = require('path');
var fs = require('fs');
var http = require('http');
var https = require('https')
var helpers = require('./helpers')
var _data = require('./data')
var url = require('url');
const { doesNotThrow } = require('assert');
var _logs = require('./logs')
var util = require('util');
var debug = util.debuglog()
var workers = {}

// Lookup all checks,get their data,send to validator
workers.getherAllChecks = function(){
    _data.list('checks',function(err,checks){
        if(!err && checks && checks.length > 0 ){
            checks.forEach(function(checkData){
                _data.read('checks',checkData,function(err,originalData){
                    if(!err && originalData){
                        workers.validateCheckData(originalData)
                    }
                    else{
                        console.log('Error reading one of the check data')
                    }
                })
            })
        }
        else{
            console.log('Error could not find any check to process')
        }
    })
}
// Sanity  check The data
workers.validateCheckData =  function(originalCheckData){
    originalCheckData = typeof(originalCheckData) == 'object' && originalCheckData != null ? originalCheckData : {};
    originalCheckData.id = typeof(originalCheckData.id) == 'string' && originalCheckData.id.trim().length == 20 ? originalCheckData.id.trim() : false;
    originalCheckData.userPhone = typeof(originalCheckData.userPhone) == 'string' && originalCheckData.userPhone.trim().length >= 10 ? originalCheckData.userPhone.trim() : false;
    // originalCheckData.protocol = typeof(originalCheckData.protocol) == ['http','https'].indexOf(originalCheckData.protocol) > -1  ? originalCheckData.protocol.trim() : false;
    originalCheckData.protocol = 'http'
    originalCheckData.url = typeof(originalCheckData.url) == 'string' && originalCheckData.url.trim().length > 0 ? originalCheckData.url.trim() : false;
    originalCheckData.method = typeof(originalCheckData.method) == 'string' && ['get','post','put','delete'].indexOf(originalCheckData.method) > -1 ? originalCheckData.method : false;  
    // originalCheckData.successCodes = typeof(originalCheckData.successCodes) == 'object' && originalCheckData.successCodes instanceof Array && originalCheckData.successCodes.length > 0 ? originalCheckData.successCodes : false;
    originalCheckData.successCodes = [200,201]
    // originalCheckData.timeOutSecond = typeof(originalCheckData.timeOutSecond) == 'number' && originalCheckData.timeOutSecond %1 ===0 && originalCheckData.timeOutSecond >= 1 && originalCheckData.timeOutSecond <=5 ?originalCheckData.timeOutSecond : false;
    originalCheckData.timeOutSecond = 3
    originalCheckData.state = typeof(originalCheckData.state) == 'string' && ['up','down'].indexOf(originalCheckData.s) > -1? originalCheckData.state : 'down';
    // originalCheckData.lastChecked = typeof(originalCheckData.lastChecked) == 'number' && originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked : false;
    originalCheckData.lastChecked = 345345453; 
    // console.log(originalCheckData.id,originalCheckData.protocol,originalCheckData.userPhone,originalCheckData.url,originalCheckData.method,originalCheckData.successCodes,originalCheckData.timeOutSecond,originalCheckData.state)
    // Check all they pass
    
    // workers.performCheck(originalCheckData)
    if(originalCheckData.id &&
        originalCheckData.userPhone &&
        originalCheckData.protocol &&
        originalCheckData.url){
            workers.performCheck(originalCheckData)
        }
        else{
            console.log('Error : One of the check is not properly formatted1')
        }
};
workers.performCheck = function(originalCheckData){
    var checkOutCome = {
        'error':false,
        'responseCode': false
    };
    var OutcomeSent = false;
    // Parse the hostname and path the orogianl check data
    var passedUrl = url.parse(originalCheckData.protocol+'://'+originalCheckData.url,true);
    var hostName= passedUrl.hostname;
    var path = passedUrl.path;

    var requestDetail = {
        'protocol':originalCheckData.protocol+':',
        'hostname':hostName,
        'method':originalCheckData.method,
        'path':path,
        'timeout':originalCheckData.timeOutSecond * 1000
    };
    var _moduleToUse = originalCheckData.protocol == 'http' ?http: https;
    var req = _moduleToUse.request(requestDetail,function(res){
        var status = res.statusCode;

        checkOutCome.responseCode =  status;
        if(!OutcomeSent){
            workers.processCheckOutcome(originalCheckData,checkOutCome);
            OutcomeSent = true;
        }
    });
    // Bind The Error
    req.on('error',function(e){
        checkOutCome.error = {
            'error' : true,
            'value': e
        }
        if(!OutcomeSent){
            workers.processCheckOutcome(originalCheckData,checkOutCome);
            OutcomeSent= true
        }
    })
    req.on('timeout',function(e){
        checkOutCome.error = {
            'error' : true,
            'value': 'timeout'
        }
        if(!OutcomeSent){
            workers.processCheckOutcome(originalCheckData,checkOutCome);
            OutcomeSent= true
        }
    });
    req.end();
};

workers.processCheckOutcome = function(originalCheckData,checkOutCome){
    var state = !checkOutCome.error && checkOutCome.responseCode && originalCheckData.successCodes.indexOf(checkOutCome.responseCode) > -1 ? 'up':'down';
    var alertWarranted = originalCheckData.lastChecked && originalCheckData.state != state ? true : false;
    var timeOutCheck = Date.now();
    workers.log(originalCheckData,checkOutCome,state,alertWarranted,timeOutCheck)

    // Update the check data
    var newCheckData =   originalCheckData;
    newCheckData.state = state;
    newCheckData.lastChecked= timeOutCheck;
    // console.log(checkOutCome,state,alertWarranted)
    _data.update('checks',newCheckData.id,newCheckData,function(err){
        if(!err){
            // Send the new check data to the next phase
            if(alertWarranted){
                workers.alertUserToStatusChange(newCheckData)
            }
            else{
                console.log('Error : Check outcome has not  changed')
            }
        }
        else{
            console.log("Error trying to save update")
        }
    })
}   
// Alert the user as a changed
workers.alertUserToStatusChange = function(newCheckData){
    console.log('e check')
    var msg = 'Alert : Your Check for '+newCheckData.method.toUpperCase()+'newCheckData.protocol'+'//'+newCheckData.url+'is currently'+newCheckData.state;
    if(msg){
        console.log(msg)
    }
    else{
        console.log('msg error')
    }
}
workers.log = function(originalCheckData,checkOutCome,state,alertWarranted,timeOutCheck){
    var logData = {
        'checks':originalCheckData,
        'outcome':checkOutCome,
        'state':state,
        'alert':alertWarranted,
        'time':timeOutCheck
    }
    var logString = JSON.stringify(logData);
    // console.log(logString)
    var logFilename  = originalCheckData.id;
    _logs.append(logFilename,logString,function(err){
        if(!err){
            console.log('Logging success')
        }
        else{
            console.log('Logging Failed',err)
        }
    })
}

// Timer to execute theworker process 1 minute
workers.loop = function(){
    setInterval(function(){
        workers.getherAllChecks();
    },1000 *60)
}
// Rotar Compress Log Files 
workers.rotateLogs = function(){
    // List all the non compressed file
    _logs.list(false,function(err,logs){
        if(!err && logs && logs.length){
            logs.forEach(function(logName){
                // Commpress a data tyo different file
                var logId = logName.replace('.log','');
                var newFieldId = logId+'-'+Date.now();
                
                _logs.compress(logId,newFieldId,function(err){
                    if(!err){
                        //  truncate the log
                        _logs.truncate(logId,function(err){
                            if(!err){
                                console.log('Success truncate')
                            }
                            else{
                                console.log('Failed truncate')
                            }
                        })
                    }else{
                        console.log('error truncate file',err)
                    }
                })
            })
        }
        else{
            console.log('Error list file',err)
        }
    })
}

workers.logRotationLoop = function(){
    setInterval(function(){
        workers.rotateLogs();
    },1000*60*60*24)
}
workers.init = function(){

    console.log('\x1b[33m%s\x1b[0m','Background workers are running')
    // Execute all the check imediately
    workers.getherAllChecks();
    // call the loop    check for execute later on
    workers.loop();
    // Compress all the     log
    workers.rotateLogs();
    // Call the compression loop
    workers.logRotationLoop()
}


module.exports = workers