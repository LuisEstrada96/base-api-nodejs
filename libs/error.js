const STATUS = {
	OK : 200,
	CREATED : 201,
	ACCEPTED : 202,
	DELETED : 204,
	NOT_MODIFIED : 304,
	BAD_REQUEST : 400,
	UNAUTHORIZED : 401,
	FORBIDDEN : 403,
	NOT_FOUND : 404,
	UNPROCESSABLE : 422,
	FAILED_DEPENDENCY : 424,
	SESSION_EXPIRED : 480,
	SERVER_ERROR : 500,
	UNKNOWN_ERROR : 520
}
const CODES = {
	FORBIDDEN : 0x10,
	UNAUTHORIZED : 0x11,
	DEVICE_TOKEN : 0x12,
	INVALID_PARAMS : 0x20,
	INVALID_INPUT : 0x21,
	ALREADY_EXISTS : 0x30,
	NOT_EXISTS : 0x31,
	SERVER_ERROR : 0xA0,
	REMOTE_ERROR : 0xA1,
	CUSTOM_ERROR : 0xFF
}


/**
* Base error for aplication
**/

class AppError extends Error {
	constructor(message, code, status, details){
		super(message)
		this.name = this.constructor.name
		Error.captureStackTrace(this, this.constructor)
		this.status = status || 500;
		this.response = _error({ message, status, code, details })
	}
}

AppError.prototype.toString = function(){
	return this.name + " : " + this.message + " @ " + this.stack.split("at ")[1].trim();
}

/**
* Used when a user is trying to access a protected method without credentials
**/

class AuthError extends AppError{
	constructor(){
		super("not authorized", CODES.FORBIDDEN, STATUS.UNAUTHORIZED, "you shall not pass")
	}
}

/**
* Used when a user is trying to access a protected method but the used credentials
* are not authorized.
**/

class CredentialsError extends AppError{
	constructor(){
		super("bad credentials", CODES.UNAUTHORIZED, STATUS.UNAUTHORIZED)
	}
}

/**
* Used when a user is trying to access a protected method but the used credentials
* have expired.
**/

class SessionError extends AppError{
	constructor(){
		super("session expired", CODES.SESSION_EXPIRED, STATUS.UNAUTHORIZED)
	}
}

/**
* Used when a mobile app user is using an invalid device token.
**/

class DeviceTokenError extends AppError{
	constructor(){
		super("bad authentication data", CODES.DEVICE_TOKEN, STATUS.UNAUTHORIZED)
	}
}

/**
* Used when a service consumer (web or mobile application) is using wrong or
* incomplete parameters for the method
**/

class ParamsError extends AppError{
	constructor(){
		super("invalid params", CODES.INVALID_PARAMS, STATUS.UNPROCESSABLE)
	}
}

/**
* Used when the user inputted data is not valid or doesn't match with the
* validation schema
**/

class InputError extends AppError{
	constructor(details){
		super("invalid input", CODES.INVALID_INPUT, STATUS.UNPROCESSABLE, details)
	}
}

/**
* Used when we recieved an error from an external application or service
**/

class RemoteError extends AppError{
	constructor(message, returnedError){
		super(message || 'remote service error', CODES.REMOTE_ERROR, STATUS.FAILED_DEPENDENCY, returnedError)
	}
}

/**
* Used when we get an error on a database operation
**/

class DatabaseError extends AppError{
	constructor(returnedError){
		super('database error', CODES.SERVER_ERROR, STATUS.SERVER_ERROR, returnedError)
	}
}

/**
* Database type error, used when trying to create an entity that already exists
**/

class EntityExistsError extends AppError{
	constructor(){
		super("entity already exists", CODES.ALREADY_EXISTS, STATUS.BAD_REQUEST)
	}
}

/**
* Database type error, used when trying access an entitry that doesn't exists
**/

class EntityNotExistsError extends AppError{
	constructor(){
		super("entity doesn't exists", CODES.NOT_EXISTS, STATUS.BAD_REQUEST)
	}
}

/**
* Used when we get an unexpected or unknown error
**/

class UnknownError extends AppError{
	constructor(message, returnedError){
		super(message || 'application error', CODES.SERVER_ERROR, STATUS.UNKNOWN_ERROR, returnedError)
	}
}

/**
* Used when we have a custom message for the consumer application
**/

class CustomError extends AppError{
	constructor(message, details){
		super(message, CODES.CUSTOM_ERROR, STATUS.UNPROCESSABLE, details)
	}
}

function _error({ message, status, code, details }) {
    let error = { "error": { "status" : status, "code": code, "message": message } }
    if (details !== undefined)
        error.details = details;
    return error;
}

module.exports = {
	AuthError, // protected method, no credentials
	CredentialsError, // protected method, bad credentials
	SessionError, // protected method, expired credentials
	DeviceTokenError, // protected methods, unregistered device
	ParamsError, // wrong or incomplete params to process
	InputError, // invalid or incomplete user input
	RemoteError, // third party service error
	DatabaseError, // database error
	EntityExistsError, // entity already exists
	EntityNotExistsError, // entity doen't exists
	UnknownError, // unknown of undefined error
	CustomError // custom user message
}
