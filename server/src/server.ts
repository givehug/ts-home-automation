// Config
import config from '../../config';

// Libs
import chalk from 'chalk';
import * as http from 'http';
import * as WS from 'ws';

// Modules
import app from './app';
import WsServer from './modules/wsServer';

// Constants
const port = process.env.PORT || config.PORT;
const server = http.createServer(app);
const wss = new WS.Server({server});

// Start http server
server.listen(port, () => {
	console.log(
		chalk.cyan(`\n\n***  Server started on port ${port}, env: ${process.env.NODE_ENV || config.NODE_ENV}. ***\n\n`)
	);

	// Start WebSocket server
	new WsServer(WS, wss);
});
