const config = require('config').get('mongo');
const { logger } = require('./logger');
const { MongoClient, ObjectId } = require('mongodb');

const MONGO_DB_NAME = config.name;
const MONGO_URI = config.host;
const MONGO_OPTIONS = {
	useNewUrlParser : true,
	useUnifiedTopology : true
}

let dbClient = {};
let _db = null;

const COLLECTION_LOGS = "logs";

dbClient.logs = () => { return _db.collection(COLLECTION_LOGS) };

exports.getClient = () => {
	return new Promise((resolve, reject) => {
		MongoClient.connect(MONGO_URI, MONGO_OPTIONS, (err, client) => {
			if(err){
				logger.error("(mongo,connect)", "connection err", err);
				return reject(err);
			}
			logger.silly("(mongo,connect)", "connected to database: " + MONGO_URI);
			_db = client.db(MONGO_DB_NAME);
			_addIndexes();
			resolve(dbClient);
		});
	});
};

function _addIndexes() {
	_db.collection(COLLECTION_LOGS).createIndex({ "userId" : 1 });
}

dbClient.ObjectId = ObjectId;
