type iotszlj = 'i' | 'o' | 't' | 's' | 'z' | 'l' | 'j';

export class Bag {

    static readonly minoTypes: iotszlj[] = ['i', 'o', 't', 's', 'z', 'l', 'j'];

    nextMinos: iotszlj[];

    constructor() {
        this.generateNextMinos();
        this.generateNextMinos();
    }

    generateNextMinos() {
        const minoTypesCOPY = JSON.parse(JSON.stringify(Bag.minoTypes));
        while (minoTypesCOPY.length !== 0) {
            this.nextMinos.push(minoTypesCOPY.splice(Math.floor(Math.random() * minoTypesCOPY.length), 1)[0]);
        }
    }

    shiftNext() {
        if (this.nextMinos.length < 8) {
            this.generateNextMinos();
        }
        const nextMino = this.nextMinos[0];
        this.nextMinos.shift();
        return nextMino;
    }
}