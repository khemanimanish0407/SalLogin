var sql = require('mssql');
var _ = require('lodash');
var q = require('q');
var config = require('../config');
var logger = require('./logger');
var util = require('util');
var sqlConnection = require('./sql-connection');

/**
 * Query database
 * 
 * @param params
 *            query parameters
 * @param query
 *            query
 */
var _query = function(query, params, dbName) {
	var deffered = q.defer();
	if (_.isUndefined(dbName)) {
		dbName = config.get('sql.defaultDatabase');
	}
	// Get connection
	var connection = sqlConnection.connection(dbName);
	// Connect to SQL server
	connection.connect(function(err) {
		var ps = new sql.PreparedStatement(connection);
		if (!_.isUndefined(params)) {
			for ( var i in params) {
				// Input parameters
				ps.input(i, _mapType(typeof (params[i]), params[i]));
			}
		}
		// Prepare statement
		ps.prepare(query, function(err) {
			if (err) {
				deffered.reject(err);
				connection.close();
			} else {
				// Executes query
				ps.execute(params, function(err, recordset) {
					if (err) {
						deffered.reject(err);

					} else {
						deffered.resolve(recordset);
						ps.unprepare(function(err) {
							if (err) {
								logger.info(util.format('Error while in unprepare statement error %j', err));
							}
						});
					}

				});
			}
		});
	});
	return deffered.promise;
};

/**
 * execute a function
 * 
 * @param name
 *            function name
 * @param params
 *            function parameters
 */
var _execFunction = function(name, params, dbName) {
	var deffered = q.defer();
	if (_.isUndefined(dbName)) {
		dbName = config.get('sql.defaultDatabase');
	}
	// Get connection
	var connection = sqlConnection.connection(dbName);
	var stringParams = '';
	if (!_.isUndefined(params)) {
		stringParams = result.map(function(params) {
			return item.name;
		}).join(',');
	}
	name = 'SELECT dbo.' + name + '(' + stringParams + ')';
	_query([], name).then(function(recordset) {
		deffered.resolve(recordset);
	}, function(error) {
		deffered.reject(err);
	});
	return deffered.promise;
};

/**
 * execute a procedure
 * 
 * @param name
 *            function name
 * @param params
 *            function parameters
 */
var _execProcedure = function(name, params, dbName) {
	var deffered = q.defer();
	if (_.isUndefined(dbName)) {
		dbName = config.get('sql.defaultDatabase');
	}
	// Get connection
	var connection = sqlConnection.connection(dbName);
	// Connect to SQL server
	connection.connect(function(err) {
		var request = new sql.Request(connection);
		if (!_.isUndefined(params)) {
			// Add procedure parameter
			for ( var i in params) {
				request.input(i, _mapType(typeof (params[i]), params[i]), params[i]);
			}
		}
		// Executes procedure
		request.execute(name, function(err, recordset, returnValue) {

			if (err) {
				deffered.reject(err);
			} else {

				deffered.resolve(recordset);
			}
		});
	});
	return deffered.promise;
};

/**
 * To map JS data type to SQL data type
 * 
 * @param type
 *            java script type
 * @param value
 *            field value
 * @return SQL data type
 */
var _mapType = function(type, value) {
	switch (type.toLowerCase()) {
	case 'string':
		return sql.NVarChar
		break;
	case 'number':
		// Condition to check float value
		if (value / 1 > 0)
			return sql.Decimal;
		else
			return sql.BigInt;
		break;
	case 'boolean':
		return sql.Bit;
		break;
	case 'date':
		return sql.DateTime;
		break;
	case 'buffer':
		return sql.VarBinary;
		break;
	default:
		return sql.NVarChar
		break;
	}
};

/**
 * Check database connection
 */
var _checkConnection = function() {
	var deffered = q.defer();

	var dbName = config.get('sql.defaultDatabase');

	// Get connection
	var connection = new sql.Connection({
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
	// Connect to SQL server
	connection.connect(function(err) {
		if (err) {
			deffered.reject(err);
		} else {
			deffered.resolve(true);
		}
		connection.close();
	});
	return deffered.promise;
};

module.exports = {
	query : _query,
	execFunction : _execFunction,
	execProcedure : _execProcedure,
	checkConnection : _checkConnection
};