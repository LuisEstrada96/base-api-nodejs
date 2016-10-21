var status 	= require('../config/status').codes;

var FORBIDDEN 		= 0x10;
var UNAUTHORIZED 	= 0x11;
var INVALID_PARAMS 	= 0x12;
var INVALID_INPUT 	= 0x13;
var DB_UPDATE		= 0x30;

function _error(code, message, details){
    var error = {
		"error": {
            "code": code,
			"message": message
		}
	};
    if(details !== undefined)
        error.details = details;
    return error;
}

exports.auth = function(res){
	res.statusCode = status.FORBIDDEN;
	res.json(_error(FORBIDDEN, "Not Authorized"));
}

exports.apiKey = function(res){
	res.statusCode = status.UNAUTHORIZED;
	res.json(_error(UNAUTHORIZED, "Bad Authentication data"));
}

exports.params = function(res){
	res.statusCode = status.BAD_REQUEST;
	res.json(_error(INVALID_PARAMS, "Invalid Params"));
}

exports.input = function(res, errors){
	res.statusCode = status.UNPROCESSABLE;
    var messages = [];
    errors.forEach(function(error){
        messages.push(error.message.replace(/\"/gi, "'"));
    });
	res.json(_error(INVALID_INPUT, "Invalid Input", messages));
}

exports.db = function(res, details){
	res.statusCode = status.UNPROCESSABLE;
	res.json(_error(DB_UPDATE, "Error on DB operation"));
}
