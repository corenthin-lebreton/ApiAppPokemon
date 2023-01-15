let errorMessages = {
	playerInQueue: "Player is already in queue",
	playerNotInQueue: "Player is not in queue",
};

export interface IMatchMakerOptions {
	checkInterval?: number;
	maxMatchSize?: number;
	minMatchSize?: number;
}

// TODO expiry time
export class Matchmaker {

	protected resolver: (players: any[]) => void;
	protected getKey: (player: any) => string;
	protected queue: any[];

	protected checkInterval: number; // Time to check for players, value in milliseconds defaults to 5000
	protected maxMatchSize: number;
	protected minMatchSize: number;

	get playersInQueue(): number {
		return this.queue.length;
	}

	constructor(resolver: (players: any[]) => void, getKey: (player: any) => string, options?: IMatchMakerOptions) {
		this.resolver = resolver;
		this.getKey = getKey
		this.queue = [];

		this.checkInterval = (options && options.checkInterval && options.checkInterval > 0 && options.checkInterval) || 5000;
		this.maxMatchSize = (options && options.maxMatchSize && options.maxMatchSize > 0 && options.maxMatchSize) || 2;
		this.minMatchSize = (options && options.minMatchSize && options.minMatchSize > 0 && options.minMatchSize) || this.maxMatchSize;

	}

	public push = (player: any): void | Error => {
		if (this.indexOnQueue(player) != -1)
			return new Error(errorMessages.playerInQueue);
		this.queue.push(player);
	}

	public leaveQueue(player: any): void | Error {
		let index = this.indexOnQueue(player);
		if (index == -1)
			return new Error(errorMessages.playerNotInQueue);
		this.queue.splice(index, 1);
	}

	public indexOnQueue = (player: any): number => {
		let playerKey = this.getKey(player);
		let index;
		index = this.queue.findIndex((player) => { return this.getKey(player) == playerKey; });
		return index;
	}

}