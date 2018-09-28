import createLogger from './src/create-logger';
import schemaGql from './src/schema.gql';
import resolvers from './src/resolvers';
import Koa from 'koa';
import { ApolloServer } from 'apollo-server-koa';
import { setInterval } from 'timers';
import pubsub from './src/pubsub';

const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3400;
const logger = createLogger('index');

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

	const server = new ApolloServer({
		typeDefs: schemaGql,
		resolvers,
		context: (ctx: any) => {},
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
