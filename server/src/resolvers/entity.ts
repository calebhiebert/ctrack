import { IFieldResolver, ApolloError } from 'apollo-server-koa';
import { Context } from '../context';
import { Entity } from '../entity';
import { Room } from '../room';

export const removeEntityResolver: IFieldResolver<void, Context> = async (
	root,
	args,
	ctx
) => {
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
		throw new ApolloError(
			'Cannot delete that entity, not enough permissions',
			'NOT_ENOUGH_PERMISSIONS'
		);
	}

	await rm.deleteEntity(entityId);
	await rm.notifyChange();

	return true;
};

export const changeEntityResolver: IFieldResolver<void, Context> = async (
	root,
	args,
	ctx
) => {
	if (!ctx.user) {
		throw new ApolloError('Not authenticated', 'NOT_AUTHENTICATED');
	}

	const roomId = args.roomId;
	const entityId = args.entityId;
	const input = args.input;

	const rm = new Room(ctx.redis, roomId);

	let room = await rm.get();

	if (room === null) {
		throw new ApolloError('Could not find room', 'ROOM_NOT_FOUND');
	}

	const entity = await rm.getEntity(entityId);
	const isMaster = await rm.isMaster(ctx.user.id);

	if (entity === null) {
		throw new ApolloError('Could not find entity', 'ENTITY_NOT_FOUND');
	}

	if (entity.controllingIds.indexOf(ctx.user.id) === -1 && !isMaster) {
		throw new ApolloError('Not enough permissions', 'NOT_ENOUGH_PERMISSIONS');
	}

	if (input.type) {
		entity.type = input.type;
	}

	if (input.name) {
		entity.name = input.name;
	}

	if (input.hitpoints) {
		entity.hitpoints = input.hitpoints;
	}

	if (input.maxHitpoints) {
		entity.maxHitpoints = input.maxHitpoints;
	}

	if (input.controllingIds) {
		entity.controllingIds = input.controllingIds;
	}

	if (input.sort) {
		entity.sort = input.sort;
	}

	if (input.imageData) {
		entity.imageData = input.imageData;
	}

	await rm.changeEntity(entity);
	await rm.notifyChange();
	return entity;
};

export const addEntityResolver: IFieldResolver<void, Context> = async (
	root,
	args,
	ctx
) => {
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

	if (!isMaster) {
		ent.controllingIds.push(ctx.user.id);
	}

	await rm.sort();
	await rm.addEntity(ent);
	room = await rm.get();

	await rm.notifyChange();

	return ent;
};
