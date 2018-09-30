import { IJSONSerializable } from './json-serializable';
import nanoid from 'nanoid';

export class Entity implements IJSONSerializable<Entity> {
	public static CHARACTER: EntityType = 'character';
	public static MONSTER: EntityType = 'monster';
	public static PET: EntityType = 'pet';

	public id: string;
	public type: EntityType;
	public name: string;
	public controllingIds: string[];

	public hitpoints: number;
	public maxHitpoints: number;

	constructor(
		name: string = 'dummy',
		maxHitpoints: number = 100,
		hitpoints: number = 0,
		type: EntityType = Entity.CHARACTER
	) {
		this.type = type;
		this.name = name;
		this.controllingIds = [];
		this.maxHitpoints = maxHitpoints;
		this.hitpoints = hitpoints === 0 ? maxHitpoints : hitpoints;
		this.id = nanoid();
	}

	encode(): string {
		return JSON.stringify(this);
	}

	decode(json: string): void {
		const entity: Entity = JSON.parse(json);

		this.type = entity.type;
		this.name = entity.name;
		this.controllingIds = entity.controllingIds;
	}
}

export type EntityType = 'character' | 'monster' | 'pet';