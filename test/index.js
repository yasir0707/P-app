// // Dependies 
// var helpers = require('./../lib/helpers');
// var assert = require('assert');

// _app= {};

// _app.tests = {
//     'unit':{}
// }
// _app.tests.unit['helper.getNumber should return a number'] = function(done){
//     var val = helpers.getNumber();
//     assert.equal(typeof(val),'number');
//     done();
// }
// _app.tests.unit['helper.getNumber should return   1'] = function(done){
//     var val = helpers.getNumber();
//     assert.equal(val,1);
//     done();
// }

// _app.tests.unit['helper.getNumber should return   2'] = function(done){
//     var val = helpers.getNumber();
//     assert.equal(val,2);
//     done();
// }

// // Count all the test
// _app.countTests = function(){
//     var counter =0 ;
//     for(var key in _app.tests){
//         if(_app.tests.hasOwnProperty(key)){
//             var subtest = _app.tests[key];
//             for(testName in subtest){                
//             if(subtest.hasOwnProperty(testName)){
//                 counter++;
//             }
//             }
//         }
//     };
//     return counter;
// }

// _app.runTests = function(){
//     var error  = [];
//     var successes = 0;
//     var limit = _app.countTests();
//     var counter = 0;
//     for(var key in _app.tests){
//         if(_app.tests.hasOwnProperty(key)){
//             var subtest = _app.tests[key];
//             for(var testName in subtest){
//                 if(subtest.hasOwnProperty(testName)){
//                     (function(){
//                         var tempTestName = testName;
//                         var testValue = subtest[testName] 
//                         // Call the best
//                         try{
//                             testValue(function(){
//                                 console.log('\x1b[33m%s\x1b[0m',tempTestName)
//                                 counter++;
//                                 successes++;
//                                 if(counter == limit){
//                                     _app.produceTestReporter(limit,successes,errors)
//                                 }
//                             })
//                         }
//                         catch(e){
//                             errors.push({
//                                 'name':testName,
//                                 'error':e
//                             })
//                             console.log('\x1b[31m%s\x1b[0m',tempTestName);
//                             counter++;
//                             if(counter == limit){   
//                                 _app.produceTestReporter(limit,successes,errors )
//                             }
//                         }
//                     })                }
//             }
//         }
//     }
// }
// _app.produceTestReporter = function(limit,successes,errors){
    
//     console.log("");
//     console.log("------------BEGIN TEST REPORT----------------");
//     console.log("");
//     console.log("Total Tests",limit);
//     console.log("Pass",successes);
//     console.log("Fail",errors.length);
    
//     if(errors.length > 0 ){
//         errors.forEach(function(testError){
            
//     console.log("------------BEGIN TEST ERROR----------------");
//             console.log('\x1b[32m%s\x1b[0m',testError.name)
//             console.log(testError.error)
//         console.log("------------END TEST ERROR----------------");    
//         })
//     }

// }
// _app.runTests();


/*
 * Test runner
 *
 */

// Dependencies
var helpers = require('./../lib/helpers.js');
var assert = require('assert');

process.env.NODE_ENV = 'testing';


// Application logic for the test runner
_app = {};

// Holder of all tests
_app.tests = {};

_app.tests.unit = require('./unit');
_app.tests.api = require('./api');

// Count all the tests
_app.countTests = function(){
  var counter = 0;
  for(var key in _app.tests){
     if(_app.tests.hasOwnProperty(key)){
       var subTests = _app.tests[key];
       for(var testName in subTests){
          if(subTests.hasOwnProperty(testName)){
            counter++;
          }
       }
     }
  }
  return counter;
};

// Run all the tests, collecting the errors and successes
_app.runTests = function(){
  var errors = [];
  var successes = 0;
  var limit = _app.countTests();
  var counter = 0;
  for(var key in _app.tests){
     if(_app.tests.hasOwnProperty(key)){
       var subTests = _app.tests[key];
       for(var testName in subTests){
          if(subTests.hasOwnProperty(testName)){
            (function(){
              var tmpTestName = testName;
              var testValue = subTests[testName];
              // Call the test
              try{
                testValue(function(){
                  // If it calls back without throwing, then it succeeded, so log it in green
                  console.log('\x1b[32m%s\x1b[0m',tmpTestName);
                  counter++;
                  successes++;
                  if(counter == limit){
                    _app.produceTestReport(limit,successes,errors);
                  }
                });
              } catch(e){
                // If it throws, then it failed, so capture the error thrown and log it in red
                errors.push({
                  'name' : testName,
                  'error' : e
                });
                console.log('\x1b[31m%s\x1b[0m',tmpTestName);
                counter++;
                if(counter == limit){
                  _app.produceTestReport(limit,successes,errors);
                }
              }
            })();
          }
       }
     }
  }
};

// Product a test outcome report
_app.produceTestReport = function(limit,successes,errors){
  console.log("");
  console.log("--------BEGIN TEST REPORT--------");
  console.log("");
  console.log("Total Tests: ",limit);
  console.log("Pass: ",successes);
  console.log("Fail: ",errors.length);
  console.log("");

  // If there are errors, print them in detail
  if(errors.length > 0){
    console.log("--------BEGIN ERROR DETAILS--------");
    console.log("");
    errors.forEach(function(testError){
      console.log('\x1b[31m%s\x1b[0m',testError.name);
      console.log(testError.error);
      console.log("");
    });
    console.log("");
    console.log("--------END ERROR DETAILS--------");
  }


  console.log("");
  console.log("--------END TEST REPORT--------");

};

// Run the tests
_app.runTests();