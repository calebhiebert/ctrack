import createLogger from './src/create-logger';
import schemaGql from './src/schema.gql';
import resolvers from './src/resolvers';
import Koa from 'koa';
import { ApolloServer } from 'apollo-server-koa';
import { setInterval } from 'timers';
import pubsub from './src/pubsub';
import ioredis from 'ioredis';
import { Context } from './src/context';
import nanoid from 'nanoid';
import authMiddleware from './src/auth-middleware';

const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3400;
const logger = createLogger('index');
const redis = new ioredis(process.env.REDIS);

function startTicker() {
  let ticker = 0;

  setInterval(() => {
    ticker++;
    pubsub.publish('ticker', { ticker });
  }, 1000);
}

async function startServer() {
  logger.debug('Starting API Server');

  const app = new Koa();

  app.use(authMiddleware(redis));

  const server = new ApolloServer({
    typeDefs: schemaGql,
    resolvers,
    context: async (ctx: any): Promise<Context> => {
      const context = new Context(redis);

      if (ctx.connection && !ctx.connection.testid) {
        ctx.connection.testid = nanoid();
      }

      if (ctx.ctx) {
        context.user = ctx.ctx.user;
      }

      return context;
    },
  });

  server.applyMiddleware(<any>{
    app,
  });

  const httpServer = app.listen(port, () => {
    logger.info('Server Listening', { port });
  });

  server.installSubscriptionHandlers(httpServer);

  startTicker();
}

startServer();
