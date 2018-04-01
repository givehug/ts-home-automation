// Config
import '../../config/config';

// Libs
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as path from 'path';

// Routes
import routes from './routes';

// Constants
const excludeApiRoutes = /^\/(?!api).*/;
const app = express();
const staticPath = path.join(__dirname, './../../client/dist/');

// Middleware
import {cors} from './middleware/cors';

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

export default app;
