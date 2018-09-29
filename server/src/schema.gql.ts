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
	}

	type AuthResult {
		token: String!
		user: User!
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
`;
