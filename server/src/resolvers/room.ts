import { IFieldResolver } from 'graphql-tools';
import nanoid from 'nanoid';

export const createRoomResolver: IFieldResolver<null, any> = async (
	root,
	args,
	ctx
) => {
	return {
		id: nanoid(4).toUpperCase(),
		name: args.input.name,
	};
};
