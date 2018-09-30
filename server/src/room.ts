import { Redis } from 'ioredis';
import nanoid from 'nanoid';
import { Entity } from './entity';

export interface IRoom {
	id: string;
	name: string;
	usePassword: boolean;
	password: string;
}

export class Room {
	public static async getUnusedRoomID(redis: Redis) {
		let id = nanoid(4).toUpperCase();

		while ((await redis.get(`room:${id}`)) !== null) {
			id = nanoid(4).toUpperCase();
		}

		return id;
	}

	constructor(private redis: Redis, public id: string = '') {}

	public async create(room: IRoom, masterId: string): Promise<void> {
		const pipeline = this.redis.pipeline();

		pipeline.sadd('roomkeys', room.id);
		pipeline.set(`room:${room.id}`, JSON.stringify(room));
		pipeline.sadd(`room:${room.id}:masters`, masterId);
		pipeline.sadd(`room:${room.id}:userlist`, masterId);
		return pipeline.exec();
	}

	public async get(): Promise<IRoom | null> {
		let roomJson = await this.redis.get(this.baseKey);

		if (roomJson !== null) {
			return JSON.parse(roomJson);
		}

		return null;
	}

	public async addEntity(entity: Entity): Promise<void> {
		await this.redis.hset(this.subkey('entities'), entity.id, entity.encode());
	}

	public async getUsers(): Promise<string[] | null> {
		return this.redis.smembers(this.subkey('userlist'));
	}

	public async getMasters(): Promise<string[] | null> {
		return this.redis.smembers(this.subkey('masters'));
	}

	public async addUser(id: string): Promise<void> {
		return this.redis.sadd(this.subkey('userlist'), id);
	}

	public async addMaster(id: string): Promise<void> {
		return this.redis.sadd(this.subkey('masters'), id);
	}

	public async getUsersFull(): Promise<any[] | null> {
		const ids = await this.getUsers();

		if (ids !== null) {
			return this.batchGetUsers(ids);
		}

		return null;
	}

	public async getMastersFull(): Promise<any[] | null> {
		const ids = await this.getMasters();

		if (ids !== null) {
			return this.batchGetUsers(ids);
		}

		return null;
	}

	private async batchGetUsers(ids: string[]): Promise<any> {
		return Promise.all(
			ids.map(async (id) => {
				let user = await this.redis.get(`user:${id}`);

				if (user !== null) {
					user = JSON.parse(user);
				}

				return user;
			})
		);
	}

	private subkey(key: string) {
		return `${this.baseKey}:${key}`;
	}

	private get baseKey() {
		return `room:${this.id}`;
	}
}
