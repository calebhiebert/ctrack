import { Redis } from 'ioredis';
import nanoid from 'nanoid';
import { Entity } from './entity';
import pubsub from './pubsub';

export interface IRoom {
	id: string;
	name: string;
	monsterHpHidden: boolean;
	usePassword: boolean;
	password: string;
}

export interface IRoomChange {
	monsterHpHidden?: boolean;
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

	public async change(room: IRoomChange): Promise<IRoom | null> {
		const currentRoom = await this.get();

		if (currentRoom === null) {
			return null;
		}

		const newRoom = {
			...currentRoom,
			...room,
		};

		await this.redis.set(this.baseKey, JSON.stringify(newRoom));

		return newRoom;
	}

	public async addEntity(entity: Entity): Promise<void> {
		await this.redis.hset(this.subkey('entities'), entity.id, entity.encode());
	}

	public async changeEntity(entity: Entity): Promise<Entity> {
		await this.redis.hset(this.subkey('entities'), entity.id, entity.encode());
		return entity;
	}

	public async getEntities(): Promise<Entity[] | null> {
		const entities = await this.redis.hgetall(this.subkey('entities'));

		if (entities === null) {
			return null;
		}

		return Object.keys(entities).map((e) => {
			const entity = new Entity();
			entity.decode(entities[e]);
			return entity;
		});
	}

	public async deleteEntity(id: string): Promise<void> {
		return this.redis.hdel(this.subkey('entities'), id);
	}

	public async getEntity(id: string): Promise<Entity | null> {
		const entity = await this.redis.hget(this.subkey('entities'), id);

		if (entity === null) {
			return null;
		}

		const ent = new Entity();

		ent.decode(entity);

		return ent;
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

	public async isMaster(id: string): Promise<boolean> {
		const masters = await this.getMasters();

		if (masters === null) {
			return false;
		}

		return masters.indexOf(id) !== -1;
	}

	public async getControlledEntities(id: string): Promise<Entity[] | null> {
		const entities = await this.getEntities();

		if (entities === null) {
			return null;
		}

		return entities.filter((e) => e.controllingIds.indexOf(id) !== -1);
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

	public async notifyChange(): Promise<void> {
		pubsub.publish(`room-${this.id}`, { room: await this.get() });
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
