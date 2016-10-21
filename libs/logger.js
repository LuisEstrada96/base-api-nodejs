var config 	= require('../config/config').values;
var winston = require('winston');

logger = new (winston.Logger)({
	levels : {
		error 	: 0,
		warn 	: 1,
		info 	: 2,
		verbose : 3,
		debug 	: 4,
		silly 	: 5
	},
	colors : {
		error 	: 'red',
		warn 	: 'yellow',
		info 	: 'green',
		verbose : 'blue',
		debug 	: 'cyan',
		silly 	: 'magenta'
	}
});

if(config.log.console_level != null && config.log.console_level != ''){
	logger.add(winston.transports.Console, {
		level 			: config.log.console_level,
		prettyPrint 	: true,
		colorize    	: true,
		silent      	: false,
		timestamp   	: false
	});
}

if(config.log.file != null && config.log.file != ''){
	logger.add(winston.transports.File, {
		prettyPrint 	: false,
		level       	: config.log.file_level,
		silent      	: false,
		colorize    	: false,
		timestamp   	: true,
		filename    	: './logs/' + config.log.file,
		maxsize     	: 1000000,
		maxFiles    	: 10,
		json        	: false
	});
}

exports.logger = logger;
