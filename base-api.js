#!/bin/env node
const config 		= require('./config/config');
const logger 		= require('./libs/logger');
const mongodb 		= require('./libs/mongo');
const bodyParser 	= require('body-parser');
const express 		= require('express');
const morgan 		= require('morgan');

const app = express();
const router = express.Router();

(async function() {
	const db = await mongodb.connect();

	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.set('port', config.port || 8080);
	app.use(morgan('combined'));

	router.use(function(req, res, next){
		logger.verbose('>>>', req.method, req._parsedUrl.pathname);
		logger.debug('>>', req.query, req.body);
		next();
	});

	const test = require('./resources/test').init(db);

	router.get('/', test.status);
	router.get('/test', test.log);

	app.use('/', router);

	app.listen(app.get('port'), function(){
		logger.info('listening on port: ', app.get('port'), '...');
	});
})()
.catch((e)=> {
	if ("stack" in e) logger.error(e.stack);
	logger.error(e);
});
