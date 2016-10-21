#!/bin/env node
var config      = require('./config/config').values;
var logger      = require('./libs/logger').logger;
var express     = require('express');
var bodyParser  = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('port', config.port || 8080);

var router = express.Router();

router.use(function(req, res, next){
	logger.verbose('>', req.method, req._parsedUrl.pathname);
	logger.debug('<<', req.query, req.body);
	next();
});

var test = require('./resources/test').init();

router.get('/', test.status);
router.get('/test', test.log);

app.use('/', router);

app.listen(app.get('port'), function(){
	logger.info('>>>', 'listening on port ' + app.get('port') + '...');
});
