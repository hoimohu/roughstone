type iotszlj = 'i' | 'o' | 't' | 's' | 'z' | 'l' | 'j';

export class Bag {

    static readonly minoTypes: iotszlj[] = ['i', 'o', 't', 's', 'z', 'l', 'j'];

    nextMinos: iotszlj[] = [];

    constructor() {
        this.nextMinos.push(...this.generateNextMinos(), ...this.generateNextMinos());
    }

    generateNextMinos() {
        const minoTypesCOPY = [...Bag.minoTypes];
        const generatedMinos: iotszlj[] = [];
        while (minoTypesCOPY.length !== 0) {
            generatedMinos.push(minoTypesCOPY.splice(Math.floor(Math.random() * minoTypesCOPY.length), 1)[0]);
        }
        return generatedMinos;
    }

    shiftNext() {
        if (this.nextMinos.length < 8) {
            this.nextMinos.push(...this.generateNextMinos());
        }
        const nextMino = this.nextMinos[0];
        this.nextMinos.shift();
        return nextMino;
    }
}