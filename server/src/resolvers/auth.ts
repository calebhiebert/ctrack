import { IFieldResolver } from 'apollo-server-koa';
import nanoid from 'nanoid';

export const authenticateResolver: IFieldResolver<null, any> = async (
	root,
	args,
	ctx
) => {
	return {
		token: nanoid(64),
		user: {
			id: nanoid(),
			name: args.username,
		},
	};
};

export const meResolver: IFieldResolver<null, any> = async (
	root,
	args,
	ctx
) => {
	return {
		id: nanoid(),
		name: 'james',
	};
};
