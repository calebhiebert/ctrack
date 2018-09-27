import createLogger from './src/create-logger';
import express from 'express';
import { APIServer } from './src/apollo-server';
import schemaGql from './src/schema.gql';
import resolvers from './src/resolvers';
import { ApolloServerBase } from 'apollo-server-core';
import { createServer } from 'http';

const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3400;
const logger = createLogger('index');

async function startServer() {
	logger.debug('Starting API Server');

	const app = express();

	const apollo = new ApolloServerBase({
		typeDefs: schemaGql,
		resolvers,
		context: (data: any) => {},
	});

	const httpServer = createServer(app);
	apollo.installSubscriptionHandlers(httpServer);

	await new Promise((resolve) => {
		httpServer.once('listening', resolve);
		httpServer.listen({ port });
	});

	api.applyMiddleware({
		app,
		path: '/',
		cors: { origin: '*' },
		bodyParserConfig: { limit: '10mb' },
	});

	logger.info('Server started', {
		port,
	});
}

startServer();
