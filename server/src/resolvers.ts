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
	changeRoomResolver,
	jsonImportResolver,
} from './resolvers/room';
import { authenticateResolver, meResolver } from './resolvers/auth';
import {
	addEntityResolver,
	removeEntityResolver,
	changeEntityResolver,
} from './resolvers/entity';

export default {
	Query: {
		dummy: () => 'hi',
		me: meResolver,
		room: getRoomResolver,
	},

	Mutation: {
		createRoom: createRoomResolver,
		changeRoom: changeRoomResolver,
		authenticate: authenticateResolver,
		joinRoom: joinRoomResolver,
		addEntity: addEntityResolver,
		removeEntity: removeEntityResolver,
		changeEntity: changeEntityResolver,
		importCharacterData: jsonImportResolver,
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
