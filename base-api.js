#!/bin/env node
const logger = require('./libs/logger');

const bodyParser = require('body-parser');
const config = require('config');
const express = require('express');
const morgan = require('morgan');

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('combined'));

app.set('port', config.get('port'));

router.use(function(req, res, next){
	logger.verbose('>>>', req.method, req._parsedUrl.pathname);
	logger.debug('>>', req.query, req.body);
	next();
});

const test = require('./resources/test').init();

router.get('/', test.status);
router.get('/test', test.log);
router.get('/test/headers', test.headers);

app.use('/', router);

app.listen(app.get('port'), function(){
	logger.info('listening on port: ', app.get('port'), '...');
});
