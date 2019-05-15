const config 		= require('../config/config');
const logger 		= require('./logger');
const mongodb 		= require('mongodb');
const MongoClient 	= mongodb.MongoClient;

const MONGO_DB_HOST = config.mongo.host;
const MONGO_DB_NAME = config.mongo.name;
const MONGO_DB_TTL = config.mongo.ttl;

exports.ObjectId = mongodb.ObjectId;

let _db, _users;

exports.users = function(){ return _users; }

exports.connect = async function(){
	logger.debug("connecting to " + MONGO_DB_HOST);
	const mongo = await MongoClient.connect(MONGO_DB_HOST, { useNewUrlParser: true });
	_db = mongo.db(MONGO_DB_NAME);
	const initialize = await _initialize();
	return _db;
};

function _initialize(){
	return new Promise(async function(resolve, reject) {
		_users = _db.collection('users');
		return resolve(_addIndexes());
	});
}

function _addIndexes(){
	return Promise.all([
		_users.createIndex({ createdDate: 1 })
	]);
}
