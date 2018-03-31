// ROUTES
import appRouter from './app';
import deviceRouter from './devices';
import settingsRouter from './settings';
import userRouter from './user';

const routes = [
	userRouter,
	deviceRouter,
	settingsRouter,
	appRouter,
];

export default routes;
