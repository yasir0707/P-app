
// Dependencies

var fs = require('fs')
var path = require('path');
var zlib = require('zlib')
var lib ={}

// Base directory of the data folder
lib.baseDir = path.join(__dirname,'../.logs/')

// Append a string to file
lib.append = function(file,str,callback){
    fs.open(lib.baseDir+file+'.log','a',function(err,fileDescriptor){
        if(!err && fileDescriptor){
            fs.appendFile(fileDescriptor,str+'\n',function(err){
                if(!err){
                    fs.close(fileDescriptor,function(err){
                        if(!err){
                            callback(false)
                        }
                        else{
                            callback('Error clossing log file')
                        }
                    })
                }
                else{
                    callback('Error appending File')
                }
            })
        }
        else{
            callback('Error openning file')
        }
    })
}


lib.list = function(includeCompressedLog,callback){
    fs.readdir(this.baseDir,function(err,data){
        if(!err,data,data.length > -1){
       
        var trimmedFilename = [];
        data.forEach(function(fileName){
            // Add the Data .log file
            if(fileName.indexOf('.log')> -1){
                trimmedFilename.push(fileName.replace('.log',''));
            }
            // Addthe data .gz  files
            if(fileName.indexOf('.gz.64')>-1){
                trimmedFilename.push(fileName.replace('.gz.64',''));
            }
        })
        callback(false,trimmedFilename)      
    }
            else{
                callback(err,data)
            }

    })
}

lib.compress = function(logId,newFileId,callback){

    var sourceFile = logId+'.log';
    var destFile = newFileId+'.gz.64';

    // Read the source file
    fs.readFile(lib.baseDir+sourceFile,'utf-8',function(err,inputString){
        if(!err && inputString){
            // compress the data using gzip
            zlib.gzip(inputString,function(err,buffer){
                if(!err && buffer){
                    // Send the data to destination file
                    fs.open(lib.baseDir+destFile,'wx',function(err,fileDescriptor){
                        fs.writeFile(fileDescriptor,buffer.toString('base64'),function(err){
                            if(!err){
                                fs.close(fileDescriptor,function(err){
                                    if(!err){
                                        callback(false)
                                    }
                                    else{
                                        callback('error')
                                    }
                                })
                            }
                            else{
                                callback(err)
                            }
                        })
                    })
                }
                else{
                    callback('Error Compress File',err)
                }
            })
        }
        else{
            callback('Errror Readd File',err)
        }
    })
}

lib.decompres = function(fileId,callback){
    var fileName = fileId+'gz.64';
    fs.readFile(lib.readFile+fileName,'utf-8',function(err,str){
        if(!err && str){
            // Decompose the data
            var inputBuffer = Buffer.from(str,'base64')
            zlib.unzip(inputBuffer,function(err,outputBuffer){
                if(!err && outputBuffer){
                    var str = outputBuffer.toString();
                    callback(false,str)
                }
                else{
                    callback('Error UnZip',err)
                }
            })
        }else{
            callback('Errorr read File1',err)
        }
    })
}

// truncate a log file
lib.truncate = function(logId,callback){
    fs.truncate(lib.baseDir+logId+'.log',0,function(err){
        if(!err){
            callback(false)
        }
        else{
            callback('truncate error',err)
        }
    })
}
module.exports = lib