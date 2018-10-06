import { IJSONSerializable } from './json-serializable';
import nanoid from 'nanoid';

export class Preset implements IJSONSerializable<Preset> {
	public static CHARACTER: EntityType = 'character';
	public static MONSTER: EntityType = 'monster';
	public static PET: EntityType = 'pet';

	public id: string;
	public type: EntityType;
	public name: string;

	public hitpoints: number;
	public maxHitpoints: number;

	public imageData?: string;

	constructor(
		name: string = 'dummy',
		maxHitpoints: number = 100,
		hitpoints: number = 0,
		type: EntityType = Preset.CHARACTER
	) {
		this.type = type;
		this.name = name;
		this.maxHitpoints = maxHitpoints;
		this.hitpoints = hitpoints === 0 ? maxHitpoints : hitpoints;
		this.id = nanoid();
	}

	encode(): string {
		return JSON.stringify(this);
	}

	decode(json: string): void {
		const preset: Preset = JSON.parse(json);

		this.id = preset.id;
		this.type = preset.type;
		this.name = preset.name;
		this.maxHitpoints = preset.maxHitpoints;
		this.hitpoints = preset.hitpoints;
		this.imageData = preset.imageData;
	}
}

export type EntityType = 'character' | 'monster' | 'pet';
