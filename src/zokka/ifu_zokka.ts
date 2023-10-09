//判定用盤面
export class zokfield {
    data: string[][] = [];
    width: number;
    height: number;
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        for (let i1 = 0; i1 < height; i1++) {
            this.data.push([]);
            for (let i2 = 0; i2 < width; i2++) {
                this.data.at(-1)?.push('');
            }
        }
    }
    isblock(x: number, y: number) {
        if (x < 0 || y < 0 || this.width <= x || this.height <= y) {
            return true;
        }
        if (this.data[y][x] !== '') {
            return true;
        }
        return false;
    }
}

//wallkick data
const minokick = {
    jlstz: {
        1: {
            1: {
                0: [-1, 0],
                1: [1, 0],
                2: [1, 0],
                3: [-1, 0]
            },
            '-1': {
                0: [1, 0],
                1: [1, 0],
                2: [-1, 0],
                3: [-1, 0]
            }
        },
        2: {
            1: {
                0: [-1, 1],
                1: [1, -1],
                2: [1, 1],
                3: [-1, -1]
            },
            '-1': {
                0: [1, 1],
                1: [1, -1],
                2: [-1, 1],
                3: [-1, -1]
            }
        },
        3: {
            1: {
                0: [0, -2],
                1: [0, 2],
                2: [0, -2],
                3: [0, 2]
            },
            '-1': {
                0: [0, -2],
                1: [0, 2],
                2: [0, -2],
                3: [0, 2]
            }
        },
        4: {
            1: {
                0: [-1, -2],
                1: [1, 2],
                2: [1, -2],
                3: [-1, 2]
            },
            '-1': {
                0: [1, -2],
                1: [1, 2],
                2: [-1, -2],
                3: [-1, 2]
            }
        }
    },
    i: {
        1: {
            1: {
                0: [-2, 0],
                1: [-1, 0],
                2: [2, 0],
                3: [1, 0]
            },
            '-1': {
                0: [-1, 0],
                1: [2, 0],
                2: [1, 0],
                3: [-2, 0]
            }
        },
        2: {
            1: {
                0: [1, 0],
                1: [2, 0],
                2: [-1, 0],
                3: [-1, 0]
            },
            '-1': {
                0: [2, 0],
                1: [-1, 0],
                2: [-2, 0],
                3: [1, 0]
            }
        },
        3: {
            1: {
                0: [-2, -1],
                1: [-1, 2],
                2: [2, 1],
                3: [1, -2]
            },
            '-1': {
                0: [-1, 2],
                1: [2, 1],
                2: [1, -2],
                3: [-2, -1]
            }
        },
        4: {
            1: {
                0: [1, 2],
                1: [2, -1],
                2: [-1, -2],
                3: [-2, 1]
            },
            '-1': {
                0: [2, -1],
                1: [-1, -2],
                2: [-2, 1],
                3: [1, 2]
            }
        }
    }
};

