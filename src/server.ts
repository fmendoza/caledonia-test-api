/* eslint-disable import/first */
import dotenv from 'dotenv';

const result = dotenv.config();
if (result.error) {
  dotenv.config({ path: '.env.default' });
}

import util from 'util';
import app from './app';
import logger from './logger';

const PORT = process.env.PORT || 3000;

let debugCallback;
if (process.env.NODE_ENV === 'development') {
  debugCallback = (collectionName: string, method: string, query: any, doc: string): void => {
    const message = `${collectionName}.${method}(${util.inspect(query, { colors: true, depth: null })})`;
    logger.log({
      level: 'verbose',
      message,
      consoleLoggerOptions: { label: 'MONGO' }
    });
  };
}

const serve = () => app.listen(PORT, () => {
  logger.info(`🌏 Express server started at http://localhost:${PORT}`);

  if (process.env.NODE_ENV === 'development') {
    // This route is only present in development mode
    logger.info(`⚙️  Swagger UI hosted at http://localhost:${PORT}/dev/api-docs`);
  }
});

if (process.env.MONGO_URL == null) {
  logger.error('MONGO_URL not specified in environment', new Error('MONGO_URL not specified in environment'));
  process.exit(1);
} else {
  serve();
}

// Close the Mongoose connection, when receiving SIGINT
process.on('SIGINT', async () => {
  console.log('\n'); /* eslint-disable-line */
  logger.info('Gracefully shutting down');
  logger.info('Closing the MongoDB connection');

  // TODO: Close database
  process.exit(0);
});
