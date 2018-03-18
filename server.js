var http = require('http');
var express = require('express');
var util = require('util');
var config = require('./config');
var logger = require('./utils/logger');
var middlewares = require('./middlewares/index');
var routes = require('./routes/index');
var app = express();

// required to get client IP when running via reverse proxy (HA proxy)
app.set('trust proxy', true);

middlewares(app);

routes(app);

// set port.
app.set('port', config.get('server.http.port'));

// start HTTP server
http.createServer(app).listen(app.get('port'), function () {
	logger.info(util.format('API Running with pid:%s listening on port:%s', process.pid, app.get('port')));
	logger.info(util.format('Environment:%s', config.get('env')));
});
process.on('uncaughtException', function (e) {
	logger.info(util.format('uncaught exception:- ', e.stack));
});
