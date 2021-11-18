var crypto = require('crypto');
var config = require('../config')
var fs = require('fs');
var path = require('path')
var helpers = {}

helpers.getNumber =  function(){
    return 1;
}

// Hash
helpers.hash = function(str){
    if(typeof(str) == 'string' && str.length >0){
        var hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
        return hash;
    }
    else{
        return false;
    }
}

// Parse a json String 
helpers.parseJsonToObject = function(str){
    try{
        var obj = JSON.parse(str)
        return obj;
    }
    catch(e){
        return {};
    }
}
helpers.createRandomString = function(strLength){
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
    if(strLength){
        var possibleChar = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var str = ''
        for(i =1; i<=strLength;i++ ){
            var randomChar = possibleChar.charAt(Math.floor(Math.random() *possibleChar.length))
            str += randomChar;
        }
        return str;
    }
    else{
        return false
    }
}


helpers.getTemplate = function(templateName,data,callback){
    templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName :false;
    data = typeof(data)  == 'object' && data != null ? data:{};
  
    if(templateName){
        var templateDir = path.join(__dirname,'/../templates/');
        fs.readFile(templateDir+templateName+'.html','utf-8',function(err,str){
            if(!err && str && str.length > 0){
                var finalString = helpers.interpolate(str,data)
                callback(false,finalString)
            }
            else{
                callback('no template will be found')
            }
        })
    }
    else{
        callback('Error: valid template name')
    }   
}

// Add Universal Header and Footer
helpers.addUniversalTemplate  = function(str,data,callback){
    str = typeof(str) == 'string' && str.length > 0 ?str : '';
    data =  typeof(data) == 'object' && data != null ? data : {};

    // Get the Header
    helpers.getTemplate('_header',data,function(err,headerString){
        if(!err && headerString){
            // Get the Footer
            helpers.getTemplate('_footer',data,function(err,footerString){
                if(!err && footerString){
                    var fullString = headerString+str+footerString;
                    callback(false,fullString);
                }
                else{
                    console.log('could not the found the header');
                }
            })
        }
        else{
            console.log('could not found the header');
        }
    })
} 

helpers.interpolate = function(str,data){
        str = typeof(str) && str.length > 0 ? str : '';
        data = typeof(data)  == 'object' && data != null ? data:{};
        
        for(var keyName in config.templateGlobals){
            if(config.templateGlobals.hasOwnProperty(keyName)){
                data['global.'+keyName] = config.templateGlobals[keyName];
            }
        }
        for(var key in data){
            if(data.hasOwnProperty(key) && typeof(data[key]) == 'string'){
                var replace =  data[key];
                var find = '{'+key+'}';
                str = str.replace(find,replace)
            }
        }
        return str;
}


helpers.getStaticAsset = function(fileName,callback){
    fileName = typeof(fileName) == 'string' && fileName.length > 0 ? fileName :false;
    if(fileName){
        var publicDir = path.join(__dirname,'/../public/');
        fs.readFile(publicDir+fileName,function(err,data){
            if(!err && data){
                callback(false,data)
            
            }
            else{
                callback('No file found')
            }
        })
    }
    else{
        callback('file name not specified')
    }
}
module.exports = helpers;

