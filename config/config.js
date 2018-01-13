const env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
	const config = require('./config.json');

	for (const key of Object.keys(config[env])) {
		process.env[key] = config[env][key];
	}
}
