
// Dependencies

var app = require('./../index');
var config = require('./../config');
var assert = require('assert')
var http = require('http');

// api
var api = {}
var helpers = {}

helpers.makegetRequest = function(path,callback){

    // Configure the request detail
    var requestDetail = {
        'protocol':'http',
        'hostname':'localhost',
        'method':'GET',
        'Port':config.httpPort,
        'path':path,
        headers:{
            content_Type:'application/json'
        }
    };
    // Send the request
    var req = http.request(requestDetail,function(res){
        callback(res);
    });
    req.end()
};

api['api.init should start'] = function(done){
    assert.doesNotThrow(function(){
        app.init(function(err){
            done();
        })
    },TypeError)
}

api['/ping should respond to Get 200'] = function(done){
    helpers.makegetRequest('/ping',function(res){
        assert.equal(res.statusCode,200)
     done();
    })
}

api['/api/users  should respond to get 400'] = function(done){
        helpers.makegetRequest('/api/users',function(res){
            assert.equal(res.statusCode,400)
            done()
        });
}
api['A random path should respond to GET with 404'],function(done){
    helpers.makegetRequest('/this/path/shouldnt/exist',function(res){
        assert.equal(res.statusCode,404);
        done();
    })
}

module.exports = api