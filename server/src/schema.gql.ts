import { gql } from 'apollo-server-koa';

export default gql`
	type Query {
		dummy: String
		me: User
		room(id: ID!): Room
	}

	type Mutation {
		createRoom(input: CreateRoomOptions!): Room!
		authenticate(username: String!): AuthResult!
		joinRoom(input: JoinRoomOptions!): Room!
		addEntity(roomId: ID!, input: AddEntityInput!): Entity!
	}

	type Subscription {
		ticker: Int!
	}

	type Room {
		id: String!
		name: String!
		usePassword: Boolean!
		masters: [User!]!
		users: [User!]!
		entities: [Entity!]!
	}

	type AuthResult {
		token: String!
		user: User!
	}

	type Entity {
		id: ID!
		type: EntityType!
		name: String!
		controllingIds: [String!]!
		hitpoints: Int!
		maxHitpoints: Int!
	}

	enum EntityType {
		character
		monster
		pet
	}

	type User {
		id: String!
		name: String!
	}

	input CreateRoomOptions {
		name: String!
		usePassword: Boolean!
		password: String
	}

	input JoinRoomOptions {
		id: String!
		password: String
	}

	input AddEntityInput {
		type: EntityType!
		name: String!
		hitpoints: Int
		maxHitpoints: Int!
	}
`;
