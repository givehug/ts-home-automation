// ROUTES
const userRouter = require('./user');
const deviceRouter = require('./devices');
const settingsRouter = require('./settings');
const appRouter = require('./app');

const routes = [
	userRouter,
	deviceRouter,
	settingsRouter,
	appRouter,
];

module.exports = routes;
