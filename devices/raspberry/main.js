// configs
const config = require('./config');

// modules
const App = require('./modules/app');

// Initialize application.
const app = new App(config);

// Start application.
app.start().then(() => {
	console.log('Raspberry HA unit started.');
});
