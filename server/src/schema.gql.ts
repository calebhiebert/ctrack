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
    removeEntity(roomId: ID!, entityId: ID!): Boolean!
    changeEntity(roomId: ID!, entityId: ID!, input: ModifyEntityInput!): Entity!
  }

  type Subscription {
    ticker: Int!
    room(id: ID!): Room
  }

  type Room {
    id: String!
    name: String!
    usePassword: Boolean!
    masters: [User!]!
    users: [User!]!
    entities: [Entity!]!
    jsonExport: String!
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
    imageData: String
    sort: Int!
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
    sort: Int
    imageData: String
  }

  input ModifyEntityInput {
    type: EntityType
    name: String
    hitpoints: Int
    maxHitpoints: Int
    controllingIds: [String!]
    sort: Int
    imageData: String
  }
`;
