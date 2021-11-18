// var _data = require('./data')
// var helpers = require('./helpers') 

// // Define handlers
// var handlers = {};

// // sample handlers
// handlers.ping = function(data,callback){
//     callback(200)
// };
// // Not Found
// handlers.notFound = function(data,callback){
//     callback(404,{'Error':'Not Found'})
// }


// handlers.users = function(data,callback){
//     var acceptableMethod = ['post','get','put','delete']
//     if(acceptableMethod.indexOf(data.method)> -1){
//         handlers._users[data.method](data,callback);
//     }
//     else{
//         callback(405)
//     }
// }

// handlers._users = {};

// // User Post
// handlers._users.post = function(data,callback){
//     var firstname = typeof(data.payload.firstname) == 'string' && data.payload.firstname.trim().length > 0 ? data.payload.firstname.trim():false;
//     var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim():false;
//     console.log(firstname)
//     console.log(password)
//     if(firstname){
//         _data.read('users',firstname,function(err,data){
//             if(err){
//                   var hashPassword =  helpers.hash(password);
//                   if(hashPassword){
//                     var userObject = {
//                         'firstname' : firstname,
//                         'password': hashPassword
//                     }   
//                       _data.create('users',firstname,userObject,function(err){
//                           if(!err){
//                               callback(200)
//                           }else{
//                               callback(500,{'Error':'Could not create the user'})
//                           }
//                       })
//                   }
//                   else{
//                     callback(500,{'Error':'Could not hash password'})
                    
//                   }
                  
//             }
//             else{
                
//                 callback(400,{'Error':'Already Exit'})
//             }

//         })
//     }else{
//         callback(400,{'Error':'Missing required field'});
//     }
// }




// module.exports = handlers


/*
 * Request Handlers
 *
 */

// Dependencies
var _data = require('./data');
var helpers = require('./helpers');
var config = require('../config')
var _url = require('url');
var dns = require('dns') 
var _performance = require('perf_hooks').performance;
const { PerformanceObserver} = require('perf_hooks')
var util = require('util');
var debug = util.debuglog('performance')
// Define all the handlers
var handlers = {};

/*
 HTML Handler
*/ 

handlers.index = function(data,callback){
  if(data.method == 'get'){
    
    // Prepare data of interpolation
    var templateData ={
      'head.title':'This is the title',
      'head.description':'This is meta description',
      'body.title':'Hello template world',
      'body.class':'index'
    }
    helpers.getTemplate('index',templateData,function(err,str){
      if(!err && str){
        helpers.addUniversalTemplate(str,templateData,function(err,str){
          if(!err && str){
            callback(200,str,'html')
          }
          else{
            callback(500,undefined,'html')
          }
        })
      }
      else{
        callback(501,undefined,'html')
      }
    })
  }
  else{
    callback(405,undefined,'html')
  }
}

// AccountCreate

handlers.accountCreate = function(data,callback){
  if(data.method == 'get'){
    
    // Prepare data of interpolation
    var templateData ={
      'head.title':'Account Title',
      'head.description':'This is meta description',
      'body.title':'Hello template world',
      'body.class':'accountCreates'
    }
    helpers.getTemplate('accountCreate',templateData,function(err,str){
      if(!err && str){
        helpers.addUniversalTemplate(str,templateData,function(err,str){
          if(!err && str){
            callback(200,str,'html')
          }
          else{
            callback(500,undefined,'html')
          }
        })
      }
      else{
        callback(501,undefined,'html')
      }
    })
  }
  else{
    callback(405,undefined,'html')
  }
}

// SessionCreate

