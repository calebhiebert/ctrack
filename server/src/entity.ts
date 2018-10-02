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

  public sort: number;

  public imageData?: string;

  constructor(
    name: string = 'dummy',
    maxHitpoints: number = 100,
    hitpoints: number = 0,
    type: EntityType = Entity.CHARACTER,
  ) {
    this.type = type;
    this.name = name;
    this.controllingIds = [];
    this.maxHitpoints = maxHitpoints;
    this.hitpoints = hitpoints === 0 ? maxHitpoints : hitpoints;
    this.id = nanoid();
    this.sort = 0;
  }

  encode(): string {
    return JSON.stringify(this);
  }

  decode(json: string): void {
    const entity: Entity = JSON.parse(json);

    this.id = entity.id;
    this.type = entity.type;
    this.name = entity.name;
    this.controllingIds = entity.controllingIds;
    this.maxHitpoints = entity.maxHitpoints;
    this.hitpoints = entity.hitpoints;
    this.sort = entity.sort || 0;
    this.imageData = entity.imageData;
  }
}

export type EntityType = 'character' | 'monster' | 'pet';