//判定用ミノ
export class zokmino {
    landing = false;
    fallTimer = 0;
    fallCounter = 0;
    fallCounterCounter = 0;
    angle = 0;
    tspin = false;
    miniTspin = false;
    type: any;
    field: any;
    x: number;
    y: number;
    data: number[][];
    constructor(type: string, fi: zokfield) {
        this.type = type;
        this.field = fi;
        if (type === 'i') {
            this.x = 5;
            this.y = 2;
            this.data = [
                [-3, -1],
                [-1, -1],
                [1, -1],
                [3, -1]
            ];
        } else if (type === 't') {
            this.x = 4;
            this.y = 2;
            this.data = [
                [-1, 0],
                [0, 0],
                [1, 0],
                [0, -1]
            ];
        } else if (type === 'l') {
            this.x = 4;
            this.y = 2;
            this.data = [
                [1, -1],
                [-1, 0],
                [0, 0],
                [1, 0]
            ];
        } else if (type === 'j') {
            this.x = 4;
            this.y = 2;
            this.data = [
                [-1, -1],
                [-1, 0],
                [0, 0],
                [1, 0]
            ];
        } else if (type === 's') {
            this.x = 4;
            this.y = 2;
            this.data = [
                [-1, 0],
                [0, 0],
                [0, -1],
                [1, -1]
            ];
        } else if (type === 'z') {
            this.x = 4;
            this.y = 2;
            this.data = [
                [-1, -1],
                [0, -1],
                [0, 0],
                [1, 0]
            ];
        } else {
            this.x = 5;
            this.y = 1;
            this.data = [
                [-1, -1],
                [-1, 1],
                [1, 1],
                [1, -1]
            ];
        }
        this.y = this.field.height - 20 + this.y;
        let permission = true;
        for (let i = 0; i < this.data.length; i++) {
            const e = this.data[i];
            if (type === 'i' || type === 'o') {
                if (this.field.isblock((e[0] * 15 + this.x * 30 - 15) / 30, (e[1] * 15 + this.y * 30 - 15) / 30)) {
                    permission = false;
                }
            } else {
                if (this.field.isblock(e[0] + this.x, e[1] + this.y)) {
                    permission = false;
                }
            }
        }
        if (permission === false) {
            this.y--;
            permission = true;
            for (let i = 0; i < this.data.length; i++) {
                const e = this.data[i];
                if (type === 'i' || type === 'o') {
                    if (this.field.isblock((e[0] * 15 + this.x * 30 - 15) / 30, (e[1] * 15 + this.y * 30 - 15) / 30)) {
                        permission = false;
                    }
                } else {
                    if (this.field.isblock(e[0] + this.x, e[1] + this.y)) {
                        permission = false;
                    }
                }
            }
            if (permission === false) {
                this.y--;
                permission = true;
                for (let i = 0; i < this.data.length; i++) {
                    const e = this.data[i];
                    if (type === 'i' || type === 'o') {
                        if (this.field.isblock((e[0] * 15 + this.x * 30 - 15) / 30, (e[1] * 15 + this.y * 30 - 15) / 30)) {
                            permission = false;
                        }
                    } else {
                        if (this.field.isblock(e[0] + this.x, e[1] + this.y)) {
                            permission = false;
                        }
                    }
                }
                if (permission === false) {
                    if (this.type !== 'i' || this.type !== 'o') {
                        this.y--;
                        permission = true;
                        for (let i = 0; i < this.data.length; i++) {
                            const e = this.data[i];
                            if (this.field.isblock(e[0] + this.x, e[1] + this.y)) {
                                permission = false;
                            }
                        }
                        if (permission === false) {
                            if (this.field.gameover != null) {
                                this.field.gameover();
                            }
                        }
                    } else if (this.field.gameover != null) {
                        this.field.gameover();
                    }
                }
            }
        }
    }
    rotate(RorL: number, count = 0) {
        //srs
        const testXY = {
            x: this.x,
            y: this.y
        };
        if (count > 0) {
            if ((count === 1 || count === 2 || count === 3 || count === 4) && (RorL === 1 || RorL === -1) && (this.angle === 0 || this.angle === 1 || this.angle === 2 || this.angle === 3)) {
                testXY.x = this.x + ((this.type === 'i') ? minokick.i : minokick.jlstz)[count][RorL][this.angle][0];
                testXY.y = this.y - ((this.type === 'i') ? minokick.i : minokick.jlstz)[count][RorL][this.angle][1];
            }
        }
        if (RorL === 1) {
            for (let i = 0; i < this.data.length; i++) {
                const e = this.data[i];
                const ex = e[0];
                const ey = e[1];
                e[0] = -ey;
                e[1] = ex;
            }
        } else if (RorL === -1) {
            for (let i = 0; i < this.data.length; i++) {
                const e = this.data[i];
                const ex = e[0];
                const ey = e[1];
                e[0] = ey;
                e[1] = -ex;
            }
        }
        let permission = true;
        for (let i = 0; i < this.data.length; i++) {
            const e = this.data[i];
            if (this.type === 'i' || this.type === 'o') {
                if (this.field.isblock((e[0] * 15 + testXY.x * 30 - 15) / 30, (e[1] * 15 + testXY.y * 30 - 15) / 30)) {
                    permission = false;
                }
            } else {
                if (this.field.isblock(e[0] + testXY.x, e[1] + testXY.y)) {
                    permission = false;
                }
            }
        }
        if (permission === false) {
            if (RorL === -1) {
                for (let i = 0; i < this.data.length; i++) {
                    const e = this.data[i];
                    const ex = e[0];
                    const ey = e[1];
                    e[0] = -ey;
                    e[1] = ex;
                }
            } else if (RorL === 1) {
                for (let i = 0; i < this.data.length; i++) {
                    const e = this.data[i];
                    const ex = e[0];
                    const ey = e[1];
                    e[0] = ey;
                    e[1] = -ex;
                }
            }
            if (count !== 4) {
                this.rotate(RorL, ++count);
            }
        } else {
            this.x = testXY.x;
            this.y = testXY.y;
            this.angle += RorL;
            this.fallCounter = 1;
            if (this.angle === 4) {
                this.angle = 0;
            } else if (this.angle === -1) {
                this.angle = 3;
            }
            if (this.type === 't') {
                let isTspin = 0;
                if (this.field.isblock(this.x - 1, this.y - 1)) {
                    isTspin++;
                }
                if (this.field.isblock(this.x + 1, this.y - 1)) {
                    isTspin++;
                }
                if (this.field.isblock(this.x + 1, this.y + 1)) {
                    isTspin++;
                }
                if (this.field.isblock(this.x - 1, this.y + 1)) {
                    isTspin++;
                }
                if (2 < isTspin) {
                    this.tspin = true;
                }
                if (this.tspin) {
                    if (this.angle === 0) {
                        if (this.field.isblock(this.x + 1, this.y - 1) === false || this.field.isblock(this.x - 1, this.y - 1) === false) {
                            this.miniTspin = true;
                        }
                    } else if (this.angle === 1) {
                        if (this.field.isblock(this.x + 1, this.y + 1) === false || this.field.isblock(this.x + 1, this.y - 1) === false) {
                            this.miniTspin = true;
                        }
                    } else if (this.angle === 2) {
                        if (this.field.isblock(this.x + 1, this.y + 1) === false || this.field.isblock(this.x - 1, this.y + 1) === false) {
                            this.miniTspin = true;
                        }
                    } else if (this.angle === 3) {
                        if (this.field.isblock(this.x - 1, this.y + 1) === false || this.field.isblock(this.x - 1, this.y - 1) === false) {
                            this.miniTspin = true;
                        }
                    }
                }
            }
        }
    }
    control(key: string) {
        if (this.landing === false) {
            if (key === 'drop') {
                while (this.landing === false) {
                    this.minodown();
                }
            } else if (key === 'rotate1') {
                this.rotate(1);
            } else if (key === 'rotate2') {
                this.rotate(-1);
            } else if (key === 'right') {
                let permission = true;
                for (let i = 0; i < this.data.length; i++) {
                    const e = this.data[i];
                    if (this.type === 'i' || this.type === 'o') {
                        if (this.field.isblock((e[0] * 15 + this.x * 30 - 15) / 30 + 1, (e[1] * 15 + this.y * 30 - 15) / 30)) {
                            permission = false;
                        }
                    } else {
                        if (this.field.isblock(e[0] + this.x + 1, e[1] + this.y)) {
                            permission = false;
                        }
                    }
                }
                if (permission === true) {
                    this.fallCounter = 1;
                    this.x++;
                    this.tspin = false;
                    this.miniTspin = false;
                }
            } else if (key === 'down') {
                this.y++;
                let permission = true;
                for (let i = 0; i < this.data.length; i++) {
                    const e = this.data[i];
                    if (this.type === 'i' || this.type === 'o') {
                        if (this.field.isblock((e[0] * 15 + this.x * 30 - 15) / 30, (e[1] * 15 + this.y * 30 - 15) / 30)) {
                            permission = false;
                        }
                    } else {
                        if (this.field.isblock(e[0] + this.x, e[1] + this.y)) {
                            permission = false;
                        }
                    }
                }
                if (permission === false) {
                    this.y--;
                } else {
                    this.tspin = false;
                    this.miniTspin = false;
                }
            } else if (key === 'left') {
                let permission = true;
                for (let i = 0; i < this.data.length; i++) {
                    const e = this.data[i];
                    if (this.type === 'i' || this.type === 'o') {
                        if (this.field.isblock((e[0] * 15 + this.x * 30 - 15) / 30 - 1, (e[1] * 15 + this.y * 30 - 15) / 30)) {
                            permission = false;
                        }
                    } else {
                        if (this.field.isblock(e[0] + this.x - 1, e[1] + this.y)) {
                            permission = false;
                        }
                    }
                }
                if (permission === true) {
                    this.fallCounter = 1;
                    this.x--;
                    this.tspin = false;
                    this.miniTspin = false;
                }
            }
        }
    }
    minodown() {
        if (this.landing === false) {
            this.y++;
            let permission = true;
            for (let i = 0; i < this.data.length; i++) {
                const e = this.data[i];
                if (this.type === 'i' || this.type === 'o') {
                    if (this.field.isblock((e[0] * 15 + this.x * 30 - 15) / 30, (e[1] * 15 + this.y * 30 - 15) / 30)) {
                        permission = false;
                    }
                } else {
                    if (this.field.isblock(e[0] + this.x, e[1] + this.y)) {
                        permission = false;
                    }
                }
            }
            if (permission === false) {
                this.y--;
                if (this.fallCounter !== 1 || 5 < this.fallCounterCounter) {
                    this.landing = true;
                    for (let i = 0; i < this.data.length; i++) {
                        const e = this.data[i];
                        if (this.type === 'i' || this.type === 'o') {
                            if (0 <= (e[1] * 15 + this.y * 30 - 15) / 30) {
                                this.field.data[(e[1] * 15 + this.y * 30 - 15) / 30][(e[0] * 15 + this.x * 30 - 15) / 30] = this.type;
                            }
                        } else {
                            if (0 <= e[1] + this.y) {
                                this.field.data[e[1] + this.y][e[0] + this.x] = this.type;
                            }
                        }
                    }
                } else {
                    this.fallCounterCounter++;
                }
            } else {
                this.tspin = false;
                this.miniTspin = false;
            }
            this.fallCounter = 0;
        }
    }
}
const mino7 = ["i", "t", "o", "s", "z", "l", "j"];
const main = new zokfield(10, 20);
let hold = 'none';
let next = [];

