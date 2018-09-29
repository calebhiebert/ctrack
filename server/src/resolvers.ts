import pubsub from './pubsub';
import { createRoomResolver } from './resolvers/room';
import { authenticateResolver, meResolver } from './resolvers/auth';

export default {
	Query: {
		dummy: () => 'hi',
		me: meResolver,
	},

	Mutation: {
		createRoom: createRoomResolver,
		authenticate: authenticateResolver,
	},

	Subscription: {
		ticker: {
			subscribe: () => pubsub.asyncIterator('ticker'),
		},
	},
};
