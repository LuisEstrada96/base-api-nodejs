#!/bin/env node
const config 		= require('./config/config');
const logger 		= require('./libs/logger');
const express 		= require('express');
const bodyParser 	= require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('port', config.port || 8080);

const router = express.Router();

router.use(function(req, res, next){
	logger.verbose('>>>', req.method, req._parsedUrl.pathname);
	logger.debug('>>', req.query, req.body);
	next();
});

const test = require('./resources/test').init();

router.get('/', test.status);
router.get('/test', test.log);

app.use('/', router);

app.listen(app.get('port'), function(){
	logger.info('listening on port: ', app.get('port'));
});
