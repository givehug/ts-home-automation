// ROUTES
const userRouter = require('./user');
const deviceRouter = require('./devices');
const settingsRouter = require('./settings');

const routes = [
	userRouter,
	deviceRouter,
	settingsRouter,
];

module.exports = routes;
