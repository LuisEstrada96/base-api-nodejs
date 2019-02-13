const config = require('../config/config');
const winston = require('winston');

winston.addColors({
	error : 'red',
	warn : 'yellow',
	info : 'green',
	verbose : 'blue',
	debug : 'cyan',
	silly : 'magenta'
});

const logger = winston.createLogger({
	level : 'silly',
	levels : { error : 0, warn : 1, info : 2, verbose : 3, debug : 4, silly : 5 },
	format: winston.format.combine(
		winston.format.colorize(),
    	winston.format.timestamp(),
		winston.format.splat(),
		winston.format.printf(({ timestamp, level, message, meta }) => {
			return `${timestamp} ${level} ${message} ${meta ? JSON.stringify(meta, null, 1) : ''}`;
		})
	),
	silent : false
});

if(config.log.console && config.log.console.level != ''){
	logger.add(new winston.transports.Console({
		level : config.log.console.level,
		silent : false
	}));
}

if(config.log.files){
	config.log.files.forEach(function(file){
		logger.add(new winston.transports.File({
			level : file.level,
			silent : false,
			filename : file.path + file.name,
			maxsize : 1000000,
			maxFiles : 1
		}));
	});
}

module.exports = logger;
