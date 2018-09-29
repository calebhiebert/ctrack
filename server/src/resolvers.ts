import pubsub from './pubsub';
import { createRoomResolver, getRoomResolver } from './resolvers/room';
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
  },

  Subscription: {
    ticker: {
      subscribe: () => pubsub.asyncIterator('ticker'),
    },
  },
};
