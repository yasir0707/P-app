var helpers = require('./../lib/helpers.js');
var assert = require('assert');
var logs = require('./../lib/logs');
var exampleDebuggingProblem = require('./../lib/exampleDebuggingProblem');

var unit = {};

// Assert that the getANumber function is returning a number
unit['helpers.getANumber should return a number'] = function(done){
    var val = helpers.getNumber();
    assert.equal(typeof(val), 'number');
    done();
  };
  
  
  // Assert that the getANumber function is returning 1
unit['helpers.getANumber should return 1'] = function(done){
    var val = helpers.getNumber();
    assert.equal(val, 1);
    done();
  };
  
  // Assert that the getANumber function is returning 2
unit['helpers.getNumberOne should return 2'] = function(done){
    var val = helpers.getNumber();
    assert.equal(val, 2);
    done();
  };
  

  unit['logs.list callback a fasle error an array of log names'] = function(done){
      logs.list(true,function(lof,filenames){
          logs.list(true,function(err,logFileNames){
            assert.equal(err,false);
            assert.ok(logFileNames instanceof Array)
            assert.ok(logFileNames.length > 1)
            done();
          })
      })
  }
unit['logs.truncate if log does not exit'] = function(done){
    assert.doesNotThrow(function(){
        logs.truncate('I do not exit',function(err){
            assert.ok(err);
            done();
        })
    },TypeError)
}

unit['exampledebuggingProblem.init should not throw'] = function(done){
    assert.doesNotThrow(function(){
        exampleDebuggingProblem.init()
        done()
    },TypeError)
};



module.exports = unit