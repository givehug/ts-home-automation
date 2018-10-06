// ROUTES
import appRouter from './app';
import deviceRouter from './devices';
import homeSettingsRouter from './homeSettings';
import settingsRouter from './settings';
import userRouter from './user';

const routes = [
  userRouter,
  deviceRouter,
  settingsRouter,
  appRouter,
  homeSettingsRouter,
];

export default routes;
