// Config
require('./../config/config');

// Libs
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// Routes
const routes = require('./routes');

// Constants
const excludeApiRoutes = /^\/(?!api).*/;
const app = express();
const staticPath = path.join(__dirname, './../client/dist/');

// Middleware
const {cors} = require('./middleware/cors');

// Apply app settings
app.use(cors);

// Apply API routes
app.use('/api', bodyParser.json());
app.use('/api', ...routes);

// Apply static routes
app.get(excludeApiRoutes, express.static(staticPath));
app.get(excludeApiRoutes, (req, res) => {
	res.sendFile(staticPath + 'index.html');
});

module.exports = app;
