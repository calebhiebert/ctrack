import { gql } from 'apollo-server-koa';

export default gql`
	type Query {
		dummy: String
	}

	type Mutation {
		createRoom(input: CreateRoomOptions!): Room!
	}

	type Subscription {
		ticker: Int!
	}

	type Room {
		id: String!
		name: String!
	}

	input CreateRoomOptions {
		name: String!
	}
`;
