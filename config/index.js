const config = require('./config.json');
const env = process.env.NODE_ENV || 'development';

export default config[env];
