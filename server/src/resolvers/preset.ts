import { IFieldResolver, makeRemoteExecutableSchema } from 'graphql-tools';
import { Context } from '../context';
import { ApolloError } from 'apollo-server-koa';
import { Room, IRoom } from '../room';
import { Preset } from '../preset';
import { Entity } from '../entity';
import createLogger from '../create-logger';

const logger = createLogger('preset');

export const createPresetResolver: IFieldResolver<void, Context> = async (
	root,
	args,
	ctx
) => {
	if (!ctx.user) {
		throw new ApolloError('Not authenticated', 'NOT_AUTHENTICATED');
	}

	const { roomId, entityId } = args;

	const rm = new Room(ctx.redis, roomId);

	const isMaster = await rm.isMaster(ctx.user.id);

	if (!isMaster) {
		throw new ApolloError('Not enough permissions', 'NOT_ENOUGH_PERMISSIONS');
	}

	const entity = await rm.getEntity(entityId);

	if (entity === null) {
		throw new ApolloError('Entity not found', 'ENTITY_NOT_FOUND');
	}

	const preset = new Preset(
		entity.name,
		entity.maxHitpoints,
		entity.hitpoints,
		entity.type
	);
	preset.imageData = entity.imageData;

	await rm.createPreset(preset);

	await rm.notifyChange();

	return preset;
};

export const deletePresetResolver: IFieldResolver<void, Context> = async (
	root,
	args,
	ctx
) => {
	if (!ctx.user) {
		throw new ApolloError('Not authenticated', 'NOT_AUTHENTICATED');
	}

	const { roomId, presetId } = args;

	const rm = new Room(ctx.redis, roomId);

	const isMaster = await rm.isMaster(ctx.user.id);

	if (!isMaster) {
		throw new ApolloError('Not enough permissions', 'NOT_ENOUGH_PERMISSIONS');
	}

	const preset = await rm.deletePreset(presetId);

	await rm.notifyChange();

	return true;
};

export const spawnPresetResolver: IFieldResolver<void, Context> = async (
	root,
	args,
	ctx
) => {
	if (!ctx.user) {
		throw new ApolloError('Not authenticated', 'NOT_AUTHENTICATED');
	}

	const { roomId, presetId, count } = args;

	const rm = new Room(ctx.redis, roomId);
	const isMaster = await rm.isMaster(ctx.user.id);

	if (!isMaster) {
		throw new ApolloError('Not enough permissions', 'NOT_ENOUGH_PERMISSIONS');
	}

	const preset = await rm.getPreset(presetId);

	if (preset === null) {
		throw new ApolloError('Entity not found', 'ENTITY_NOT_FOUND');
	}

	const entities = [];

	for (let i = 0; i < (count || 1); i++) {
		const entity = new Entity(
			preset.name,
			preset.maxHitpoints,
			preset.hitpoints,
			preset.type
		);
		entity.imageData = preset.imageData;
		entities.push(entity);
	}

	for (const e of entities) {
		await rm.addEntity(e);
	}

	await rm.notifyChange();

	return preset;
};

export const presetsOnRoomResolver: IFieldResolver<IRoom, Context> = async (
	root,
	args,
	ctx
) => {
	const rm = new Room(ctx.redis, root.id);

	const presets = await rm.getPresets();

	return presets;
};
