import pubsub from './pubsub';
import { createRoomResolver } from './resolvers/room';

export default {
	Query: {
		dummy: () => 'hi',
	},

	Mutation: {
		createRoom: createRoomResolver,
	},

	Subscription: {
		ticker: {
			subscribe: () => pubsub.asyncIterator('ticker'),
		},
	},
};