handlers.sessionCreate = function(data,callback){
  if(data.method == 'get'){
    
    // Prepare data of interpolation
    var templateData ={
      'head.title':'Login Account',
      'head.description':'This is meta description',
      'body.title':'Hello template world',
      'body.class':'sessionCreate'
    }
    helpers.getTemplate('sessionCreate',templateData,function(err,str){
      if(!err && str){
        helpers.addUniversalTemplate(str,templateData,function(err,str){
          if(!err && str){
            callback(200,str,'html')
          }
          else{
            callback(500,undefined,'html')
          }
        })
      }
      else{
        callback(501,undefined,'html')
      }
    })
  }
  else{
    callback(405,undefined,'html')
  }
}


// Session has been deleted
handlers.sessionDeleted = function(data,callback){
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Logged Out',
      'head.description' : 'You have been logged out of your account.',
      'body.class' : 'sessionDeleted'
    };
    // Read in a template as a string
    helpers.getTemplate('sessionDeleted',templateData,function(err,str){
      if(!err && str){
        // Add the universal header and footer
        helpers.addUniversalTemplates(str,templateData,function(err,str){
          if(!err && str){
            // Return that page as HTML
            callback(200,str,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(405,undefined,'html');
  }
};

// Edit Your Account
handlers.accountEdit = function(data,callback){
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Account Settings',
      'body.class' : 'accountEdit'
    };
    // Read in a template as a string
    helpers.getTemplate('accountEdit',templateData,function(err,str){
      if(!err && str){
        // Add the universal header and footer
        helpers.addUniversalTemplate(str,templateData,function(err,str){
          if(!err && str){
            // Return that page as HTML
            callback(200,str,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(405,undefined,'html');
  }
};

// favicon

handlers.favicon = function(data,callback){
    if(data.method == 'get'){
      helpers.getStaticAsset('favicon.ico',function(err,data){
        if(!err && data){
          callback(200,data,'favicon')
        }
        else{
          callback(500)
        }
      })
    }
    else{
      callback(405)
    }
}



// Favicon
// handlers.favicon = function(data,callback){
//   // Reject any request that isn't a GET
//   if(data.method == 'get'){
//     // Read in the favicon's data
//     helpers.getStaticAsset('favicon.ico',function(err,data){
//       if(!err && data){
//         // Callback the data
//         callback(200,data,'favicon');
//       } else {
//         callback(500);
//       }
//     });
//   } else {
//     callback(405);
//   }
// };

handlers.public = function(data,callback){
  if(data.method == 'get'){
    // var trimmedAssetName = data.trimmedPath.replace('public/','').trim();
    var trimmedAssetName = data.trimmedPath.replace('public/','').trim();
    if(trimmedAssetName.length >0){
      helpers.getStaticAsset(trimmedAssetName,function(err,data){
        if(!err && data){
          var contentType = 'plain';

          if(trimmedAssetName.indexOf('.css') > -1){
            contentType = 'css';
          }
          
          if(trimmedAssetName.indexOf('.png') > -1){
            contentType = 'png';
          }
          
          if(trimmedAssetName.indexOf('.jpg') > -1){
            contentType = 'jpg';
          }
          
          if(trimmedAssetName.indexOf('.ico') > -1){
            contentType = 'favicon';
          }
          callback(200,data,contentType);

        }
        else{
          callback(404)
        }
      })
    }
    else{
      callback(404)
    }
  }
  else{
    callback(405)
  }
}

// Error
handlers.exampleError = function(data,callback){
  var err = new Error('This is an example Error')
  throw err;
}
/*

Json Api Handler
*/

// Ping
handlers.ping = function(data,callback){
    callback(200);
};

// Not-Found
handlers.notFound = function(data,callback){
  callback(404,{'Error':'route not found'});
};

// Users
handlers.users = function(data,callback){
  var acceptableMethods = ['post','get','put','delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._users[data.method](data,callback);
  } else {
    callback(405);
  }
};

// Container for all the users methods
handlers._users  = {};

// Users - post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = function(data,callback){
  
  // Check that all required fields are filled out
  var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length >= 10 ? data.payload.phone.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;
   console.log(firstName,lastName,phone,password,tosAgreement) 
  if(firstName && lastName  && password && tosAgreement){
    // Make sure the user doesnt already exist
    _data.read('users',phone,function(err,data){
      if(err){
        // Hash the password
        var hashedPassword = helpers.hash(password);

        // Create the user object
        if(hashedPassword){
          var userObject = {
            'firstName' : firstName,
            'lastName' : lastName,
            'phone' : phone,
            'hashedPassword' : hashedPassword,
            'tosAgreement' : true
          };

          // Store the user
          _data.create('users',phone,userObject,function(err){
            if(!err){
              callback(200);
            } else {
              console.log("err",err);
              callback(500,{'Error' : 'Could not create the new user'});
            }
          });
        } else {
          callback(500,{'Error' : 'Could not hash the user\'s password.'});
        }

      } else {
        // User alread exists
        callback(400,{'Error' : 'A user with that phone number already exists'});
      }
    });

  } else {
    callback(400,{'Error' : 'Missing required fields'});
  }

};

handlers._users.get = function(data,callback){
    var phone = typeof(data.queryStringObject.phone)=='string' && data.queryStringObject.phone.trim().length >= 10? data.queryStringObject.phone.trim():false;
        if(phone){
          var token = typeof(data.headers.token) == 'string' ? data.headers.token : false
          handlers._tokens.verifyToken(token,phone,function(tokenIsValid){
              if(tokenIsValid){
                _data.read('users',phone,function(err,data){
                  if(!err && data){
                      delete data.hashedPassword;
                      callback(200,data)
                  }
                  else{
                      callback(404,{"Error":"Directory Error"})
                  }
              });
              }
              else{
                callback(403,{"Error" :"Missing required token field"})
              }
          })
        }
        else{
             callback(400,{'Error':'Missing required field'})   
        }
};

handlers._users.put= function(data,callback){
  var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length >= 10 ? data.payload.phone.trim() : false;
 
  // var firstName  = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName : false
  // var lastName  = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName : false
  // var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length >=10 ? data.payload.phone : false
console.log(firstName,lastName,phone)
  if(phone){

    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false
    handlers._tokens.verifyToken(token,phone,function(tokenIsValid){
        if(tokenIsValid){
          _data.read('users',phone,function(err,userData){
            if(!err && userData){
              if(firstName){
                userData.firstName = firstName
              }
              if(lastName){
                userData.lastName = lastName
              }
              _data.update('users',phone,userData,function(err){
                if(!err){
                  callback(200)
                }
                else{
                  console.log(err)
                  callback(500,{'Error':'Not Update Data'})
                }
              })
            }else{
              callback(400,{'Error':'User does not Exit'})
            }
          })
      
        }
        else{
            callback(403,{"Error":"Missing required in header"})
        }
      });


  }
  else{
    callback(400,{'Error':'Missing required field 3'})
  }
}

handlers._users.delete = function(data,callback){
  var phone = typeof(data.queryStringObject.phone)=='string' && data.queryStringObject.phone.trim().length >= 10? data.queryStringObject.phone.trim():false;
  if(phone){
      _data.read('users',phone,function(err,data){
          if(!err && data){
            _data.delete('users',phone,function(err){
              if(!err){
                callback(200)
              }
              else{
                callback(500,{'Error':'Could not delete the Specific user'})
              }
            })   
          }
          else{
              callback(404)
          }
      });
  }
  else{
       callback(400,{'Error':'Missing required field'})   
  }  
}


// Token
handlers.tokens = function(data,callback){
  var acceptableMethods = ['post','get','put','delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._tokens[data.method](data,callback);
  } else {
    callback(405);
  }
};

handlers._tokens = {}

handlers._tokens.post = function(data,callback){
  _performance.mark('Entered Function')
  var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length > 0 ? data.payload.phone.trim() : 0;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : 0
    _performance.mark('inputs validated')
    console.log(phone,password)
  if(phone && password){
 
    _performance.mark('beginning user lookup')
    
    _data.read('users',phone,function(err,userData){
      
    _performance.mark('User lookup complete')
      if(!err && userData){

        _performance.mark('beginning password hashing')
        var hashedPassword = helpers.hash(password);
        
        _performance.mark('password hashing complete')
        if(hashedPassword == userData.hashedPassword){

          _performance.mark('creating data for token')
          var tokenId = helpers.createRandomString(20)
          var expire = Date.now() + 1000 *60 *60;
          var tokenObject = {
            'phone':phone,
            'id':tokenId,
            'expire':expire
          }
          
        _performance.mark('beginning storing token')
          _data.create('tokens',tokenId,tokenObject,function(err){
    _performance.mark('storing token complete')


    _performance.measure('Beginning to end', 'entered function', 'storing token complete');
    _performance.measure('Validating user inputs', 'entered function', 'inputs validated');
    _performance.measure('User lookup', 'beginning user lookup', 'User lookup complete');
    _performance.measure('Password hashing', 'beginning password hashing', 'password hashing complete');
    _performance.measure('Token data creation','creating data for token', 'beginning storing token');
    _performance.measure('Token storing','beginning storing token', 'storing token complete');
       // Log out all the measurements
       
      //  const obs = new PerformanceObserver((items) => {

      //   var measurements = items.getEntriesByType('measure');
      //    measurements.forEach(function(measurement){
      //      debug('\x1b[33m%s\x1b[0m',measurement.name+' '+measurement.duration);
      //    });
      //  console.log(items.getEntriesByType('measure'))
        // items.getEntries().forEach((item) => {
        //     console.log('measure',item.name, + ' ' + item.duration)
        // })
    // })
    // obs.observe({entryTypes: ['measure']})
      //  var measurements = _performance.getEntriesByType('measure');
      //  measurements.forEach(function(measurement){
      //    debug('\x1b[33m%s\x1b[0m',measurement.name+' '+measurement.duration);
      //  });
            if(!err){

              callback(200,tokenObject)
            }
            else{
              callback(500,{'Error':'Not create Token'})
            }
          })
        }
      }else{
        callback(400,{'Error':'Could not find User'})
      }
    })

  }
  else{
    callback(400,{'Error':'Missing required Field'})
  }

}

handlers._tokens.get = function(data,callback){
  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length > 0 ?data.queryStringObject.id.trim() : false

  if(id){
    _data.read('tokens',id,function(err,tokenData){
      if(!err && tokenData){
        delete data.hashedPassword;
        callback(200,tokenData)
      }
      else{
        callback(404)
      }
    })
  }
  else{
    callback(400,{"Error":"Missing required field"})
  }
}

handlers._tokens.put = function(data,callback){
  var id = typeof(data.payload.id) =='string' && data.payload.id.trim().length > 0 ? data.payload.id.trim() : false
  // var extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true:false
  var extend = true
  console.log(id,extend)
  if(id && extend){
    
  _data.read('tokens',id,function(err,tokenData){
    if(!err && tokenData){
      if(tokenData.expire < Date.now()){
        tokenData.expire = Date.now() + 1000 * 60 * 60;
        _data.update('tokens',id,tokenData,function(err){
          if(!err){
            callback(200)
          }
          else{
            callback(500,{"Error":"Not Update"})
          }
        })
      }
      else{
        callback(400,{"Error":"Token ALready Expired"})
      }
    }
    else{
      callback(400,{"Error":"User not Exit"})
    }
})
  }else{
    callback(400,{"Error":"Misssing required field 1"})
  }
  
}


handlers._tokens.delete = function(data,callback){

  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.trim().length > 0 ?data.queryStringObject.id.trim() : false
  if(id){
    _data.read('tokens',id,function(err,data){
      if(!err && data){
        _data.delete('tokens',id,function(err){
          if(!err){
            callback(200)
          }
          else{
            callback(500,{"Error":"Not delete token"})
          }
        })
      }else{
        callback(400,{"Error":"token not found"})
      }
    })
  } 
  else{
    callback(400,{"Error":"Missing required field"})
  }

}

handlers._tokens.verifyToken = function(id,phone,callback){
  _data.read('tokens',id,function(err,data){
    if(!err && data){
      if(data.phone == phone && data.expire > Date.now()){
        callback(true)
      }
      else{
        callback(false)
      }
    }else{
      callback(false)
    }
  })
}

// Checks
handlers.checks = function(data,callback){
  var acceptableMethods = ['post','get','put','delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._checks[data.method](data,callback);
  } else {
    callback(405);
  }
}
 handlers._checks = {}

handlers._checks.post = function(data,callback){

  var protocol = typeof(data.payload.protocol) == 'string' && ['http','https'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
  var url = typeof(data.payload.url) =='string' && data.payload.url.trim().length > 0 ?data.payload.url.trim(): false;
  var method = typeof(data.payload.method) == 'string' && ['post','get','delete','put'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
  var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes :false;
  var timeOutSecond = typeof(data.payload.timeOutSecond) == 'number' && data.payload.timeOutSecond % 1 === 0 && data.payload.timeOutSecond >=1 && data.payload.timeOutSecond <=5 ?data.payload.timeOutSecond : false;
  console.log(protocol,url,method,successCodes,timeOutSecond)
  if(protocol && url  && successCodes && timeOutSecond){
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false ;
    
    _data.read('tokens',token,function(err,tokenData){
      if(!err && token){
        var userPhone = tokenData.phone;
        _data.read('users',userPhone,function(err,userData){
          if(!err && userData){
            var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks :[];
            // Verfiy Maximum Check
            console.log(userChecks.length,config.maxChecks)
            if(userChecks.length < config.maxChecks){

              var passedUrl  = _url.parse(protocol+'://'+url,true);
              var hostnName = typeof(passedUrl.hostname) == 'string' && passedUrl.hostname.length > 0 ? passedUrl.hostname : false;
              dns.resolve(hostnName,function(err,records){
                if(!err && records){
                  // Create random id  for the check
                var checkId  = helpers.createRandomString(20);
                var checkObjects  = {
                  'id':checkId,
                  'userPhone':userPhone,
                  'protocol':protocol,
                  'url':url,
                  'method':method,
                  'successCode':successCodes,
                  'timeOutSeconds':timeOutSecond
                };
                _data.create('checks',checkId,checkObjects,function(err){
                  if(!err){
                      userData.checks = userChecks;
                      userData.checks.push(checkId)

                      // Save the new user data
                      _data.update('users',userPhone,userData,function(err){
                        if(!err){
                          // Return the data about new check
                          callback(200,checkObjects)
                        }
                        else{
                          callback(500,{'Error':'could not update new user Check'})
                        }
                      })
                  }
                  else{
                    callback(403,{"Error":"check error"})
                  }
                })
                }
                else{
                  callback(400,{'Error ': 'hostname did not ressolve to any DNS entries'})
                }
              })
                
            }
            else{
              callback(400,{'Error':'Already maximum check('+config.maxChecks+')'})
            }
          }
          else{
            callback(403,{"Error":"user error"})
          }
        })
      }
      else{
        callback(403,{"Error":"token error"})
      }
    })
  }
  else{
    callback(400,{'Error':"Missing required fieldsss Check"})
  }  

}

// check get

handlers._checks.get = function(data,callback){
  var id = typeof(data.queryStringObject.id)=='string' && data.queryStringObject.id.trim().length >= 10? data.queryStringObject.id.trim():false;
      if(id){
        // lookup the checks
        _data.read('checks',id,function(err,checkData){
         if(!err && checkData){
          var token = typeof(data.headers.token) == 'string' ? data.headers.token : false
          console.log(token,checkData.userPhone);
          handlers._tokens.verifyToken(token,checkData.userPhone,function(tokenIsValid){
            console.log(tokenIsValid)
            if(!tokenIsValid){
              callback(200,checkData)
            }
            else{
              callback(403,{"Error" :"Missing required token field1"})
            }
        })
      }
      else{
        callback(403,{"Error":"Check Error"})
      }
        })
        
      }
      else{
           callback(400,{'Error':'Missing required field'})   
      }
};


// Checks - put
// Required data: id
// Optional data: protocol,url,method,successCodes,timeoutSeconds (one must be sent)
handlers._checks.put = function(data,callback){
  // Check for required field
  var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;

  // Check for optional fields
  var protocol = typeof(data.payload.protocol) == 'string' && ['https','http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
  var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
  var method = typeof(data.payload.method) == 'string' && ['post','get','put','delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
  var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
  var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

  // Error if id is invalid
  if(id){
    // Error if nothing is sent to update
    if(protocol || url || method || successCodes || timeoutSeconds){
      // Lookup the check
      _data.read('checks',id,function(err,checkData){
        if(!err && checkData){
          // Get the token that sent the request
          var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
          // Verify that the given token is valid and belongs to the user who created the check
          handlers._tokens.verifyToken(token,checkData.userPhone,function(tokenIsValid){
            if(tokenIsValid){
              // Update check data where necessary
              if(protocol){
                checkData.protocol = protocol;
              }
              if(url){
                checkData.url = url;
              }
              if(method){
                checkData.method = method;
              }
              if(successCodes){
                checkData.successCodes = successCodes;
              }
              if(timeoutSeconds){
                checkData.timeoutSeconds = timeoutSeconds;
              }

              // Store the new updates
              _data.update('checks',id,checkData,function(err){
                if(!err){
                  callback(200);
                } else {
                  callback(500,{'Error' : 'Could not update the check.'});
                }
              });
            } else {
              callback(403);
            }
          });
        } else {
          callback(400,{'Error' : 'Check ID did not exist.'});
        }
      });
    } else {
      callback(400,{'Error' : 'Missing fields to update.'});
    }
  } else {
    callback(400,{'Error' : 'Missing required field.'});
  }
};


// Checks - delete
// Required data: id
// Optional data: none
handlers._checks.delete = function(data,callback){
  // Check that id is valid
  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if(id){
    // Lookup the check
    _data.read('checks',id,function(err,checkData){
      if(!err && checkData){
        // Get the token that sent the request
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        // Verify that the given token is valid and belongs to the user who created the check
        handlers._tokens.verifyToken(token,checkData.userPhone,function(tokenIsValid){
          if(tokenIsValid){

            // Delete the check data
            _data.delete('checks',id,function(err){
              if(!err){
                // Lookup the user's object to get all their checks
                _data.read('users',checkData.userPhone,function(err,userData){
                  if(!err){
                    var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];

                    // Remove the deleted check from their list of checks
                    var checkPosition = userChecks.indexOf(id);
                    if(checkPosition > -1){
                      userChecks.splice(checkPosition,1);
                      // Re-save the user's data
                      userData.checks = userChecks;
                      _data.update('users',checkData.userPhone,userData,function(err){
                        if(!err){
                          callback(200);
                        } else {
                          callback(500,{'Error' : 'Could not update the user.'});
                        }
                      });
                    } else {
                      callback(500,{"Error" : "Could not find the check on the user's object, so could not remove it."});
                    }
                  } else {
                    callback(500,{"Error" : "Could not find the user who created the check, so could not remove the check from the list of checks on their user object."});
                  }
                });
              } else {
                callback(500,{"Error" : "Could not delete the check data."})
              }
            });
          } else {
            callback(403);
          }
        });
      } else {
        callback(400,{"Error" : "The check ID specified could not be found"});
      }
    });
  } else {
    callback(400,{"Error" : "Missing valid id"});
  }
};

module.exports = handlers
