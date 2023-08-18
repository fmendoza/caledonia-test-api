import bodyParser from 'body-parser';
import compression from 'compression';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import ApplicationError from './errors/application-error';
import routes from './routes';
import logger from './logger';
// @ts-expect-error
import { ParseServer } from 'parse-server';
// @ts-expect-error
import ParseDashboard from 'parse-dashboard';

const app = express();

function logResponseTime(req: Request, res: Response, next: NextFunction) {
  const startHrTime = process.hrtime();

  res.on('finish', () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs =
      elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
    const message = `${req.method} ${res.statusCode} ${elapsedTimeInMs}ms\t${req.path}`;
    logger.log({
      level: 'debug',
      message,
      consoleLoggerOptions: { label: 'API' },
    });
  });

  next();
}

app.use(logResponseTime);

app.use(compression() as any);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
);

app.use(routes);

app.use(
  (
    err: ApplicationError,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (res.headersSent) {
      return next(err);
    }

    return res.status(err.status || 500).json({
      error: err.message,
    });
  }
);

const mountPath = process.env.PARSE_API_MOUNT || '/parse';
const serverUrl = `${process.env.PARSE_API_SERVER_URL}:${process.env.PORT}${mountPath}`;

const startParseServer = async () => {
  
  const server = new ParseServer({
    databaseURI: process.env.MONGO_URL,
    cloud: __dirname + (process.env.CLOUD_CODE_MAIN || '/cloud/main.ts'),
    appId: process.env.PARSE_API_APP_ID,
    masterKey: process.env.PARSE_API_MASTER_KEY,
    serverURL: serverUrl,
  });

  await server.start();

  app.use(mountPath, server.app);
}

startParseServer().catch((err) => logger.error('Could not start parse server', new Error(err.message)));

const dashboard = new ParseDashboard({
  apps: [
    {
      serverURL: serverUrl,
      appId: process.env.PARSE_API_APP_ID,
      masterKey: process.env.PARSE_API_MASTER_KEY,
      appName: process.env.APP_NAME
    }
  ]
});

// mount parse-dashboard
app.use(process.env.PARSE_DASHBOARD_MOUNT || '', dashboard);

export default app;
