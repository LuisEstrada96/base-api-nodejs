module.exports = {
    debug : true,
	port : 8080,
	log : {
		console : { level : 'silly' },
		files : [
			{
				id : 'debug',
				level : 'debug',
				path : './logs/',
				name : 'debug.log'
			},
			{
				id : 'error',
				level : 'error',
				path : './logs/',
				name : 'error.log'
			}
		],
		morgan : { inmediate : true }
	}
}
