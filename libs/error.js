const status 	= require('../config/http-status');

const FORBIDDEN = 0x10;
const UNAUTHORIZED = 0x11;
const NO_DEVICE_TOKEN = 0x12;
const INVALID_PARAMS = 0x20;
const INVALID_INPUT = 0x21;
const ALREADY_EXISTS = 0x30;
const NOT_EXISTS = 0x31;
const SERVER_ERROR = 0xA0;
const REMOTE_ERROR = 0xA1;
const CUSTOM_ERROR = 0xFF;

exports.auth = function(){
	return _error(status.UNAUTHORIZED, FORBIDDEN, "Not authorized.");
}

exports.apiKey = function(){
	return _error(status.UNAUTHORIZED, UNAUTHORIZED, "Bad authentication data.");
}

exports.deviceToken = function(){
	return _error(status.UNAUTHORIZED, NO_DEVICE_TOKEN, "Bad device authentication data.");
}

exports.params = function() {
    return _error(status.UNPROCESSABLE, INVALID_PARAMS, "Invalid params.");
}

exports.input = function(, errors) {
	return _error(status.UNPROCESSABLE, INVALID_INPUT, "Invalid Input", _input(errors));
}

exports.alreadyExists = function() {
    return _error(status.BAD_REQUEST, ALREADY_EXISTS, "Entity already exists.");
}

exports.notExists = function() {
    return _error(status.BAD_REQUEST, NOT_EXISTS, "Entity doesn't exists.");
}

exports.remoteError = function(description, err){
	return _error(status.FAILED_DEPENDENCY, REMOTE_ERROR, description, err);
}

exports.unknown = function(description, err){
	return _error(status.UNKNOWN_ERROR, SERVER_ERROR, description, err);
}

exports.custom = function(description, err){
	return _error(status.UNPROCESSABLE, CUSTOM_ERROR, description, err);
}

function _error(status, code, message, details) {
    var error = { "error": { "status" : status, "code": code, "message": message } }
    if (details !== undefined)
        error.details = details;
    return error;
}

function _input(errors) {
    var messages = [];
    errors = errors || [];
    errors.forEach(function(error) {
        messages.push({
            code : error.code ? String(error.code) : null ,
            property : String(error.property),
            message : error.message.replace(/\"/gi, "'")
        });
    });
    return messages;
}
