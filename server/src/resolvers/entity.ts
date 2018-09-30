import { IFieldResolver, ApolloError } from 'apollo-server-koa';
import { Context } from '../context';
import { Entity } from '../entity';
import { Room } from '../room';

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

	const room = await rm.get();

	if (room === null) {
		throw new ApolloError('Could not find room', 'ROOM_NOT_FOUND');
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

	return ent;
};
