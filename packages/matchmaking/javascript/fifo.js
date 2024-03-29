"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const matchMaker_1 = require("./matchMaker");
class FifoMatchmaker extends matchMaker_1.Matchmaker {
    constructor(resolver, getKey, options) {
        super(resolver, getKey, options);
        this.FifoMatch = () => {
            let players;
            while (this.queue.length >= this.minMatchSize) {
                players = [];
                while (this.queue.length > 0 && players.length < this.maxMatchSize) {
                    players.push(this.queue.pop());
                }
                this.resolver(players);
            }
        };
        setInterval(this.FifoMatch, this.checkInterval);
    }
}
exports.FifoMatchmaker = FifoMatchmaker;
//# sourceMappingURL=fifo.js.map