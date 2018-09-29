import { IFieldResolver } from 'graphql-tools';
import nanoid from 'nanoid';
import { Context } from '../context';

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
	throw new Error('Invalid password');
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
