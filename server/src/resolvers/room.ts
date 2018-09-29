import { IFieldResolver } from 'graphql-tools';
import nanoid from 'nanoid';
import { Context } from '../context';
import { ApolloError } from 'apollo-server-koa';
import { IRoom } from '../room';

export const getRoomResolver: IFieldResolver<null, Context> = async (
	root,
	args,
	ctx
) => {
	let room = await ctx.redis.get(`room:${args.id}`);

	if (room !== null) {
		room = JSON.parse(room);
	}

	return room;
};

export const joinRoomResolver: IFieldResolver<null, Context> = async (
	root,
	args,
	ctx
) => {
	if (!ctx.user) {
		throw new ApolloError('Not authenticated', 'NOT_AUTHENTICATED');
	}

	let roomJson: string = await ctx.redis.get(`room:${args.input.id}`);

	if (roomJson === null) {
		throw new ApolloError('Room not found', 'ROOM_NOT_FOUND');
	}

	const room: IRoom = JSON.parse(roomJson);

	if (room.usePassword && args.input.password !== room.password) {
		throw new ApolloError('Invalid password', 'INVALID_PASSWORD');
	}

	const members = await ctx.redis.smembers(`room:${room.id}:userlist`);

	if (members.length === 0) {
		await ctx.redis.sadd(`room:${room.id}:masters`, ctx.user.id);
	}

	await ctx.redis.sadd(`room:${room.id}:userlist`, ctx.user.id);

	return room;
};

export const createRoomResolver: IFieldResolver<null, Context> = async (
	root,
	args,
	ctx
) => {
	const getUnusedRoomID = async () => {
		let id = nanoid(4).toUpperCase();

		while ((await ctx.redis.get(`room:${id}`)) !== null) {
			id = nanoid(4).toUpperCase();
		}

		return id;
	};

	const roomId = await getUnusedRoomID();

	const room = {
		id: roomId,
		name: args.input.name,
		usePassword: args.input.usePassword,
		password: args.input.password,
	};

	const pipeline = await ctx.redis.pipeline();
	pipeline.sadd('roomkeys', roomId);
	pipeline.set(`room:${roomId}`, JSON.stringify(room));

	const results = await pipeline.exec();

	console.log(room);

	return room;
};

export const mastersOnRoomResolver: IFieldResolver<IRoom, Context> = async (
	root,
	args,
	ctx
) => {
	const masters: string[] = await ctx.redis.smembers(`room:${root.id}:masters`);

	if (masters === null) {
		return [];
	} else {
		return Promise.all(
			masters.map(async (m) => {
				let user = await ctx.redis.get(`user:${m}`);

				if (user !== null) {
					user = JSON.parse(user);
				}

				return user;
			})
		);
	}
};

export const usersOnRoomResolver: IFieldResolver<IRoom, Context> = async (
	root,
	args,
	ctx
) => {
	const masters: string[] = await ctx.redis.smembers(
		`room:${root.id}:userlist`
	);

	if (masters === null) {
		return [];
	} else {
		return Promise.all(
			masters.map(async (m) => {
				let user = await ctx.redis.get(`user:${m}`);

				if (user !== null) {
					user = JSON.parse(user);
				}

				return user;
			})
		);
	}
};
