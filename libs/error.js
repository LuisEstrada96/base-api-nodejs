const status 	= require('../config/http-status');

const FORBIDDEN = 0x10;
const UNAUTHORIZED = 0x11;
const NO_DEVICE_TOKEN = 0x12;
const INVALID_PARAMS = 0x20;
const INVALID_INPUT = 0x21;
const DB_ERROR = 0x30;
const SERVICE_ERROR = 0xA0;
const CUSTOM_ERROR = 0xFF;

exports.auth = function(res){
	res.statusCode = status.FORBIDDEN;
	res.json(_error(FORBIDDEN, "Not authorized."));
};

exports.apiKey = function(res){
	res.statusCode = status.UNAUTHORIZED;
	res.json(_error(UNAUTHORIZED, "Bad authentication data."));
};

exports.deviceToken = function(res){
	res.statusCode = status.UNAUTHORIZED;
	res.json(_error(NO_DEVICE_TOKEN, "Bad device authentication data."));
};

exports.params = function(res) {
    res.statusCode = status.BAD_REQUEST;
    res.json(_error(INVALID_PARAMS, "Invalid params."));
}

exports.input = function(res, errors) {
	res.statusCode = status.UNPROCESSABLE;
    _input(res, errors);
}

exports.db = function(res, details){
	res.statusCode = status.UNPROCESSABLE;
    res.json(_error(DB_ERROR, "Error on database operation.", details));
};

exports.service = function(res, description, err){
	res.statusCode = status.UNPROCESSABLE;
	res.json(_error(SERVICE_ERROR, description, err));
}

exports.custom = function(res, description, err){
	res.statusCode = status.UNPROCESSABLE;
	res.json(_error(CUSTOM_ERROR, description, err));
}

function _error(code, message, details) {
    var error = { "error": { "code": code, "message": message } };
    if (details !== undefined)
        error.details = details;
    return error;
}

function _input(res, errors) {
    var messages = [];
    errors = errors || [];
    errors.forEach(function(error) {
        messages.push({
            code : error.code ? String(error.code) : null ,
            property : String(error.property),
            message : error.message.replace(/\"/gi, "'")
        });
    });
    res.json(_error(INVALID_INPUT, "Invalid Input", messages));
}
