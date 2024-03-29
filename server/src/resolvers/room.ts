import { IFieldResolver } from 'graphql-tools';
import { Context } from '../context';
import { ApolloError } from 'apollo-server-koa';
import { IRoom, Room } from '../room';
import pubsub from '../pubsub';
import { Entity } from '../entity';

export const getRoomResolver: IFieldResolver<null, Context> = async (
	root,
	args,
	ctx
) => {
	let rm = new Room(ctx.redis, args.id);
	return rm.get();
};

export const joinRoomResolver: IFieldResolver<null, Context> = async (
	root,
	args,
	ctx
) => {
	if (!ctx.user) {
		throw new ApolloError('Not authenticated', 'NOT_AUTHENTICATED');
	}

	const rm = new Room(ctx.redis, args.input.id);

	const room = await rm.get();

	if (room === null) {
		throw new ApolloError('Room not found', 'ROOM_NOT_FOUND');
	}

	if (room.usePassword && args.input.password !== room.password) {
		throw new ApolloError('Invalid password', 'INVALID_PASSWORD');
	}

	const members = await rm.getUsers();

	if (members === null || members.length === 0) {
		await rm.addMaster(ctx.user.id);
	}

	await rm.addUser(ctx.user.id);

	await rm.notifyChange();

	return room;
};

export const createRoomResolver: IFieldResolver<null, Context> = async (
	root,
	args,
	ctx
) => {
	if (!ctx.user) {
		throw new ApolloError('Not authenticated', 'NOT_AUTHENTICATED');
	}

	const roomId = await Room.getUnusedRoomID(ctx.redis);

	const room: IRoom = {
		id: roomId,
		name: args.input.name,
		usePassword: args.input.usePassword,
		password: args.input.password,
		monsterHpHidden: true,
	};

	const rm = new Room(ctx.redis);
	await rm.create(room, ctx.user.id);
	return room;
};

export const mastersOnRoomResolver: IFieldResolver<IRoom, Context> = async (
	root,
	args,
	ctx
) => {
	return new Room(ctx.redis, root.id).getMastersFull();
};

export const usersOnRoomResolver: IFieldResolver<IRoom, Context> = async (
	root,
	args,
	ctx
) => {
	return new Room(ctx.redis, root.id).getUsersFull();
};

export const entitiesOnRoomResolver: IFieldResolver<IRoom, Context> = async (
	root,
	args,
	ctx
) => {
	const rm = new Room(ctx.redis, root.id);

	const entities = await rm.getEntities();

	return entities;
};

export const jsonExportOnRoomResolver: IFieldResolver<IRoom, Context> = async (
	root,
	args,
	ctx
) => {
	const rm = new Room(ctx.redis, root.id);
	const entities = await rm.getEntities();

	let exportEntities: any[];

	if (entities !== null) {
		exportEntities = entities.map((e) => {
			return {
				name: e.name,
				hitpoints: e.hitpoints,
				maxHitpoints: e.maxHitpoints,
				type: e.type,
				sort: e.sort,
				imageData: e.imageData,
			};
		});
	} else {
		exportEntities = [];
	}

	return JSON.stringify({
		entities: exportEntities,
	});
};

export const jsonImportResolver: IFieldResolver<void, Context> = async (
	root,
	args,
	ctx
) => {
	const rm = new Room(ctx.redis, args.roomId);
	const parsedImport = JSON.parse(args.exportJson);

	const invalidFormatError = new ApolloError(
		'Invalid import format',
		'INVALID_IMPORT_FORMAT'
	);

	if (!parsedImport.entities) {
		throw invalidFormatError;
	}

	for (const entity of parsedImport.entities) {
		const e = new Entity();

		if (!entity.name || !entity.maxHitpoints) {
			throw invalidFormatError;
		}

		e.name = entity.name;
		e.hitpoints = entity.hitpoints || entity.maxHitpoints;
		e.maxHitpoints = entity.maxHitpoints;
		e.imageData = entity.imageData;
		e.type = entity.type || 'character';
		e.sort = entity.sort || 0;

		await rm.addEntity(e);
	}

	await rm.notifyChange();

	return rm.get();
};

export const changeRoomResolver: IFieldResolver<null, Context> = async (
	root,
	args,
	ctx
) => {
	if (!ctx.user) {
		throw new ApolloError('Not authenticated', 'NOT_AUTHENTICATED');
	}

	const roomId = args.id;
	const rm = new Room(ctx.redis, roomId);

	const isMaster = await rm.isMaster(ctx.user.id);

	if (!isMaster) {
		throw new ApolloError('Not enough permissions', 'NOT_ENOUGH_PERMISSIONS');
	}

	await rm.change(args.input);
	await rm.notifyChange();

	return rm.get();
};

export const roomSubscriptionResolver: IFieldResolver<void, Context> = (
	root,
	args,
	ctx
) => {
	return pubsub.asyncIterator(`room-${args.id}`);
};

export const ttlOnRoomResolver: IFieldResolver<IRoom, Context> = async (
	root,
	args,
	ctx
) => {
	const rm = new Room(ctx.redis, root.id);
	return rm.getTTL();
};
