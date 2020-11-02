const config = require('config').get('auth');

const _e = require('../libs/errors');
const { logger } = require('../libs/logger');

const jsonwebtoken 	= require('jsonwebtoken');
const moment = require('moment');

const APIKEY 			= config.apiKey;
const JWT_SECRET 		= config.jwt.secret;
const JWT_EXPIRES   	= config.jwt.expiresIn || '1h';
const JWT_ISSUER   		= config.jwt.iss || null;
const JWT_AUDIENCE 		= config.jwt.audience || null;
const JWT_SUBJECT 		= config.jwt.subject || null;

const JWT_VERIFY_OPT = {
	complete : true,
	ignoreExpiration : false,
	audience : JWT_AUDIENCE,
	issuer : JWT_ISSUER,
	subject : JWT_SUBJECT,
};
const JWT_SIGN_OPT = {
	expiresIn : JWT_EXPIRES,
	audience : JWT_AUDIENCE,
	issuer : JWT_ISSUER,
	subject : JWT_SUBJECT
};

const authRes = module.exports;
authRes.init = () => { return authRes; }

/**
* Verifies that the apikey is valid
**/

authRes.apiKey = function(req, res, next){
	logger.verbose('[auth,apiKey]', 'validating apikey');
	let apiKey = req.headers.apiKey || req.headers.apikey || null;
	if(apiKey == null || apiKey == APIKEY) throw new _e.AuthError();
	next();
}

/**
* Verifies that JWT is valid and not expired
* must be called after verifyJWT
**/

authRes.verifyJWT = function(req, res, next){
	logger.verbose('[auth,verifyJWT]', 'verifying jwt');
	let jwt = req.header('token') || null;
	if(jwt == null) throw new _e.AuthError();
	jsonwebtoken.verify(jwt, JWT_SECRET, JWT_VERIFY_OPT, (err, decoded) => {
		if (err) {
			if((err || {}).name == 'TokenExpiredError')
				throw new _e.SessionError();
			logger.warn('[auth,verifyJWT]', 'invalid jwt: ', err.toString())
			throw new _e.CredentialsError();
		}
		req.decoded = decoded.payload;
		next();
	});
};

/**
* Used by vuex after login method to obtain user data
* must be called after verifyJWT
**/

authRes.me = function(req, res){
	logger.verbose('[auth,me]', 'getting user details');
	res.json(req.decoded);
}

/**
* for use in auth login method
*/

function _getSignedJWT(publicClaims){
	return jsonwebtoken.sign( publicClaims, JWT_SECRET, JWT_SIGN_OPT );
}
