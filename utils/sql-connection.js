var sql = require('mssql');
var _ = require('lodash');
var config = require('../config');

var sqlConnections = {};

var dbKeys = _.keys(config.get('sql.database'))

// Create one connection for one database, it is not like global connection pool
for ( var key in dbKeys) {
	sqlConnections[config.get('sql.database') + dbKeys[key]] = null;
}

var connection = function(dbName) {
//	if (sqlConnections[dbName]) {
//		return sqlConnections[dbName];
//	}
	// Configure connection parameters
	sqlConnections[dbName] = new sql.Connection({
		user : config.get('sql.user'),
		password : config.get('sql.password'),
		server : config.get('sql.host'),
		database : dbName,
		connectionTimeout : config.get('sql.connectionTimeout'),
		requestTimeout : config.get('sql.requestTimeout'),
		options : {
			encrypt : config.get('sql.isConnectionEncrypted')
		},
		pool : {
			max : config.get('sql.connectionPool.maximum'),
			min : config.get('sql.connectionPool.minimum'),
			idleTimeoutMillis : config.get('sql.connectionPool.idleTimeoutMillis')
		}
	});
	return sqlConnections[dbName];
};
module.exports = {
	connection : connection
};
