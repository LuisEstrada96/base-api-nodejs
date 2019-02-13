const config 	= require('../config/config');
const status 	= require('../config/http-status');
const {logger}	= require('../libs/logger');

const test = exports;

test.init = function(){
	return test;
};

test.status = function(req, res) {
	logger.verbose('status');
	res.json({ status: status.OK });
}

test.log = function(req, res){
	logger.silly('silly');
	logger.debug('debug');
	logger.verbose('verbose');
	logger.info('info');
	logger.warn('warn');
	logger.error('error');
	res.json({ status: status.OK });
}
