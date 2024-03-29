import { Middleware } from 'koa';
import { Redis } from 'ioredis';

export default (redis: Redis): Middleware => {
	return async (ctx, next) => {
		const authHeader: string | undefined = ctx.request.headers['authorization'];

		if (authHeader) {
			const token = authHeader.substring('Bearer '.length);

			(ctx as any).user = await getUserFromToken(redis, token);

			await next();
		} else {
			await next();
		}
	};
};

export const getUserFromToken = async (redis: Redis, token: string) => {
	let userId = await redis.get(`usertoken:${token}`);
	let user;

	if (userId !== null) {
		user = await redis.get(`user:${userId}`);

		if (user !== null) {
			user = JSON.parse(user);
		}
	}

	return user || undefined;
};
