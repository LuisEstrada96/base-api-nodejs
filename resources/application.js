const { logger } = require('../libs/logger');

const { execSync } = require('child_process');

const applicationRes = exports;
applicationRes.init = () => { return applicationRes };

applicationRes.status = async function(req, res) {
	logger.verbose("[application,status]", "service status");
	res.json({
		uptime : parseInt(process.uptime()),
		rev : await _gitinfo(),
		env : process.env.NODE_ENV
	});
}

applicationRes.logs = function(req, res){
	logger.verbose("[application,logs]", "testing logs levels");
	logger.silly('silly');
	logger.debug('debug');
	logger.verbose('verbose');
	logger.info('info');
	logger.warn('warn');
	logger.error('error');
	res.end();
}

applicationRes.simpleHeaders = function(req, res) {
	logger.verbose("[application,headers]", "testing if headers are complete");
	res.json(( req.header("apiKey") != null && req.header("apikey") != null ));
}

applicationRes.fullHeaders = function(req, res) {
    logger.verbose("[application,headers]", "Testing if headers are complete...");
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

function _gitinfo(){
	try {
		// FIXME if not a git repository, output is dumped into console, try to avoid it
		return parseInt(execSync("git rev-list --count HEAD").toString().trim());
	} catch(err){
		return "0";
	}
}
