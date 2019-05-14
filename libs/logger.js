const config = require('../config/config');
const { createLogger, format, transports, addColors } = require('winston');
const { combine, timestamp, colorize, printf, padLevels } = format;
const { SPLAT } = require('triple-beam');
const { isObject } = require('lodash');

const all = format((info) => {
	const splat = info[SPLAT] || [];
	const message = formatObject(info.message);
	const rest = splat.map(formatObject).join(' ');
	info.message = `${message} ${rest}`;
	return info;
});

function formatObject(param) {
	if (isObject(param)) return JSON.stringify(param);
	return param;
}

addColors({
	error : 'red',
	warn : 'yellow',
	info : 'green',
	verbose : 'blue',
	debug : 'cyan',
	silly : 'magenta'
});

const logger = createLogger({
	level : 'silly',
	levels : { error : 0, warn : 1, info : 2, verbose : 3, debug : 4, silly : 5 },
	format: combine(
		all(),
		timestamp(),
		colorize(),
		padLevels(),
		printf(({ timestamp, level, message }) => {
			return `${timestamp} ${level} ${formatObject(message)}`;
		})
	),
	silent : false
});

if(config.log.console && config.log.console.level != ''){
	logger.add(new transports.Console({
		level : config.log.console.level,
		silent : false
	}));
}

if(config.log.files){
	config.log.files.forEach(function(file){
		logger.add(new transports.File({
			level : file.level,
			silent : false,
			filename : file.path + file.name,
			maxsize : 1000000,
			maxFiles : 1
		}));
	});
}

module.exports = logger;