function difheight(board: string[][]) {
    let columnHighest = 0;
    let score = 0;
    for (let index1 = 0; index1 < 10; index1++) {
        for (let index2 = 0; index2 < 20; index2++) {
            if (board[index2][index1] !== '') {
                if (index1 !== 0) {
                    score += Math.abs(columnHighest - (20 - index2));
                }
                columnHighest = 20 - index2;
                break;
            } else if (index2 === 19) {
                score += Math.abs(columnHighest);
                columnHighest = 0;
                break;
            }
        }
    }
    return score;
}

function counthole(board: string[][]) {
    let score = 0;
    for (let index1 = 0; index1 < 10; index1++) {
        let emptyLowest = null;
        for (let index2 = 19; index2 >= 0; index2--) {
            if (board[index2][index1] !== '' && emptyLowest !== null) {
                score += (emptyLowest - index2);
                emptyLowest = null;
            }
            if (board[index2][index1] === '' && emptyLowest === null) {
                emptyLowest = index2;
            }
        }
    }
    return score;
}

function droptest(board: any, mino: string, hold = false) {
    let topscore = [];
    const boarddata = JSON.stringify(board);
    let maxangle = 2;
    if (mino === 't' || mino === 'l' || mino === 'j') {
        maxangle = 4;
    }
    for (let angle = 0; angle < maxangle; angle++) {
        for (let count = -(Math.round(10 / 2) + 1); count < Math.round(10 / 2) + 1; count++) {
            const testboard = new zokfield(10, 20);
            testboard.data = JSON.parse(boarddata);
            const testmino = new zokmino(mino, testboard);
            let anglecount = angle;
            let movecount = count;
            let clearline = 0;
            let testscore = 0;
            while (anglecount !== 0) {
                testmino.control('rotate1');
                anglecount--;
            }
            if (movecount < 0) {
                while (movecount !== 0) {
                    testmino.control('left');
                    movecount++;
                }
            } else {
                while (movecount !== 0) {
                    testmino.control('right');
                    movecount--;
                }
            }
            testmino.control('drop');

            for (let index = 0; index < testboard.data.length; index++) {
                const element = testboard.data[index];
                if (element.join('').length === 10) {
                    testboard.data.splice(index, 1);
                    const insertArray = [];
                    for (let number = 0; number < 10; number++) {
                        insertArray.push('');
                    }
                    testboard.data.unshift(insertArray);
                    clearline++;
                }
            }

            //calculate score
            /** ミノをおいた高さ */
            const calc_lh = 20 - testmino.y;
            /** 消したライン数 */
            const calc_cp = clearline;
            /** 横方向のマス変化回数 */
            // const calc_rt = rowtransition(testboard.data);
            /** 縦方向のマス変化回数 */
            // const calc_ct = columntransition(testboard.data);
            /** 穴の数 */
            const calc_nh = counthole(testboard.data);
            const calc_beforenh = counthole(JSON.parse(boarddata));
            /** でこぼこ度 */
            const calc_cw = difheight(testboard.data);

            //計算
            testscore += calc_cp - calc_cw - 2 * calc_nh;

            if (calc_lh > 15) {
                testscore += calc_cp - calc_cw - 2 * calc_nh;
            } else if (calc_lh > 10 || calc_nh > 0) {
                if (calc_nh - calc_beforenh < 1 && (calc_cp === 0 || calc_cp > 3)) {
                    testscore += calc_cp - calc_cw - 2 * calc_nh + 10;
                } else {
                    testscore += calc_cp - calc_cw - 2 * calc_nh;
                }
            } else {
                if (calc_nh - calc_beforenh < 1 && (calc_cp === 0 || calc_cp > 3)) {
                    testscore += calc_cp - calc_cw - 2 * calc_nh + 100;
                } else {
                    testscore += calc_cp - calc_cw - 2 * calc_nh;
                }
            }

            //比較
            if (topscore.length === 10) {
                if (testscore > topscore[9].score) {
                    topscore.splice(9, 1, {
                        score: testscore,
                        board: testboard,
                        mino: testmino,
                        hold: hold,
                        clearline: calc_cp,
                        testlog: calc_lh
                    });
                    topscore.sort(function (a, b) {
                        let x = a.score - 0;
                        let y = b.score - 0;
                        if (x > y) {
                            return -1;
                        }
                        if (x < y) {
                            return 1;
                        }
                        return 0;
                    });
                }
            } else {
                topscore.push({
                    score: testscore,
                    board: testboard,
                    mino: testmino,
                    hold: hold,
                    clearline: calc_cp,
                    testlog: calc_lh
                });
                topscore.sort(function (a, b) {
                    let x = a.score - 0;
                    let y = b.score - 0;
                    if (x > y) {
                        return -1;
                    }
                    if (x < y) {
                        return 1;
                    }
                    return 0;
                });
            }
        }
    }
    return topscore;
}

