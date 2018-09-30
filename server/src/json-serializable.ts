export interface IJSONSerializable<T> {
	encode(): string;
	decode(json: string): void;
}
