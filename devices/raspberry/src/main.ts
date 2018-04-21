// configs
import config from './config';

// modules
import App from './modules/app';

// Initialize application.
const app = new App(config);

// Start application.
app.start().then(() => {
  console.log('Raspberry HA unit started.');
});
