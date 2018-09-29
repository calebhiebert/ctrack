import { Redis } from 'ioredis';

export class Context {
  private _user?: IUser;

  constructor(private redisInstance: Redis, user?: IUser) {
    this._user = user;
  }

  public get redis() {
    return this.redisInstance;
  }

  public set user(value) {
    this._user = value;
  }

  public get user() {
    return this._user;
  }
}

export interface IUser {
  id: string;
  name: string;
}
