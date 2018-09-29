import { IFieldResolver } from 'apollo-server-koa';
import nanoid from 'nanoid';
import { Context } from '../context';

export const authenticateResolver: IFieldResolver<null, Context> = async (root, args, ctx) => {
  const token = nanoid(64);
  const id = nanoid();

  const user = {
    id,
    name: args.username,
  };

  // Store the user data in redis for 24 hours
  await ctx.redis.set(`user:${token}`, JSON.stringify(user), 'EX', 60 * 60 * 24);

  return {
    token,
    user,
  };
};

export const meResolver: IFieldResolver<null, Context> = async (root, args, ctx) => {
  return ctx.user;
};
