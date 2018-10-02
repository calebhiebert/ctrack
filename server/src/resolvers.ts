import pubsub from './pubsub';
import {
  createRoomResolver,
  getRoomResolver,
  joinRoomResolver,
  mastersOnRoomResolver,
  usersOnRoomResolver,
  entitiesOnRoomResolver,
  roomSubscriptionResolver,
  jsonExportOnRoomResolver,
} from './resolvers/room';
import { authenticateResolver, meResolver } from './resolvers/auth';
import { addEntityResolver, removeEntityResolver, changeEntityResolver } from './resolvers/entity';

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
    addEntity: addEntityResolver,
    removeEntity: removeEntityResolver,
    changeEntity: changeEntityResolver,
  },

  Subscription: {
    ticker: {
      subscribe: () => pubsub.asyncIterator('ticker'),
    },

    room: {
      subscribe: roomSubscriptionResolver,
    },
  },

  Room: {
    masters: mastersOnRoomResolver,
    users: usersOnRoomResolver,
    entities: entitiesOnRoomResolver,
    jsonExport: jsonExportOnRoomResolver,
  },
};
