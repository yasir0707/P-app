// Library files for storing and editing data

// Dependies
var fs = require('fs');
var path = require('path');
var helpers = require('./helpers')
// container to the module 
var lib = {}

// Base directory of the data folder
lib.baseDir = path.join(__dirname,'../.data/')

// Write data to file
lib.create = function(dir,file,data,callback){
    // Open file for writinf
    fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
        if(!err && fileDescriptor){
            var stringData = JSON.stringify(data);

            // Write to file and Close it
            fs.writeFile(fileDescriptor,stringData,function(err){
                if(!err){
                    fs.close(fileDescriptor,function(err){
                        if(!err){
                            callback(false)
                        }else{
                            console.log('Error Clossing new File')
                        }
                    })
                }else{
                    console.log('Error Writing to new File')
                }
            })
        }
        else{
            callback('It Already Exit')
        }
    })
}

// Read data from File
lib.read = function(dir,file,callback){
    fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf-8',function(err,data){
        if(!err && data){
            var parsedData = helpers.parseJsonToObject(data);
            callback(false,parsedData)
        }
        else{
        callback(err,data)
        }
    })
}
// Update data from file
lib.update = function(dir,file,data,callback){
    fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err,fileDiscriptor){
        if(!err && fileDiscriptor){
            var stringData = JSON.stringify(data);
            fs.truncate(fileDiscriptor,function(err){
                if(!err){
                    fs.writeFile(fileDiscriptor,stringData,function(err){
                        if(!err){
                            fs.close(fileDiscriptor,function(err){
                                if(!err){
                                    callback(false)
                                }
                                else{
                                    callback('Error Clossing file')
                                }
                            })
                        }
                        else{
                            console.log('Error Writing to Exiting File')
                        }
                    })
                }
                else{
                    console.log('Erro Truncating File')
                }
            })
        }
        else{
            console.log('Not open file')
        }
    })
}

// Delete file
lib.delete = function(dir,file,callback){
    fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err){
        if(!err){
            callback(false)
        }
        else{
            callback('Error deleting File   ')
        }
    })
}

// List all the item in directory
lib.list = function(dir,callback){
    fs.readdir(lib.baseDir+dir+'/',function(err,data){
        if(!err &&data&& data.length > 0){
            var trimmedFileName = [];
            data.forEach(function(filename){
                trimmedFileName.push(filename.replace('.json',''));
            })
            callback(false,trimmedFileName)
        }else{
            callback(err,data)
        }
    })
}

// Export the module
module.exports = lib