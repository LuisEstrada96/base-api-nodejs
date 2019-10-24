const status 	= require('../config/http-status');
const logger	= require('../libs/logger');

const test = exports;

test.init = function(){
	return test;
};

test.status = function(req, res) {
	logger.verbose("[test,status]", "Checking API Status...");
  res.json({
		status : status.OK,
		uptime : process.uptime()
	});
}

test.log = function(req, res){
  logger.verbose("[test,log]", "Testing logs levels...");
	logger.silly('silly');
	logger.debug('debug');
	logger.verbose('verbose');
	logger.info('info');
	logger.warn('warn');
	logger.error('error');
	res.json(true);
}

test.headers = function(req, res) {
	logger.verbose("[test,headers]", "Testing if headers are complete...");
	res.json(
		(
			req.header("apiKey") != null &&
			(req.header("platform") == 'android' || req.header("platform") == 'ios') &&
			req.header("app") != null &&
			req.header("version") != null &&
			req.header("versionString") != null &&
			req.header("deviceToken") != null &&
			(req.header("language") == "en" || req.header("language") == "es") &&
			req.header("token") != null
		)
	);
}