function boardtest(board: any, mino: any) {
    const boardcopy = JSON.parse(JSON.stringify(board));
    const join1 = [];
    for (let index1 = 0; index1 < boardcopy.length; index1++) {
        let join2 = '';
        const element1 = boardcopy[index1];
        for (let index2 = 0; index2 < element1.length; index2++) {
            const element2 = element1[index2];
            if (element2 === '') {
                join2 += ' ';
            } else {
                join2 += element2;
            }
        }
        join1.push(join2);
    }
    const boardstring = join1.join('E');
}


function run(board: any, nowmino1: any, holdmino1: any) {

    //nowmino
    const nowminotest1 = droptest(board, nowmino1);
    //holdmino
    const holdminotest1 = droptest(board, holdmino1, true);
    const nowresult1 = [...nowminotest1, ...holdminotest1];
    nowresult1.sort(function (a, b) {
        let x = a.score - 0;
        let y = b.score - 0;
        if (x > y) {
            return -1;
        }
        if (x < y) {
            return 1;
        }
        return 0;
    });

    const result = {
        ...nowresult1[0],
        finish: false
    }
    return result;
}

export function simulation(board: string[][], nowmino: string, next: string, hold: string) {
    if (hold === 'none') {
        return run(board, nowmino, next);
    } else {
        return run(board, nowmino, hold);
    }
}
