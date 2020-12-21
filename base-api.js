#!/bin/env node
require('dotenv').config();
const config = require('config');

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

const { logger } = require('./libs/logger');

const APPLICATION_PORT = config.application.port;

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
app.use(cors({ exposedHeaders: ['token'] }));
app.use(morgan(':date[iso]\x1b[34m verbose \x1b[39m <<< :method :url :status - :response-time ms'));

app.set('port', APPLICATION_PORT);

router.use(function(req, res, next){
	logger.verbose('>>>', req.method, req._parsedUrl.pathname);
	if(req.query.length || req.body.length)
		logger.debug('>>', req.query, req.body);
	next();
});

const _errorHandler = (err, req, res, next) => {
	logger.error('_errorHandler =>', err.toString());
	res.status(err.status || 500);
	if(process.env.NODE_ENV == 'dev') logger.debug('<<', err.response);
	if(err.response) res.json(err.response);
	else { logger.error(err.stack); res.end(); }
}

(async () => {
	const application = require('./resources/application').init();
	const auth = require('./resources/auth').init();

	router.get('/', application.status);
	router.get('/app/logs', application.logs);
	router.get('/app/headers/full', application.fullHeaders);
	router.get('/app/headers/simple', application.simpleHeaders);

	router.post('/auth/login', auth.apiKey, auth.login);
	router.get('/auth/me', auth.apiKey, auth.verifyJWT, auth.me);

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