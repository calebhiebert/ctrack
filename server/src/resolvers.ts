import pubsub from './pubsub';
import {
	createRoomResolver,
	getRoomResolver,
	joinRoomResolver,
} from './resolvers/room';
import { authenticateResolver, meResolver } from './resolvers/auth';

export default {
	Query: {
		dummy: () => 'hi',
		me: meResolver,
		room: getRoomResolver,
	},

	Mutation: {
		createRoom: createRoomResolver,
		authenticate: authenticateResolver,
		joinRoom: joinRoomResolver,
	},

	Subscription: {
		ticker: {
			subscribe: () => pubsub.asyncIterator('ticker'),
		},
	},
};
