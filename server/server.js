// Config
const config = require('../config');

// Libs
const chalk = require('chalk');
const WS = require('ws');
const http = require('http');

// Modules
const app = require('./app');
const WsServer = require('./modules/wsServer');

// Constants
const port = process.env.PORT || config.PORT;
const server = http.createServer(app);
const wss = new WS.Server({server});

// Start http server
server.listen(port, () => {
	console.log(
		chalk.cyan(`\n\n***  Server started on port ${port}, env: ${process.env.NODE_ENV}. ***\n\n`)
	);

	// Start WebSocket server
	new WsServer(WS, wss);
});
