import { IFieldResolver, ApolloError } from 'apollo-server-koa';
import { Context } from '../context';
import { Entity } from '../entity';
import { Room } from '../room';
import pubsub from '../pubsub';

export const removeEntityResolver: IFieldResolver<void, Context> = async (root, args, ctx) => {
  if (!ctx.user) {
    throw new ApolloError('Not authenticated', 'NOT_AUTHENTICATED');
  }

  const roomId = args.roomId;
  const entityId = args.entityId;

  const rm = new Room(ctx.redis, roomId);

  const isMaster = await rm.isMaster(ctx.user.id);
  const entity = await rm.getEntity(entityId);

  if (!entity) {
    throw new ApolloError('Entity did not exist', 'ENTITY_NOT_FOUND');
  }

  if (entity.controllingIds.indexOf(ctx.user.id) !== -1 && !isMaster) {
    throw new ApolloError('Cannot delete that entity, not enough permissions', 'NOT_ENOUGH_PERMISSIONS');
  }

  await rm.deleteEntity(entityId);
  await rm.notifyChange();

  return true;
};

export const addEntityResolver: IFieldResolver<void, Context> = async (root, args, ctx) => {
  if (!ctx.user) {
    throw new ApolloError('Not authenticated', 'NOT_AUTHENTICATED');
  }

  const roomId = args.roomId;
  const input = args.input;

  const rm = new Room(ctx.redis, roomId);

  let room = await rm.get();

  if (room === null) {
    throw new ApolloError('Could not find room', 'ROOM_NOT_FOUND');
  }

  const controlledEntities = await rm.getControlledEntities(ctx.user.id);
  const isMaster = await rm.isMaster(ctx.user.id);

  if (controlledEntities && controlledEntities.length > 0 && !isMaster) {
    throw new ApolloError('Could not create entity', 'TOO_MANY_ENTITIES');
  }

  const ent = new Entity();
  ent.type = input.type;
  ent.name = input.name;

  if (input.hitpoints) {
    ent.hitpoints = input.hitpoints;
  } else {
    ent.hitpoints = ent.maxHitpoints = input.maxHitpoints;
  }

  ent.controllingIds.push(ctx.user.id);

  await rm.addEntity(ent);
  room = await rm.get();

  await rm.notifyChange();

  return ent;
};
