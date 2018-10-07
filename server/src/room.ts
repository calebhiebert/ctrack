import { Redis } from 'ioredis';
import nanoid from 'nanoid';
import { Entity } from './entity';
import pubsub from './pubsub';
import { Preset } from './preset';

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

	constructor(
		private redis: Redis,
		public id: string = '',
		public lifetime = 60 * 60 * 24
	) {}

	public async create(room: IRoom, masterId: string): Promise<void> {
		const pipeline = this.redis.pipeline();

		pipeline.sadd('roomkeys', room.id);
		pipeline.set(`room:${room.id}`, JSON.stringify(room));
		pipeline.sadd(`room:${room.id}:masters`, masterId);
		pipeline.sadd(`room:${room.id}:userlist`, masterId);
		await pipeline.exec();
		await this.setExpire();
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
		await this.setExpire();

		return newRoom;
	}

	public async createPreset(preset: Preset): Promise<void> {
		const result = await this.redis.hset(
			this.subkey('presets'),
			preset.id,
			preset.encode()
		);

		await this.setExpire();
	}

	public async deletePreset(id: string): Promise<void> {
		await this.redis.hdel(this.subkey('presets'), id);
		await this.setExpire();
	}

	public async getPreset(id: string): Promise<Preset | null> {
		const preset = await this.redis.hget(this.subkey('presets'), id);

		if (preset === null) {
			return null;
		}

		const p = new Preset();
		p.decode(preset);

		await this.setExpire();

		return p;
	}

	public async getPresets(): Promise<Preset[] | null> {
		const presets = await this.redis.hgetall(this.subkey('presets'));

		if (presets === null) {
			return null;
		}

		return Object.keys(presets).map((e) => {
			const preset = new Preset();
			preset.decode(presets[e]);
			return preset;
		});
	}

	public async addEntity(entity: Entity): Promise<void> {
		await this.redis.hset(this.subkey('entities'), entity.id, entity.encode());
		await this.setExpire();
	}

	public async changeEntity(entity: Entity): Promise<Entity> {
		await this.redis.hset(this.subkey('entities'), entity.id, entity.encode());
		await this.setExpire();
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
		await this.redis.hdel(this.subkey('entities'), id);
		this.setExpire();
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
		await this.redis.sadd(this.subkey('userlist'), id);
		await this.setExpire();
	}

	public async addMaster(id: string): Promise<void> {
		await this.redis.sadd(this.subkey('masters'), id);
		await this.setExpire();
	}

	public async isMaster(id: string): Promise<boolean> {
		const masters = await this.getMasters();

		if (masters === null) {
			return false;
		}

		return masters.indexOf(id) !== -1;
	}

	public async sort(
		type: 'default' | 'hp' | 'mhp' = 'default',
		order: 'asc' | 'desc' = 'desc'
	): Promise<void> {
		const entities = await this.getEntities();

		if (entities) {
			switch (type) {
				case 'hp':
					entities.sort(
						(a, b) =>
							order === 'desc'
								? a.hitpoints - b.hitpoints
								: b.hitpoints - a.hitpoints
					);
					break;
				case 'mhp':
					entities.sort(
						(a, b) =>
							order === 'desc'
								? a.maxHitpoints - b.maxHitpoints
								: b.maxHitpoints - a.maxHitpoints
					);
					break;
			}

			// Reset sort numbers
			for (let i = 0; i < entities.length; i++) {
				entities[i].sort = i + 1;
			}

			for (const entity of entities) {
				await this.changeEntity(entity);
			}
		}
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

	public async setExpire(): Promise<void> {
		const pipeline = this.redis.pipeline();

		pipeline.expire(this.baseKey, this.lifetime);
		pipeline.expire(this.subkey('userlist'), this.lifetime);
		pipeline.expire(this.subkey('masters'), this.lifetime);
		pipeline.expire(this.subkey('entities'), this.lifetime);
		pipeline.expire(this.subkey('presets'), this.lifetime);

		await pipeline.exec();
	}

	public async getTTL(): Promise<number> {
		return this.redis.ttl(this.baseKey);
	}

	private subkey(key: string) {
		return `${this.baseKey}:${key}`;
	}

	private get baseKey() {
		return `room:${this.id}`;
	}
}
