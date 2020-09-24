#!/bin/env node
const config = require('config');

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

const { logger } = require('./libs/logger');
const mongo = require('./libs/mongo');

const APPLICATION_PORT = config.application.port;

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan(':date[iso]\x1b[34m verbose \x1b[39m <<< :method :url :status - :response-time ms'));

app.set('port', APPLICATION_PORT);

router.use(function(req, res, next){
	logger.verbose('>>>', req.method, req._parsedUrl.pathname);
	if(req.query.length || req.body.length)
	logger.debug('>>', req.query, req.body);
	next();
});

(async () => {
	const db = await mongo.getClient();

	const application = require('./resources/application');

	router.get('/', application.status);
	router.get('/test/logs', application.logs);
	router.get('/test/headers', application.headers);

	app.use('/', router);
	app.use(_errorHandler);

	app.listen(app.get('port'), () => {
		logger.info(`listening on port: ${APPLICATION_PORT}...`);
	})
})()
.catch((e)=> {
	if ("stack" in e) logger.error(e.stack);
	logger.error(e);
})

const _errorHandler = (err, req, res, next) => {
	logger.error('_errorHandler =>', err.toString());
	if(process.env.NODE_ENV == 'dev'){
		logger.debug('<<', err.response);
	}
	res.status(err.status || 500);
	if(err.response)
		res.json(err.response);
	else {
		logger.error(err.stack);
		res.end();
	}
}
